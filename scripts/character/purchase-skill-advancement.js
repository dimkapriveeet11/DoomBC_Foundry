import { logger } from "../core/logger.js";

import {
  getAdvancementCostDetails
} from "./advancement-costs.js";

import {
  getSkillDefinition,
  getSkillDisplayName,
  resolveSkillPatronage
} from "../data/skill-catalog.js";

import {
  getAvailableExperience
} from "./purchase-characteristic-advancement.js";

const SKILL_ADVANCES = [
  0,
  10,
  20,
  30
];

function validateActor(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | purchaseSkillAdvancement: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (
    !actor.system.creation.completed.patronage
  ) {
    throw new Error(
      "DoomBC | Сначала необходимо завершить выбор Покровительства."
    );
  }
}

function normalizeSpecialization(
  specialization
) {
  return String(
    specialization ?? ""
  ).trim();
}

function findSkill(
  actor,
  skillKey,
  specialization
) {
  const spec =
    normalizeSpecialization(
      specialization
    ).toLowerCase();

  return actor.items.find(item => {
    if (item.type !== "skill") {
      return false;
    }

    if (
      String(item.system.key ?? "") !==
      skillKey
    ) {
      return false;
    }

    const itemSpec =
      String(
        item.system.specialization ?? ""
      )
        .trim()
        .toLowerCase();

    return itemSpec === spec;
  }) ?? null;
}

function copyPurchase(
  purchase
) {
  return {
    type:
      String(purchase.type ?? ""),

    key:
      String(purchase.key ?? ""),

    level:
      Number(purchase.level ?? 0),

    advancementPatronage:
      String(
        purchase.advancementPatronage ?? ""
      ),

    relation:
      String(purchase.relation ?? ""),

    cost:
      Number(purchase.cost ?? 0)
  };
}

export async function purchaseSkillAdvancement(
  actor,
  skillKey,
  specialization = ""
) {
  validateActor(actor);

  const key =
    String(skillKey ?? "").trim();

  const definition =
    getSkillDefinition(key);

  if (!definition) {
    throw new Error(
      `DoomBC | Неизвестный Навык: ${skillKey}`
    );
  }

  const spec =
    normalizeSpecialization(
      specialization
    );

  if (
    definition.group &&
    !spec
  ) {
    throw new Error(
      `DoomBC | Для группы Навыков "${definition.name}" нужно указать специализацию.`
    );
  }

  if (
    !definition.group &&
    spec
  ) {
    throw new Error(
      `DoomBC | Навык "${definition.name}" не использует специализацию.`
    );
  }

  const existing =
    findSkill(
      actor,
      key,
      spec
    );

  let nextLevel;

  if (!existing) {
    nextLevel = 0;
  } else {
    const currentLevel =
      Number(
        existing.system.advance ?? 0
      );

    const index =
      SKILL_ADVANCES.indexOf(
        currentLevel
      );

    if (index === -1) {
      throw new Error(
        `DoomBC | Некорректное продвижение Навыка "${existing.name}": +${currentLevel}.`
      );
    }

    if (
      index ===
      SKILL_ADVANCES.length - 1
    ) {
      throw new Error(
        `DoomBC | Навык "${existing.name}" уже имеет максимальное продвижение +30.`
      );
    }

    nextLevel =
      SKILL_ADVANCES[index + 1];
  }

  const advancementPatronage =
    resolveSkillPatronage(
      key,
      spec
    );

  const details =
    getAdvancementCostDetails(
      actor,
      "skill",
      nextLevel,
      advancementPatronage
    );

  const cost =
    Number(details.cost);

  const available =
    getAvailableExperience(actor);

  if (available < cost) {
    throw new Error(
      `DoomBC | Недостаточно опыта. Нужно ${cost} XP, доступно ${available} XP.`
    );
  }

  const currentSpent =
    Number(
      actor.system.experience.spent ?? 0
    );

  const purchases =
    Array.from(
      actor.system.experience.purchases ??
      []
    ).map(copyPurchase);

  const displayName =
    getSkillDisplayName(
      key,
      spec
    );

  const purchaseKey =
    spec
      ? `${key}:${spec}`
      : key;

  purchases.push({
    type: "skill",
    key: purchaseKey,
    level: nextLevel,
    advancementPatronage,
    relation: details.relation,
    cost
  });

  let skill;

  if (!existing) {
    [skill] =
      await actor.createEmbeddedDocuments(
        "Item",
        [
          {
            name: displayName,
            type: "skill",

            system: {
              key,
              characteristic:
                definition.characteristic,

              patronage:
                advancementPatronage,

              specialization:
                spec,

              group:
                definition.group,

              canUseUntrained:
                definition.canUseUntrained,

              advance:
                nextLevel
            }
          }
        ]
      );
  } else {
    await existing.update({
      "system.advance":
        nextLevel,

      "system.patronage":
        advancementPatronage
    });

    skill = existing;
  }

  await actor.update({
    "system.experience.spent":
      currentSpent + cost,

    "system.experience.purchases":
      purchases
  });

  logger.info(
    `Skill advancement purchased: ${displayName} +${nextLevel}, ${details.relation}, ${cost} XP -> ${actor.name}`
  );

  return {
    actor,
    skill,
    skillKey: key,
    specialization: spec,
    level: nextLevel,
    advancementPatronage,
    relation: details.relation,
    cost,
    availableBefore: available,
    availableAfter:
      available - cost
  };
}
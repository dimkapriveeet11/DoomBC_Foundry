import { logger } from "../core/logger.js";

import {
  getAdvancementCostDetails
} from "./advancement-costs.js";

import {
  getTalentDefinition,
  getTalentDisplayName
} from "../data/talent-catalog.js";

import {
  getAvailableExperience
} from "./purchase-characteristic-advancement.js";

import {
  assertTalentPrerequisites
} from "./talent-prerequisites.js";

function validateActor(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | purchaseTalent: Actor не найден."
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

function hasTalent(
  actor,
  talentKey,
  specialization = ""
) {
  const spec =
    normalizeSpecialization(
      specialization
    ).toLowerCase();

  return actor.items.some(item => {
    if (item.type !== "talent") {
      return false;
    }

    if (
      String(item.system.key ?? "") !==
      talentKey
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
  });
}

export async function purchaseTalent(
  actor,
  talentKey,
  specialization = ""
) {
  validateActor(actor);

  const key =
    String(talentKey ?? "").trim();

  const definition =
    getTalentDefinition(key);

  if (!definition) {
    throw new Error(
      `DoomBC | Неизвестный Талант: ${talentKey}`
    );
  }

  const spec =
    normalizeSpecialization(
      specialization
    );

  if (
    !definition.repeatable &&
    hasTalent(
      actor,
      key,
      spec
    )
  ) {
    throw new Error(
      `DoomBC | Талант "${getTalentDisplayName(
        key,
        spec
      )}" уже приобретён.`
    );
  }

  const prerequisiteResult =
    assertTalentPrerequisites(
      actor,
      key
    );

  const details =
    getAdvancementCostDetails(
      actor,
      "talent",
      definition.tier,
      definition.patronage
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

  const purchaseKey =
    spec
      ? `${key}:${spec}`
      : key;

  purchases.push({
    type: "talent",
    key: purchaseKey,
    level: definition.tier,
    advancementPatronage:
      definition.patronage,
    relation:
      details.relation,
    cost
  });

  const displayName =
    getTalentDisplayName(
      key,
      spec
    );

  const [talent] =
    await actor.createEmbeddedDocuments(
      "Item",
      [
        {
          name:
            displayName,

          type:
            "talent",

          system: {
            key:
              definition.key,

            tier:
              definition.tier,

            patronage:
              definition.patronage,

            prerequisites:
              definition.prerequisites,

            requirements:
              definition.requirements ?? [],

            specialization:
              spec,

            repeatable:
              definition.repeatable,

            description:
              definition.description
          }
        }
      ]
    );

  await actor.update({
    "system.experience.spent":
      currentSpent + cost,

    "system.experience.purchases":
      purchases
  });

  logger.info(
    `Talent purchased: ${displayName}, Tier ${definition.tier}, ${details.relation}, ${cost} XP -> ${actor.name}`
  );

  return {
    actor,
    talent,
    key,
    specialization: spec,

    tier:
      definition.tier,

    patronage:
      definition.patronage,

    relation:
      details.relation,

    cost,

    prerequisites:
      prerequisiteResult,

    availableBefore:
      available,

    availableAfter:
      available - cost
  };
}
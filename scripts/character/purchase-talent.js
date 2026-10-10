import { getSoundConstitutionDetails } from "./sound-constitution.js";

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

function validateSpecialization(
  definition,
  specialization
) {
  const allowed =
    Array.from(
      definition.specializations ?? []
    );

  if (allowed.length === 0) {
    if (specialization) {
      throw new Error(
        `DoomBC | Талант "${definition.name}" не использует специализацию.`
      );
    }

    return "";
  }

  if (!specialization) {
    throw new Error(
      `DoomBC | Для Таланта "${definition.name}" необходимо выбрать специализацию: ${allowed.join(", ")}.`
    );
  }

  const matched =
    allowed.find(
      option =>
        option.toLowerCase() ===
        specialization.toLowerCase()
    );

  if (!matched) {
    throw new Error(
      `DoomBC | Недопустимая специализация "${specialization}" для Таланта "${definition.name}". Допустимо: ${allowed.join(", ")}.`
    );
  }

  return matched;
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

// Use this talent-aware preview for special prices; generic Tier tables are unchanged.
export function getTalentPurchaseDetails(actor, talentKey) {
  validateActor(actor);
  const definition = getTalentDefinition(talentKey);
  if (!definition) throw new Error(`DoomBC | Неизвестный Талант: ${talentKey}`);
  if (definition.key === "soundConstitution") return getSoundConstitutionDetails(actor);
  return getAdvancementCostDetails(actor, "talent", definition.tier, definition.patronage);
}

// Prevent overlapping purchases on the same local Actor from bypassing the cap
// or overwriting XP/history. This is not a lock across different Foundry clients.
const pendingPurchases = new WeakSet();

export async function purchaseTalent(actor, talentKey, specialization = "") {
  validateActor(actor);
  if (pendingPurchases.has(actor)) {
    throw new Error("DoomBC | Дождитесь завершения предыдущей покупки Таланта.");
  }
  pendingPurchases.add(actor);
  try {
    return await performTalentPurchase(actor, talentKey, specialization);
  } finally {
    pendingPurchases.delete(actor);
  }
}

async function performTalentPurchase(
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

  const requestedSpec =
    normalizeSpecialization(
      specialization
    );

  const spec =
    validateSpecialization(
      definition,
      requestedSpec
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

  const details = getTalentPurchaseDetails(actor, key);
  if (key === "soundConstitution" && details.remaining === 0) {
    throw new Error(`DoomBC | Достигнут лимит Sound Constitution: ${details.purchased}/${details.limit}.`);
  }

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

            specializations:
              definition.specializations ?? [],

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
    `Talent purchased: ${displayName}, ${definition.tier === 0 ? "Особое" : `Tier ${definition.tier}`}, ${details.relation}, ${cost} XP -> ${actor.name}`
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
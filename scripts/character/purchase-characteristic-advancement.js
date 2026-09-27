import { logger } from "../core/logger.js";

import {
  getCharacteristicAdvancementCostDetails
} from "./advancement-costs.js";

const CHARACTERISTICS = [
  "weaponSkill",
  "ballisticSkill",
  "strength",
  "toughness",
  "agility",
  "intelligence",
  "perception",
  "willpower",
  "fellowship"
];

function validateActor(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | purchaseCharacteristicAdvancement: Actor не найден."
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

export function getAvailableExperience(
  actor
) {
  validateActor(actor);

  const total =
    Number(
      actor.system.experience.total ?? 0
    );

  const spent =
    Number(
      actor.system.experience.spent ?? 0
    );

  return total - spent;
}

export async function purchaseCharacteristicAdvancement(
  actor,
  characteristic
) {
  validateActor(actor);

  const key =
    String(characteristic ?? "")
      .trim();

  if (!CHARACTERISTICS.includes(key)) {
    throw new Error(
      `DoomBC | Неизвестная Характеристика: ${characteristic}`
    );
  }

  const data =
    actor.system.characteristics[key];

  const currentAdvances =
    Number(data.advances ?? 0);

  if (
    !Number.isInteger(currentAdvances) ||
    currentAdvances < 0 ||
    currentAdvances > 25 ||
    currentAdvances % 5 !== 0
  ) {
    throw new Error(
      `DoomBC | Некорректное значение продвижения ${key}: ${currentAdvances}`
    );
  }

  if (currentAdvances >= 25) {
    throw new Error(
      `DoomBC | ${key} уже имеет максимальное продвижение +25.`
    );
  }

  const nextLevel =
    currentAdvances + 5;

  const details =
    getCharacteristicAdvancementCostDetails(
      actor,
      key,
      nextLevel
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
      actor.system.experience.purchases ?? []
    ).map(
      purchase => ({
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
      })
    );

  purchases.push({
    type: "characteristic",
    key,
    level: nextLevel,
    advancementPatronage: "",
    relation: details.relation,
    cost
  });

  await actor.update({
    [`system.characteristics.${key}.advances`]:
      nextLevel,

    "system.experience.spent":
      currentSpent + cost,

    "system.experience.purchases":
      purchases
  });

  logger.info(
    `Characteristic advancement purchased: ${key} +${nextLevel}, ${details.relation}, ${cost} XP -> ${actor.name}`
  );

  return {
    actor,
    characteristic: key,
    level: nextLevel,
    relation: details.relation,
    cost,
    availableBefore: available,
    availableAfter: available - cost
  };
}
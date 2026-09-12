import { logger } from "../core/logger.js";

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

export function pointBuyCost(value) {
  if (!Number.isInteger(value) || value < 2 || value > 20) {
    throw new Error(
      `DoomBC | Недопустимое значение Сборки: ${value}`
    );
  }

  if (value <= 18) {
    return value;
  }

  if (value === 19) {
    return 20;
  }

  return 23;
}

export async function setPointBuyValue(
  actor,
  characteristic,
  value
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | setPointBuyValue: Actor не найден."
    );
  }

  if (
    actor.system.creation.step !== "characteristics" ||
    actor.system.creation.method !== "pointBuy"
  ) {
    throw new Error(
      "DoomBC | Сборка сейчас недоступна."
    );
  }

  if (!CHARACTERISTICS.includes(characteristic)) {
    throw new Error(
      `DoomBC | Неизвестная характеристика: ${characteristic}`
    );
  }

  const numericValue = Number(value);

  pointBuyCost(numericValue);

  const allocations = {};

  for (const key of CHARACTERISTICS) {
    allocations[key] =
      Number(
        actor.system.creation.pointBuy.allocations[key]
      );
  }

  allocations[characteristic] =
    numericValue;

  const spent = CHARACTERISTICS.reduce(
    (total, key) =>
      total + pointBuyCost(allocations[key]),
    0
  );

  const budget =
    Number(actor.system.creation.pointBuy.budget);

  if (spent > budget) {
    throw new Error(
      `DoomBC | Недостаточно очков. Нужно ${spent}, доступно ${budget}.`
    );
  }

  await actor.update({
    [`system.creation.pointBuy.allocations.${characteristic}`]:
      numericValue,

    "system.creation.pointBuy.spent":
      spent
  });

  logger.info(
    `Point Buy: ${characteristic} = +${numericValue}; spent ${spent}/${budget}`
  );

  return actor;
}
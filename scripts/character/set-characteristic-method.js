import { logger } from "../core/logger.js";

const METHODS = [
  "generation",
  "pointBuy"
];

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

export async function setCharacteristicMethod(
  actor,
  method
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | setCharacteristicMethod: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "characteristics") {
    throw new Error(
      `DoomBC | Нельзя выбрать метод характеристик на этапе "${actor.system.creation.step}".`
    );
  }

  if (!METHODS.includes(method)) {
    throw new Error(
      `DoomBC | Неизвестный метод характеристик: ${method}`
    );
  }

  const race = actor.items.find(
    item => item.type === "race"
  );

  if (!race) {
    throw new Error(
      "DoomBC | У персонажа отсутствует Race Item."
    );
  }

  const updateData = {
    "system.creation.method": method
  };

  for (const key of CHARACTERISTICS) {
    updateData[
      `system.characteristics.${key}.creation`
    ] = 0;
  }

  if (method === "pointBuy") {
    const bonusPoints =
      Number(race.system.bonusPoints ?? 0);

    const budget =
      100 + bonusPoints;

    updateData[
      "system.creation.pointBuy.budget"
    ] = budget;

    updateData[
      "system.creation.pointBuy.spent"
    ] = 18;

    updateData[
      "system.creation.pointBuy.confirmed"
    ] = false;

    for (const key of CHARACTERISTICS) {
      updateData[
        `system.creation.pointBuy.allocations.${key}`
      ] = 2;
    }

    logger.info(
      `Point Buy initialized: ${budget} points for ${actor.name}`
    );
  }

  await actor.update(updateData);

  logger.info(
    `Characteristic creation method: ${method} -> ${actor.name}`
  );

  return actor;
}
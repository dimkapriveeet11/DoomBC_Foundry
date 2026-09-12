import { logger } from "../core/logger.js";

async function rollCharacteristicSet(count) {
  const results = [];

  for (let i = 0; i < count; i++) {
    const roll = await new Roll("2d10").evaluate();
    results.push(roll.total);
  }

  return results;
}

export async function generateCharacteristics(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | generateCharacteristics: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "characteristics") {
    throw new Error(
      `DoomBC | Генерация характеристик недоступна на этапе "${actor.system.creation.step}".`
    );
  }

  if (actor.system.creation.method !== "generation") {
    throw new Error(
      "DoomBC | Для персонажа не выбран метод Генерация."
    );
  }

  const race = actor.items.find(
    item => item.type === "race"
  );

  if (!race) {
    throw new Error(
      "DoomBC | У персонажа отсутствует выбранная раса."
    );
  }

  const bonusRolls = Number(
    race.system.bonusRolls ?? 0
  );

  const rollCount = 9 + bonusRolls;

  const setA = await rollCharacteristicSet(rollCount);
  const setB = await rollCharacteristicSet(rollCount);

  await actor.update({
    "system.creation.generation.generated": true,
    "system.creation.generation.setA": setA,
    "system.creation.generation.setB": setB,
    "system.creation.generation.selectedSet": ""
  });

  logger.info(
    `Characteristic sets generated for ${actor.name}: ${rollCount} rolls per set`
  );

  logger.debug("Generation Set A:", setA);
  logger.debug("Generation Set B:", setB);

  return {
    setA,
    setB,
    rollCount
  };
}
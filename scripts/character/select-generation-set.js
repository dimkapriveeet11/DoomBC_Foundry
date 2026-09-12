import { logger } from "../core/logger.js";

const VALID_SETS = ["A", "B"];

const CHARACTERISTIC_KEYS = [
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

export async function selectGenerationSet(actor, setName) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | selectGenerationSet: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "characteristics") {
    throw new Error(
      `DoomBC | Нельзя выбирать набор на этапе "${actor.system.creation.step}".`
    );
  }

  if (actor.system.creation.method !== "generation") {
    throw new Error(
      "DoomBC | Для персонажа не выбран метод Генерация."
    );
  }

  if (!actor.system.creation.generation.generated) {
    throw new Error(
      "DoomBC | Сначала необходимо сгенерировать два набора."
    );
  }

  if (!VALID_SETS.includes(setName)) {
    throw new Error(
      `DoomBC | Неизвестный набор: ${setName}`
    );
  }

  const generation = actor.system.creation.generation;

  const source =
    setName === "A"
      ? Array.from(generation.setA)
      : Array.from(generation.setB);

  if (source.length < 9) {
    throw new Error(
      "DoomBC | В выбранном наборе меньше 9 результатов."
    );
  }

  // Оставляем девять самых высоких результатов.
  const selectedValues = [...source]
    .sort((a, b) => b - a)
    .slice(0, 9);

  const updateData = {
    "system.creation.generation.selectedSet": setName,
    "system.creation.generation.selectedValues":
      selectedValues
  };

  // При выборе или смене набора сбрасываем распределение.
  for (const key of CHARACTERISTIC_KEYS) {
    updateData[
      `system.creation.generation.assignments.${key}`
    ] = -1;
  }

  await actor.update(updateData);

  logger.info(
    `Generation Set ${setName} selected for ${actor.name}`
  );

  logger.debug(
    "Selected characteristic values:",
    selectedValues
  );

  return selectedValues;
}
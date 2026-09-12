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

export async function assignGenerationResult(
  actor,
  characteristic,
  slotIndex
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | assignGenerationResult: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (!CHARACTERISTICS.includes(characteristic)) {
    throw new Error(
      `DoomBC | Неизвестная характеристика: ${characteristic}`
    );
  }

  const generation =
    actor.system.creation.generation;

  if (
    actor.system.creation.method !== "generation" ||
    !generation.generated ||
    !generation.selectedSet
  ) {
    throw new Error(
      "DoomBC | Сначала необходимо сгенерировать и выбрать набор."
    );
  }

  const values = Array.from(
    generation.selectedValues
  );

  if (values.length !== 9) {
    throw new Error(
      "DoomBC | Должно быть ровно 9 выбранных результатов."
    );
  }

  if (
    !Number.isInteger(slotIndex) ||
    slotIndex < -1 ||
    slotIndex > 8
  ) {
    throw new Error(
      `DoomBC | Недопустимый слот: ${slotIndex}`
    );
  }

  const updateData = {};

  // -1 означает убрать назначение.
  if (slotIndex === -1) {
    updateData[
      `system.creation.generation.assignments.${characteristic}`
    ] = -1;

    await actor.update(updateData);

    logger.debug(
      `Generation assignment cleared: ${characteristic}`
    );

    return actor;
  }

  // Один и тот же кубик нельзя использовать дважды.
  // Если он уже стоял на другой характеристике,
  // освобождаем ту характеристику.
  for (const key of CHARACTERISTICS) {
    if (
      key !== characteristic &&
      generation.assignments[key] === slotIndex
    ) {
      updateData[
        `system.creation.generation.assignments.${key}`
      ] = -1;
    }
  }

  updateData[
    `system.creation.generation.assignments.${characteristic}`
  ] = slotIndex;

  await actor.update(updateData);

  logger.info(
    `Generation result ${values[slotIndex]} assigned to ${characteristic}`
  );

  return actor;
}
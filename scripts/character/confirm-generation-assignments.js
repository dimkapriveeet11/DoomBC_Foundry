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

export async function confirmGenerationAssignments(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | confirmGenerationAssignments: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "characteristics") {
    throw new Error(
      `DoomBC | Нельзя подтвердить характеристики на этапе "${actor.system.creation.step}".`
    );
  }

  if (actor.system.creation.method !== "generation") {
    throw new Error(
      "DoomBC | Для персонажа не выбран метод Генерация."
    );
  }

  const generation =
    actor.system.creation.generation;

  if (generation.confirmed) {
    throw new Error(
      "DoomBC | Генерация характеристик уже подтверждена."
    );
  }

  if (!generation.generated) {
    throw new Error(
      "DoomBC | Сначала необходимо сгенерировать характеристики."
    );
  }

  if (!generation.selectedSet) {
    throw new Error(
      "DoomBC | Сначала необходимо выбрать набор A или B."
    );
  }

  const values = Array.from(
    generation.selectedValues ?? []
  );

  if (values.length !== 9) {
    throw new Error(
      "DoomBC | Для подтверждения необходимо ровно 9 результатов."
    );
  }

  const assignments = {};

  for (const key of CHARACTERISTICS) {
    assignments[key] = Number(
      generation.assignments[key]
    );
  }

  const assignedSlots =
    Object.values(assignments);

  const hasMissingAssignment =
    assignedSlots.some(
      slot =>
        !Number.isInteger(slot) ||
        slot < 0 ||
        slot > 8
    );

  if (hasMissingAssignment) {
    throw new Error(
      "DoomBC | Не все характеристики получили результат."
    );
  }

  if (new Set(assignedSlots).size !== 9) {
    throw new Error(
      "DoomBC | Один результат нельзя назначить нескольким характеристикам."
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

  const updateData = {};

  for (const key of CHARACTERISTICS) {
    const slotIndex = assignments[key];

    updateData[
      `system.characteristics.${key}.creation`
    ] = values[slotIndex];
  }

  const raceInfamy =
    Number(race.system.infamy ?? 0);

  const infamyRoll =
    await new Roll("1d5").evaluate();

  const startingInfamy =
    raceInfamy + Number(infamyRoll.total);

  const shiftCount =
    Number(race.system.characteristicShifts ?? 0);

  updateData["system.infamy.value"] =
    startingInfamy;

  updateData[
    "system.creation.generation.confirmed"
  ] = true;

  updateData[
    "system.creation.shifts.available"
  ] = shiftCount;

  updateData[
    "system.creation.shifts.used"
  ] = 0;

  updateData[
    "system.creation.shifts.pairs"
  ] = [];

  if (shiftCount > 0) {
    updateData[
      "system.creation.completed.characteristics"
    ] = false;

    updateData["system.creation.step"] =
      "shifts";
  } else {
    updateData[
      "system.creation.completed.characteristics"
    ] = true;

    updateData["system.creation.step"] =
      "subrace";
  }

  await actor.update(updateData);

  logger.info(
    `Generation confirmed for ${actor.name}`
  );

  logger.info(
    `Starting Infamy: ${raceInfamy} + ${infamyRoll.total} = ${startingInfamy}`
  );

  logger.info(
    `Characteristic Shifts available: ${shiftCount}`
  );

  return actor;
}
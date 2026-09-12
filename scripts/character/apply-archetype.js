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

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export async function applyArchetype(
  actor,
  archetype
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | applyArchetype: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "archetype") {
    throw new Error(
      `DoomBC | Нельзя выбрать архетип на этапе "${actor.system.creation.step}".`
    );
  }

  if (
    !archetype ||
    archetype.documentName !== "Item" ||
    archetype.type !== "archetype"
  ) {
    throw new Error(
      "DoomBC | Переданный Item не является архетипом."
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

  const existingArchetype = actor.items.find(
    item => item.type === "archetype"
  );

  if (existingArchetype) {
    throw new Error(
      `DoomBC | У персонажа уже выбран архетип "${existingArchetype.name}".`
    );
  }

  const allowedRaces =
    Array.from(archetype.system.allowedRaces ?? [])
      .map(normalize);

  if (
    allowedRaces.length > 0 &&
    !allowedRaces.includes(normalize(race.name))
  ) {
    throw new Error(
      `DoomBC | Архетип "${archetype.name}" недоступен для расы "${race.name}".`
    );
  }

  const updateData = {};

  for (const key of CHARACTERISTICS) {
    const bonus = Number(
      archetype.system.characteristicBonuses[key] ?? 0
    );

    if (bonus === 0) continue;

    const current =
      Number(actor.system.characteristics[key].modifier ?? 0);

    updateData[
      `system.characteristics.${key}.modifier`
    ] = current + bonus;
  }

  const woundsFormula =
    String(archetype.system.woundsFormula ?? "")
      .trim();

  if (woundsFormula) {
    const roll =
      await new Roll(woundsFormula).evaluate();

    const wounds =
      Number(roll.total ?? 0);

    updateData["system.wounds.max"] =
      wounds;

    updateData["system.wounds.value"] =
      wounds;

    logger.info(
      `Starting Wounds: ${woundsFormula} = ${wounds}`
    );
  }

  await actor.createEmbeddedDocuments(
    "Item",
    [archetype.toObject()]
  );

  updateData[
    "system.creation.completed.archetype"
  ] = true;

  updateData[
    "system.creation.step"
  ] = "aspiration";

  await actor.update(updateData);

  logger.info(
    `Archetype applied: ${archetype.name} -> ${actor.name}`
  );

  return actor;
}
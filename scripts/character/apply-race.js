import { logger } from "../core/logger.js";

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

export async function applyRace(actor, race) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | applyRace: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | applyRace: Actor "${actor.name}" не является character.`
    );
  }

  if (
    !race ||
    race.documentName !== "Item" ||
    race.type !== "race"
  ) {
    throw new Error(
      "DoomBC | applyRace: Race Item не найден."
    );
  }

  const raceData = race.system.toObject();
  const updateData = {};

  for (const key of CHARACTERISTIC_KEYS) {
    updateData[
      `system.characteristics.${key}.base`
    ] = raceData.characteristics[key] ?? 0;
  }

  updateData["system.infamy.value"] =
    raceData.infamy ?? 0;

  updateData["system.corruption"] =
    raceData.corruption ?? 0;

  // Character Builder
  updateData["system.creation.completed.race"] = true;
  updateData["system.creation.step"] =
    "characteristics";

  await actor.update(updateData);

  // У Actor может быть только одна выбранная раса.
  const oldRaceItems = actor.items.filter(
    item => item.type === "race"
  );

  if (oldRaceItems.length > 0) {
    await actor.deleteEmbeddedDocuments(
      "Item",
      oldRaceItems.map(item => item.id)
    );
  }

  // Добавляем выбранную Race Item внутрь Actor.
  const embeddedRaceData = race.toObject();

  delete embeddedRaceData._id;
  delete embeddedRaceData.folder;
  delete embeddedRaceData.sort;
  delete embeddedRaceData.ownership;

  embeddedRaceData.flags ??= {};
  embeddedRaceData.flags.doombc ??= {};
  embeddedRaceData.flags.doombc.sourceUuid =
    race.uuid;

  await actor.createEmbeddedDocuments(
    "Item",
    [embeddedRaceData]
  );

  logger.info(
    `Race applied: ${race.name} → ${actor.name}`
  );

  logger.debug(
    `Character Builder: race complete, next step = characteristics`
  );

  return actor;
}
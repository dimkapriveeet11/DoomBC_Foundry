import { logger } from "../core/logger.js";

export async function applySubrace(actor, subrace) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | applySubrace: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "subrace") {
    throw new Error(
      `DoomBC | Нельзя выбрать субрасу на этапе "${actor.system.creation.step}".`
    );
  }

  if (
    !subrace ||
    subrace.documentName !== "Item" ||
    subrace.type !== "subrace"
  ) {
    throw new Error(
      "DoomBC | Переданный Item не является субрасой."
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

  const existingSubrace = actor.items.find(
    item => item.type === "subrace"
  );

  if (existingSubrace) {
    throw new Error(
      `DoomBC | У персонажа уже выбрана субраса "${existingSubrace.name}".`
    );
  }

  const requiredRace =
    String(subrace.system.parentRace ?? "")
      .trim()
      .toLowerCase();

  const actorRace =
    String(race.name ?? "")
      .trim()
      .toLowerCase();

  if (
    requiredRace &&
    requiredRace !== actorRace
  ) {
    throw new Error(
      `DoomBC | Субраса "${subrace.name}" требует расу "${subrace.system.parentRace}".`
    );
  }

  const xpCost =
    Number(subrace.system.xpCost ?? 0);

  const totalXP =
    Number(actor.system.experience.total ?? 0);

  const spentXP =
    Number(actor.system.experience.spent ?? 0);

  const availableXP =
    totalXP - spentXP;

  if (xpCost > availableXP) {
    throw new Error(
      `DoomBC | Недостаточно опыта для "${subrace.name}". Нужно ${xpCost} XP, доступно ${availableXP} XP.`
    );
  }

  const corruptionBonus =
    Number(subrace.system.corruption ?? 0);

  const currentCorruption =
    Number(actor.system.corruption ?? 0);

  await actor.createEmbeddedDocuments(
    "Item",
    [subrace.toObject()]
  );

  await actor.update({
    "system.experience.spent":
      spentXP + xpCost,

    "system.corruption":
      currentCorruption + corruptionBonus,

    "system.creation.completed.subrace":
      true,

    "system.creation.step":
      "archetype"
  });

  logger.info(
    `Subrace applied: ${subrace.name} -> ${actor.name}`
  );

  logger.info(
    `XP spent: +${xpCost}; total spent ${spentXP + xpCost}/${totalXP}`
  );

  if (corruptionBonus !== 0) {
    logger.info(
      `Corruption changed: ${currentCorruption} -> ${currentCorruption + corruptionBonus}`
    );
  }

  return actor;
}
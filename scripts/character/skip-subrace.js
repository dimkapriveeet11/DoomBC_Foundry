import { logger } from "../core/logger.js";

export async function skipSubrace(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | skipSubrace: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "subrace") {
    throw new Error(
      `DoomBC | Нельзя пропустить субрасу на этапе "${actor.system.creation.step}".`
    );
  }

  await actor.update({
    "system.creation.completed.subrace": true,
    "system.creation.step": "archetype"
  });

  logger.info(
    `Subrace skipped for ${actor.name}. Next step: archetype`
  );

  return actor;
}
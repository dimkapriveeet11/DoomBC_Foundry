import { logger } from "../core/logger.js";

export async function setStartingExperience(actor, amount) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | setStartingExperience: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  const xp = Number(amount);

  if (!Number.isInteger(xp) || xp < 0) {
    throw new Error(
      `DoomBC | Недопустимое количество стартового XP: ${amount}`
    );
  }

  const spent = Number(
    actor.system.experience.spent ?? 0
  );

  if (xp < spent) {
    throw new Error(
      `DoomBC | Нельзя установить ${xp} XP: уже потрачено ${spent} XP.`
    );
  }

  await actor.update({
    "system.experience.total": xp
  });

  logger.info(
    `Starting XP set for ${actor.name}: ${xp}`
  );

  return actor;
}
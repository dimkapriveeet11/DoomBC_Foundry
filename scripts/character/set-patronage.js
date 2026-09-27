import { logger } from "../core/logger.js";

import {
  getPatronage,
  isValidPatronage
} from "../data/patronage-data.js";

export async function setPatronage(
  actor,
  patronageId
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | setPatronage: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "patronage") {
    throw new Error(
      `DoomBC | Нельзя выбрать Покровительство на этапе "${actor.system.creation.step}".`
    );
  }

  if (actor.system.creation.completed.patronage) {
    throw new Error(
      "DoomBC | Покровительство уже подтверждено."
    );
  }

  const id =
    String(patronageId ?? "")
      .trim()
      .toLowerCase();

  if (!isValidPatronage(id)) {
    throw new Error(
      `DoomBC | Неизвестное Покровительство: ${patronageId}`
    );
  }

  const patronage =
    getPatronage(id);

  if (id === "undivided") {
    await actor.update({
      "system.patronage":
        patronage.id,

      "system.patronageStereotype":
        "",

      "system.creation.completed.patronage":
        true,

      "system.creation.step":
        "abilities"
    });

    logger.info(
      `Patronage selected: ${patronage.name} -> ${actor.name}`
    );

    return actor;
  }

  await actor.update({
    "system.patronage":
      patronage.id,

    "system.patronageStereotype":
      "",

    "system.creation.completed.patronage":
      false,

    "system.creation.step":
      "patronage"
  });

  logger.info(
    `Patronage selected: ${patronage.name} -> ${actor.name}. Stereotype required.`
  );

  return actor;
}
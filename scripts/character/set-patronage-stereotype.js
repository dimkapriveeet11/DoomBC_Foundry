import { logger } from "../core/logger.js";

import {
  getPatronage,
  getPatronageStereotype
} from "../data/patronage-data.js";

export async function setPatronageStereotype(
  actor,
  stereotypeId
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | setPatronageStereotype: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "patronage") {
    throw new Error(
      `DoomBC | Нельзя выбрать стереотип на этапе "${actor.system.creation.step}".`
    );
  }

  if (actor.system.creation.completed.patronage) {
    throw new Error(
      "DoomBC | Покровительство уже подтверждено."
    );
  }

  const patronageId =
    String(actor.system.patronage ?? "");

  if (!patronageId) {
    throw new Error(
      "DoomBC | Сначала необходимо выбрать Покровительство."
    );
  }

  if (patronageId === "undivided") {
    throw new Error(
      "DoomBC | Неделимый персонаж не выбирает стереотип Покровительства."
    );
  }

  const patronage =
    getPatronage(patronageId);

  const stereotype =
    getPatronageStereotype(
      stereotypeId
    );

  if (!stereotype) {
    throw new Error(
      `DoomBC | Неизвестный стереотип: ${stereotypeId}`
    );
  }

  if (
    stereotype.patronage !== patronageId
  ) {
    throw new Error(
      `DoomBC | Стереотип "${stereotype.name}" не относится к Покровительству "${patronage.name}".`
    );
  }

  await actor.update({
    "system.patronageStereotype":
      stereotype.id,

    "system.creation.completed.patronage":
      true,

    "system.creation.step":
      "abilities"
  });

  logger.info(
    `Patronage stereotype selected: ${patronage.name} / ${stereotype.name} -> ${actor.name}`
  );

  return actor;
}
import {
  pointBuyCost
} from "./set-point-buy-value.js";

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

export async function confirmPointBuy(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | confirmPointBuy: Actor не найден."
    );
  }

  if (
    actor.system.creation.step !== "characteristics" ||
    actor.system.creation.method !== "pointBuy"
  ) {
    throw new Error(
      "DoomBC | Сборка сейчас недоступна."
    );
  }

  if (actor.system.creation.pointBuy.confirmed) {
    throw new Error(
      "DoomBC | Сборка уже подтверждена."
    );
  }

  const pointBuy =
    actor.system.creation.pointBuy;

  const allocations = {};
  let spent = 0;

  for (const key of CHARACTERISTICS) {
    const value =
      Number(pointBuy.allocations[key]);

    allocations[key] = value;
    spent += pointBuyCost(value);
  }

  const budget =
    Number(pointBuy.budget);

  if (spent > budget) {
    throw new Error(
      `DoomBC | Потрачено ${spent}, но доступно только ${budget}.`
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
    updateData[
      `system.characteristics.${key}.creation`
    ] = allocations[key];
  }

  const raceInfamy =
    Number(race.system.infamy ?? 0);

  const startingInfamy =
    raceInfamy + 2;

  const raceCorruption =
    Number(race.system.corruption ?? 0);

  const shiftCount =
    Number(race.system.characteristicShifts ?? 0);

  updateData["system.infamy.value"] =
    startingInfamy;

  updateData["system.corruption"] =
    raceCorruption;

  updateData[
    "system.creation.pointBuy.spent"
  ] = spent;

  updateData[
    "system.creation.pointBuy.confirmed"
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

    updateData[
      "system.creation.step"
    ] = "shifts";
  } else {
    updateData[
      "system.creation.completed.characteristics"
    ] = true;

    updateData[
      "system.creation.step"
    ] = "subrace";
  }

  await actor.update(updateData);

  logger.info(
    `Point Buy confirmed for ${actor.name}: ${spent}/${budget}`
  );

  logger.info(
    `Starting Infamy: ${raceInfamy} + 2 = ${startingInfamy}`
  );

  return actor;
}
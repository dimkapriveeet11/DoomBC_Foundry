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

export async function applyCharacteristicShift(
  actor,
  increase,
  decrease
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | applyCharacteristicShift: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "shifts") {
    throw new Error(
      `DoomBC | Смещения недоступны на этапе "${actor.system.creation.step}".`
    );
  }

  if (!CHARACTERISTICS.includes(increase)) {
    throw new Error(
      `DoomBC | Неизвестная характеристика для +5: ${increase}`
    );
  }

  if (!CHARACTERISTICS.includes(decrease)) {
    throw new Error(
      `DoomBC | Неизвестная характеристика для -5: ${decrease}`
    );
  }

  if (increase === decrease) {
    throw new Error(
      "DoomBC | Нельзя увеличить и уменьшить одну и ту же характеристику одним Смещением."
    );
  }

  const shifts = actor.system.creation.shifts;

  const available = Number(
    shifts.available ?? 0
  );

  const used = Number(
    shifts.used ?? 0
  );

  if (used >= available) {
    throw new Error(
      "DoomBC | Все доступные Смещения уже использованы."
    );
  }

  const currentIncrease =
    Number(actor.system.characteristics[increase].shift ?? 0);

  const currentDecrease =
    Number(actor.system.characteristics[decrease].shift ?? 0);

  const pairs = Array.from(
    shifts.pairs ?? []
  ).map(pair => ({
    increase: pair.increase,
    decrease: pair.decrease
  }));

  pairs.push({
    increase,
    decrease
  });

  const newUsed = used + 1;
  const finished = newUsed >= available;

  const updateData = {
    [`system.characteristics.${increase}.shift`]:
      currentIncrease + 5,

    [`system.characteristics.${decrease}.shift`]:
      currentDecrease - 5,

    "system.creation.shifts.used":
      newUsed,

    "system.creation.shifts.pairs":
      pairs
  };

  if (finished) {
    updateData[
      "system.creation.completed.characteristics"
    ] = true;

    updateData[
      "system.creation.step"
    ] = "subrace";
  }

  await actor.update(updateData);

  logger.info(
    `Characteristic Shift ${newUsed}/${available}: +5 ${increase}, -5 ${decrease}`
  );

  if (finished) {
    logger.info(
      `Characteristic Shifts completed for ${actor.name}. Next step: subrace`
    );
  }

  return actor;
}
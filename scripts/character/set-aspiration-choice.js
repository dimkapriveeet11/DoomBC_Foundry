import { logger } from "../core/logger.js";

const CATEGORIES = [
  "pride",
  "disgrace",
  "motivation"
];

export async function setAspirationChoice(
  actor,
  category,
  selections
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | setAspirationChoice: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "aspiration") {
    throw new Error(
      `DoomBC | Нельзя выбирать параметры Стремления на этапе "${actor.system.creation.step}".`
    );
  }

  if (!CATEGORIES.includes(category)) {
    throw new Error(
      `DoomBC | Неизвестная категория Стремления: ${category}`
    );
  }

  const aspiration = actor.items.find(
    item =>
      item.type === "aspiration" &&
      item.system.category === category
  );

  if (!aspiration) {
    throw new Error(
      `DoomBC | Стремление категории "${category}" не найдено.`
    );
  }

  if (aspiration.system.confirmed) {
    throw new Error(
      `DoomBC | Стремление "${aspiration.name}" уже подтверждено.`
    );
  }

  const choiceType =
    String(aspiration.system.choiceType ?? "");

  if (!choiceType) {
    throw new Error(
      `DoomBC | Стремление "${aspiration.name}" не требует дополнительного выбора.`
    );
  }

  const values = Array.isArray(selections)
    ? selections
    : [selections];

  const allowed =
    Array.from(
      aspiration.system.choiceOptions ?? []
    );

  if (choiceType === "oneCharacteristicPlus5") {
    if (values.length !== 1) {
      throw new Error(
        `DoomBC | Для "${aspiration.name}" нужно выбрать ровно одну Характеристику.`
      );
    }

    if (!allowed.includes(values[0])) {
      throw new Error(
        `DoomBC | Недопустимый выбор для "${aspiration.name}": ${values[0]}`
      );
    }
  }

  if (choiceType === "perfection") {
    if (values.length !== 3) {
      throw new Error(
        "DoomBC | Совершенство требует 3 Характеристики: первая получает +5, две следующие получают -3."
      );
    }

    if (new Set(values).size !== 3) {
      throw new Error(
        "DoomBC | Для Совершенства нужно выбрать три разные Характеристики."
      );
    }

    for (const value of values) {
      if (!allowed.includes(value)) {
        throw new Error(
          `DoomBC | Недопустимая Характеристика: ${value}`
        );
      }
    }
  }

  await aspiration.update({
    "system.choiceSelections": values
  });

  logger.info(
    `Aspiration choice set: ${aspiration.name} -> ${values.join(", ")}`
  );

  return aspiration;
}
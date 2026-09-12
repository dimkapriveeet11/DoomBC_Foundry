import { logger } from "../core/logger.js";

import {
  ASPIRATION_CATEGORY_NAMES,
  ASPIRATION_CATEGORIES,
  createAspirationItemData
} from "./aspiration-tables.js";

export async function selectAspiration(
  actor,
  category,
  roll
) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | selectAspiration: Actor не найден."
    );
  }

  if (actor.system.creation.step !== "aspiration") {
    throw new Error(
      `DoomBC | Нельзя выбирать Стремление на этапе "${actor.system.creation.step}".`
    );
  }

  if (!ASPIRATION_CATEGORIES.includes(category)) {
    throw new Error(
      `DoomBC | Неизвестная категория Стремления: ${category}`
    );
  }

  const result = Number(roll);

  if (
    !Number.isInteger(result) ||
    result < 1 ||
    result > 10
  ) {
    throw new Error(
      `DoomBC | Результат Стремления должен быть от 1 до 10. Получено: ${roll}`
    );
  }

  const existing =
    actor.items.find(
      item =>
        item.type === "aspiration" &&
        item.system.category === category
    );

  if (existing?.system.confirmed) {
    throw new Error(
      "DoomBC | Подтверждённое Стремление менять нельзя."
    );
  }

  if (existing) {
    await actor.deleteEmbeddedDocuments(
      "Item",
      [existing.id]
    );
  }

  const [created] =
    await actor.createEmbeddedDocuments(
      "Item",
      [
        createAspirationItemData(
          category,
          result,
          false
        )
      ]
    );

  logger.info(
    `${ASPIRATION_CATEGORY_NAMES[category]} selected: ${result} — ${created.name}`
  );

  return created;
}
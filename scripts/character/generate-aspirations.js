import { logger } from "../core/logger.js";

import {
  ASPIRATION_CATEGORIES,
  ASPIRATION_CATEGORY_NAMES,
  createAspirationItemData
} from "./aspiration-tables.js";

export async function generateAspirations(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | generateAspirations: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "aspiration") {
    throw new Error(
      `DoomBC | Нельзя генерировать Стремления на этапе "${actor.system.creation.step}".`
    );
  }

  const existing =
    actor.items.filter(
      item => item.type === "aspiration"
    );

  const confirmed =
    existing.find(
      item => item.system.confirmed
    );

  if (confirmed) {
    throw new Error(
      "DoomBC | Стремления уже подтверждены."
    );
  }

  if (existing.length > 0) {
    await actor.deleteEmbeddedDocuments(
      "Item",
      existing.map(item => item.id)
    );
  }

  const generatedItems = [];
  const logParts = [];

  for (const category of ASPIRATION_CATEGORIES) {
    const roll =
      await new Roll("1d10").evaluate();

    const result =
      Number(roll.total);

    const itemData =
      createAspirationItemData(
        category,
        result,
        true
      );

    generatedItems.push(itemData);

    logParts.push(
      `${ASPIRATION_CATEGORY_NAMES[category]}: ${result} — ${itemData.name}`
    );
  }

  const created =
    await actor.createEmbeddedDocuments(
      "Item",
      generatedItems
    );

  logger.info(
    `Aspirations generated for ${actor.name}`
  );

  for (const part of logParts) {
    logger.info(part);
  }

  return created;
}
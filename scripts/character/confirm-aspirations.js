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

const REQUIRED_CATEGORIES = [
  "pride",
  "disgrace",
  "motivation"
];

function getChoiceModifiers(aspiration) {
  const result = {};

  const choiceType =
    String(aspiration.system.choiceType ?? "");

  const selections =
    Array.from(
      aspiration.system.choiceSelections ?? []
    );

  if (!choiceType) {
    return result;
  }

  if (choiceType === "oneCharacteristicPlus5") {
    if (selections.length !== 1) {
      throw new Error(
        `DoomBC | "${aspiration.name}" требует дополнительного выбора.`
      );
    }

    result[selections[0]] = 5;
    return result;
  }

  if (choiceType === "perfection") {
    if (selections.length !== 3) {
      throw new Error(
        "DoomBC | Совершенство требует выбрать одну Характеристику для +5 и две для -3."
      );
    }

    result[selections[0]] = 5;
    result[selections[1]] = -3;
    result[selections[2]] = -3;

    return result;
  }

  throw new Error(
    `DoomBC | Неизвестный тип выбора Стремления: ${choiceType}`
  );
}

export async function confirmAspirations(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | confirmAspirations: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (actor.system.creation.step !== "aspiration") {
    throw new Error(
      `DoomBC | Нельзя подтверждать Стремления на этапе "${actor.system.creation.step}".`
    );
  }

  if (actor.system.creation.completed.aspiration) {
    throw new Error(
      "DoomBC | Стремления уже подтверждены."
    );
  }

  const aspirations =
    actor.items.filter(
      item => item.type === "aspiration"
    );

  if (aspirations.length !== 3) {
    throw new Error(
      `DoomBC | Нужно ровно 3 Стремления. Сейчас: ${aspirations.length}.`
    );
  }

  for (const category of REQUIRED_CATEGORIES) {
    const matches =
      aspirations.filter(
        item =>
          item.system.category === category
      );

    if (matches.length !== 1) {
      throw new Error(
        `DoomBC | Для категории "${category}" должно быть ровно одно Стремление.`
      );
    }
  }

  const characteristicChanges = Object.fromEntries(
    CHARACTERISTICS.map(
      key => [key, 0]
    )
  );

  let infamyChange = 0;
  let corruptionChange = 0;
  let woundsChange = 0;

  for (const aspiration of aspirations) {
    for (const key of CHARACTERISTICS) {
      characteristicChanges[key] +=
        Number(
          aspiration.system
            .characteristicModifiers?.[key] ?? 0
        );
    }

    const choiceModifiers =
      getChoiceModifiers(aspiration);

    for (const [
      key,
      modifier
    ] of Object.entries(choiceModifiers)) {
      characteristicChanges[key] +=
        Number(modifier);
    }

    infamyChange +=
      Number(aspiration.system.infamy ?? 0);

    corruptionChange +=
      Number(aspiration.system.corruption ?? 0);

    woundsChange +=
      Number(aspiration.system.wounds ?? 0);
  }

  const updateData = {};

  for (const key of CHARACTERISTICS) {
    const change =
      characteristicChanges[key];

    if (change === 0) continue;

    const current =
      Number(
        actor.system.characteristics[key]
          .modifier ?? 0
      );

    updateData[
      `system.characteristics.${key}.modifier`
    ] = current + change;
  }

  if (infamyChange !== 0) {
    updateData["system.infamy.value"] =
      Math.max(
        0,
        Number(actor.system.infamy.value ?? 0) +
          infamyChange
      );
  }

  if (corruptionChange !== 0) {
    updateData["system.corruption"] =
      Math.max(
        0,
        Number(actor.system.corruption ?? 0) +
          corruptionChange
      );
  }

  if (woundsChange !== 0) {
    const currentMax =
      Number(actor.system.wounds.max ?? 0);

    const currentValue =
      Number(actor.system.wounds.value ?? 0);

    updateData["system.wounds.max"] =
      Math.max(
        0,
        currentMax + woundsChange
      );

    updateData["system.wounds.value"] =
      Math.max(
        0,
        currentValue + woundsChange
      );
  }

  updateData[
    "system.creation.completed.aspiration"
  ] = true;

  updateData[
    "system.creation.step"
  ] = "patronage";

  await actor.update(updateData);

  for (const aspiration of aspirations) {
    await aspiration.update({
      "system.confirmed": true
    });
  }

  logger.info(
    `Aspirations confirmed for ${actor.name}`
  );

  logger.info(
    `Aspiration totals: Infamy ${infamyChange >= 0 ? "+" : ""}${infamyChange}, Corruption ${corruptionChange >= 0 ? "+" : ""}${corruptionChange}, Wounds ${woundsChange >= 0 ? "+" : ""}${woundsChange}`
  );

  logger.debug(
    "Aspiration characteristic modifiers:",
    characteristicChanges
  );

  return actor;
}
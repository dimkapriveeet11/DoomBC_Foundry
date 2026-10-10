// Core p. 67. Wound effects are deliberately separate from purchasing.
export function getSoundConstitutionDetails(actor) {
  const races = actor.items.filter(item => item.type === "race");
  if (races.length !== 1) {
    throw new Error("DoomBC | Для Sound Constitution нужна ровно одна раса персонажа.");
  }
  const race = races[0];
  let isSpaceMarine = race.system.isSpaceMarine;
  if (typeof isSpaceMarine !== "boolean") {
    // Compatibility for existing world Items; never classify unknown names as human.
    const name = String(race.name ?? "").trim().toLowerCase();
    if (["человек", "human"].includes(name)) isSpaceMarine = false;
    else if (["космодесантник", "space marine", "астартес", "astartes"].includes(name)) isSpaceMarine = true;
    else throw new Error("DoomBC | Укажите system.isSpaceMarine (true/false) у расы для лимита Sound Constitution.");
  }
  const characteristic = actor.system.characteristics?.toughness;
  if (!characteristic || !Number.isFinite(characteristic.base)) {
    throw new Error("DoomBC | Не определена Стойкость для Sound Constitution.");
  }
  const values = ["base", "creation", "shift", "advances", "modifier"]
    .map(key => characteristic[key] ?? 0);
  if (!values.every(value => typeof value === "number" && Number.isFinite(value))) {
    throw new Error("DoomBC | Некорректная Стойкость для Sound Constitution.");
  }
  const toughness = values.reduce((total, value) => total + value, 0);
  const limit = Math.max(0, Math.floor(toughness / 10)) + (isSpaceMarine ? 0 : 2);
  const itemCount = actor.items.filter(item =>
    item.type === "talent" && item.system.key === "soundConstitution").length;
  const purchaseCount = (actor.system.experience.purchases ?? []).filter(row =>
    row.type === "talent" && row.key === "soundConstitution").length;
  // Deleting an Item does not erase spent advances; imported Items also count.
  const purchased = Math.max(itemCount, purchaseCount);
  return {
    characterPatronage: actor.system.patronage,
    advancementPatronage: "undivided",
    relation: "special",
    relationName: "Особое",
    type: "talent",
    level: 0,
    cost: actor.system.patronage === "nurgle" ? 70 : 100,
    toughness,
    isSpaceMarine,
    limit,
    purchased,
    remaining: Math.max(0, limit - purchased)
  };
}

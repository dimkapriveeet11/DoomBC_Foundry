// Core p. 69: ordinary Tier 1 prices, at most P.b purchases.
export function getToleranceLimitDetails(actor) {
  const characteristic = actor.system.characteristics?.perception;
  if (!characteristic || !Number.isFinite(characteristic.base)) {
    throw new Error("DoomBC | Не определено Восприятие для Tolerance.");
  }
  const values = ["base", "creation", "shift", "advances", "modifier"]
    .map(key => characteristic[key] ?? 0);
  if (!values.every(value => typeof value === "number" && Number.isFinite(value))) {
    throw new Error("DoomBC | Некорректное Восприятие для Tolerance.");
  }
  const perception = values.reduce((total, value) => total + value, 0);
  const limit = Math.max(0, Math.floor(perception / 10));
  const itemCount = actor.items.filter(item =>
    item.type === "talent" && item.system.key === "tolerance").length;
  const purchaseCount = (actor.system.experience.purchases ?? []).filter(row =>
    row.type === "talent" && row.key === "tolerance").length;
  const purchased = Math.max(itemCount, purchaseCount);
  return { perception, limit, purchased, remaining: Math.max(0, limit - purchased) };
}

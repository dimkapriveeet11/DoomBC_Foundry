import { registerAirOfAuthority } from "./talents/air-of-authority.js";

const MODULE_ID = "black-crusade-automation";

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ");
}

export function hasTalent(actor, { id = null, name = null } = {}) {
  if (!actor?.items) return false;
  const wantedName = normalize(name);

  return actor.items.some(item => {
    if (item.type !== "talent") return false;

    if (id && item.id === id) return true;
    if (wantedName && normalize(item.name) === wantedName) return true;

    const source = item._stats?.compendiumSource ?? "";
    if (id && source.endsWith(`.Item.${id}`)) return true;

    return false;
  });
}

export function characteristicBonus(actor, key) {
  const characteristic = actor?.characteristics?.[key]
    ?? actor?.system?.characteristics?.[key];

  if (!characteristic) return 0;

  const prepared = Number(characteristic.displayBonus ?? characteristic.bonus);
  if (Number.isFinite(prepared)) return prepared;

  const total = Number(
    characteristic.displayTotal
    ?? characteristic.total
    ?? ((Number(characteristic.base) || 0)
      + (Number(characteristic.advance) || 0)
      + (Number(characteristic.tempModifier) || 0))
  ) || 0;
  const unnatural = Number(characteristic.unnatural) || 0;

  return Math.floor(Math.max(total, 0) / 10) + unnatural;
}

Hooks.once("init", () => {
  game.blackCrusadeAutomation = {
    moduleId: MODULE_ID,
    hasTalent,
    characteristicBonus,
    talents: {}
  };

  registerAirOfAuthority(game.blackCrusadeAutomation);

  console.log(`${MODULE_ID} | initialized`);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | ready`);
});

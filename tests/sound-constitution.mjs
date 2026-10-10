import assert from "node:assert/strict";
import { TALENTS } from "../scripts/data/talent-catalog.js";
import { purchaseTalent as buy, getTalentPurchaseDetails as details } from "../scripts/character/purchase-talent.js";

function actor(name = "Человек", patronage = "tzeentch", toughness = 50) {
  return {
    documentName: "Actor", type: "character", name: "Sound Constitution test",
    items: [{ type: "race", name, system: {} }],
    system: {
      patronage, creation: { completed: { patronage: true } },
      characteristics: { toughness: { base: 25, creation: 15, shift: 0, advances: toughness - 40, modifier: 0 } },
      wounds: { value: 17, max: 17 }, experience: { total: 950, spent: 0, purchases: [] }
    },
    async createEmbeddedDocuments(type, docs) { assert.equal(type, "Item"); this.items.push(...structuredClone(docs)); return docs; },
    async update(changes) {
      for (const [path, value] of Object.entries(changes)) {
        const parts = path.split("."); const last = parts.pop(); let target = this;
        for (const part of parts) target = target[part]; target[last] = value;
      }
    }
  };
}
const key = "soundConstitution";
const snapshot = a => JSON.stringify({ items: a.items, system: a.system });
assert.ok(Object.keys(TALENTS).length >= 76);
assert.equal(TALENTS[key].tier, 0);
assert.equal(TALENTS[key].repeatable, true);
for (const [name, limit] of [["Человек", 7], ["human", 7], ["Космодесантник", 5], ["Space Marine", 5]]) {
  for (const patronage of ["nurgle", "tzeentch", "khorne", "slaanesh", "undivided"]) {
    const a = actor(name, patronage); const cost = patronage === "nurgle" ? 70 : 100;
    assert.equal(details(a, key).limit, limit);
    assert.equal(details(a, key).cost, cost);
    for (let i = 0; i < limit; i++) {
      const result = await buy(a, key); assert.equal(result.cost, cost);
      assert.equal(result.availableAfter, 950 - cost * (i + 1));
    }
    const before = snapshot(a);
    await assert.rejects(buy(a, key), /лимит/); assert.equal(snapshot(a), before);
    assert.equal(a.items.filter(i => i.type === "talent").length, limit);
    assert.equal(a.system.experience.purchases.length, limit);
    assert.ok(a.system.experience.purchases.every(p => p.level === 0 && p.relation === "special" && p.cost === cost));
    assert.deepEqual(a.system.wounds, { value: 17, max: 17 });
    // Reload-like reconstruction and deleted Item must preserve the cap.
    a.items = structuredClone(a.items); a.system = structuredClone(a.system);
    a.items.pop(); await assert.rejects(buy(a, key), /лимит/);
    a.system.characteristics.toughness.advances += 10;
    assert.equal(details(a, key).remaining, 1); await buy(a, key);
    a.system.characteristics.toughness.modifier = -20;
    await assert.rejects(buy(a, key), /лимит/);
  }
}
for (const [t, human, marine] of [[49, 6, 4], [50, 7, 5], [59, 7, 5], [60, 8, 6]]) {
  assert.equal(details(actor("Человек", "tzeentch", t), key).limit, human);
  assert.equal(details(actor("Астартес", "tzeentch", t), key).limit, marine);
}
for (const marine of [false, true]) {
  const a = actor("Custom race"); a.items[0].system.isSpaceMarine = marine;
  assert.equal(details(a, key).limit, marine ? 5 : 7);
}
const override = actor("Человек"); override.items[0].system.isSpaceMarine = true;
assert.equal(details(override, key).limit, 5);
const legacy = actor(); legacy.items[0].system.isSpaceMarine = null;
assert.equal(details(legacy, key).limit, 7);
for (const setup of [
  a => { a.items = []; },
  a => { a.items.push(structuredClone(a.items[0])); },
  a => { a.items[0].name = "Unknown"; },
  a => { delete a.system.characteristics.toughness; },
  ...[NaN, Infinity, "50", null].map(value => a => { a.system.characteristics.toughness.base = value; })
]) {
  const a = actor(); setup(a); const before = snapshot(a);
  await assert.rejects(buy(a, key)); assert.equal(snapshot(a), before);
}
for (const patronage of ["nurgle", "tzeentch"]) {
  const a = actor("Человек", patronage); a.system.experience.total = details(a, key).cost - 1;
  const before = snapshot(a); await assert.rejects(buy(a, key), /Недостаточно опыта/);
  assert.equal(snapshot(a), before);
  a.system.experience.total++; assert.equal((await buy(a, key)).availableAfter, 0);
}
const imported = actor();
for (let i = 0; i < 7; i++) imported.items.push({ type: "talent", system: { key } });
await assert.rejects(buy(imported, key), /лимит/);
const wrongSpec = actor(); const before = snapshot(wrongSpec);
await assert.rejects(buy(wrongSpec, key, "Poison"), /не использует специализацию/);
assert.equal(snapshot(wrongSpec), before);
const concurrent = actor();
for (let i = 0; i < 6; i++) await buy(concurrent, key);
const attempts = await Promise.allSettled([buy(concurrent, key), buy(concurrent, key)]);
assert.equal(attempts.filter(r => r.status === "fulfilled").length, 1);
assert.equal(concurrent.system.experience.purchases.length, 7);
assert.equal(concurrent.system.experience.spent, 700);
await assert.rejects(buy(concurrent, key), /лимит/);
console.log("PASS: Sound Constitution prices, caps, races, thresholds, history, XP rejection, repeat purchases and unchanged wounds.");

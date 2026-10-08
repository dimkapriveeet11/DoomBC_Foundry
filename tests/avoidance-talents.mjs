import assert from 'node:assert/strict';
import { TALENTS } from '../scripts/data/talent-catalog.js';
import { SKILLS } from '../scripts/data/skill-catalog.js';
import { checkTalentPrerequisites } from '../scripts/character/talent-prerequisites.js';
import { purchaseTalent } from '../scripts/character/purchase-talent.js';

// Independent transcription of Core pp. 65–66, 71, 80.
const expected = [
  ['bodyguard',1,'nurgle','WS 40'],
  ['catfall',1,'slaanesh','A 30'],
  ['chomper',1,'khorne','WS 35, Parry +0, Disarm'],
  ['escapeArtist',1,'slaanesh','A 40'],
  ['flip',1,'slaanesh','A 45, Acrobatics +10'],
  ['flourishDance',1,'slaanesh','A 40, Trade (Dancer) +0'],
  ['highGuard',1,'khorne','Parry +10'],
  ['pirouette',1,'slaanesh','A 40, Acrobatics +0'],
  ['bladeReader',2,'khorne','WS 40, Scrutiny +0'],
  ['caution',2,'undivided','P 40, Awareness +0'],
  ['combatMaster',2,'khorne','WS 30'],
  ['counterfeint',2,'tzeentch','P 50, Awareness +20'],
  ['deflectShot',2,'slaanesh','A 50, Parry +10'],
  ['hardTarget',2,'slaanesh','A 50'],
  ['meatShield',2,'khorne','WS 30, Athletics +20'],
  ['salto',2,'slaanesh','P 40, Acrobatics +10'],
  ['slipAway',2,'slaanesh','A 40'],
  ['speedAwareness',2,'slaanesh','Acrobatics +20, Awareness +20'],
  ['adrenalineRush',3,'undivided','T 40, A 40, P 40'],
  ['bladeShield',3,'slaanesh','P 50, Parry +20, Deflect Shot'],
  ['bulwark',3,'undivided','S 50, Parry +20'],
  ['snapshot',3,'tzeentch','BS 50, P 50, Trick Shooter'],
  ['stepAside',3,'undivided','A 40, Dodge +0, Parry +0'],
  ['disarm',1,'undivided','A 30'],
  ['trickShooter',1,'tzeentch','BS 45']
];
const characteristics = { WS:'weaponSkill', BS:'ballisticSkill', A:'agility', P:'perception', S:'strength', T:'toughness' };
const talentNames = { Disarm:'disarm', 'Deflect Shot':'deflectShot', 'Trick Shooter':'trickShooter' };
function actorFor(requirements) {
  const actor = {
    documentName:'Actor', type:'character', name:'Catalog test', items:[],
    system:{ characteristics:{}, patronage:'undivided', creation:{completed:{patronage:true}}, experience:{total:10000,spent:0,purchases:[]} },
    async createEmbeddedDocuments(type, docs) { assert.equal(type,'Item'); this.items.push(...docs); return docs; },
    async update(changes) { for (const [path,value] of Object.entries(changes)) { const parts=path.split('.'); const last=parts.pop(); let node=this; for (const part of parts) node=node[part]; node[last]=value; } }
  };
  for (const label of requirements.split(', ')) {
    if (talentNames[label]) { actor.items.push({type:'talent',system:{key:talentNames[label],specialization:''}}); continue; }
    const [,name,value] = label.match(/^(.*) ([+]?\d+)$/);
    if (characteristics[name]) actor.system.characteristics[characteristics[name]]={base:Number(value)};
    else actor.items.push({type:'skill',system:{key:name==='Trade (Dancer)'?'trade':name[0].toLowerCase()+name.slice(1),advance:Number(value),specialization:name==='Trade (Dancer)'?'Dancer':''}});
  }
  return actor;
}
assert.equal(Object.keys(TALENTS).length,53);
for (const [key,tier,patronage,prerequisites] of expected) {
  const definition=TALENTS[key];
  assert.deepEqual([definition.tier,definition.patronage,definition.prerequisites],[tier,patronage,prerequisites],key);
  for (const req of definition.requirements) {
    if (req.type==='skill') assert.ok(SKILLS[req.key],req.key);
    if (req.type==='talent') assert.ok(TALENTS[req.key],req.key);
  }
  const actor=actorFor(prerequisites);
  assert.equal(checkTalentPrerequisites(actor,key).met,true,key+' at threshold');
  for (const [char,value] of Object.entries(actor.system.characteristics)) {
    value.base--;
    assert.equal(checkTalentPrerequisites(actor,key).met,false,key+' below '+char);
    await assert.rejects(purchaseTalent(actor,key));
    assert.equal(actor.system.experience.spent,0);
    value.base++;
  }
  for (let i=0;i<actor.items.length;i++) {
    const [item]=actor.items.splice(i,1);
    assert.equal(checkTalentPrerequisites(actor,key).met,false,key+' missing '+item.system.key);
    actor.items.splice(i,0,item);
    if (item.type==='skill' && item.system.advance>0) {
      item.system.advance-=10;
      assert.equal(checkTalentPrerequisites(actor,key).met,false,key+' skill below threshold');
      item.system.advance+=10;
    }
  }
  const cost={1:250,2:500,3:750}[tier];
  actor.system.experience.total=cost-1;
  await assert.rejects(purchaseTalent(actor,key),/Недостаточно опыта/);
  assert.equal(actor.system.experience.spent,0);
  actor.system.experience.total=cost;
  const result=await purchaseTalent(actor,key);
  assert.equal(result.cost,cost);
  assert.equal(result.availableAfter,0);
  assert.equal(actor.system.experience.spent,cost);
  assert.equal(actor.system.experience.purchases.length,1);
  const itemCount=actor.items.length;
  await assert.rejects(purchaseTalent(actor,key),/уже приобретён/);
  assert.equal(actor.items.length,itemCount);
  assert.equal(actor.system.experience.spent,cost);
  assert.equal(actor.system.experience.purchases.length,1);
}
const wrongTrade=actorFor('A 40, Trade (Dancer) +0');
wrongTrade.items[0].system.specialization='Cook';
assert.equal(checkTalentPrerequisites(wrongTrade,'flourishDance').met,false);
// Verify the chains through actual purchases, not pre-inserted talent Items.
for (const [first,last,requirements] of [
  ['disarm','chomper','A 30, WS 35, Parry +0'],
  ['deflectShot','bladeShield','A 50, P 50, Parry +20'],
  ['trickShooter','snapshot','BS 50, P 50']
]) {
  const actor=actorFor(requirements);
  assert.equal(checkTalentPrerequisites(actor,last).met,false);
  await purchaseTalent(actor,first);
  await purchaseTalent(actor,last);
  assert.equal(actor.system.experience.purchases.length,2);
}
console.log('PASS: 25 definitions, thresholds, missing requirements, skill levels, Dancer specialization, XP, duplicates and 3 purchase chains. Foundry integration still requires manual testing.');

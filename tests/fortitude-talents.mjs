import assert from 'node:assert/strict';
import { TALENTS } from '../scripts/data/talent-catalog.js';
import { SKILLS } from '../scripts/data/skill-catalog.js';
import { checkTalentPrerequisites } from '../scripts/character/talent-prerequisites.js';
import { purchaseTalent } from '../scripts/character/purchase-talent.js';

// Core pp. 67–68. Final Push follows the description by user decision.
const expected = [
 ['decadence',1,'slaanesh','T 30'], ['dieHard',1,'nurgle','W 40'],
 ['dropAndRoll',1,'nurgle',''], ['headGuard',1,'slaanesh','P 45, Awareness +10'],
 ['ironJaw',1,'nurgle','T 40'], ['snakeEater',1,'nurgle','T 40, Medicae +0'],
 ['resistance',1,'nurgle',''], ['thumper',1,'nurgle',''],
 ['armourMonger',2,'undivided','I 35, Tech-Use +0, Trade (Armourer) +0'],
 ['finalPush',2,'nurgle',''], ['hunkerDown',2,'nurgle',''],
 ['tireless',2,'nurgle','T 45'], ['hardy',2,'nurgle','T 40'],
 ['mentalFortitude',2,'tzeentch','W 45'], ['stonewall',2,'nurgle','S 40, T 40'],
 ['ablativeHardening',3,'undivided','Trade (Armourer) +20'],
 ['hardenedSoul',3,'tzeentch','Forbidden Lore (Warp) +10'],
 ['neverDie',3,'nurgle','W 50, T 50'], ['painIsAnIllusion',3,'tzeentch','W 50'],
 ['trueGrit',3,'nurgle','T 45']
];
const chars={T:'toughness',W:'willpower',P:'perception',I:'intelligence',S:'strength'};
const skillNames={'Awareness':['awareness',''],'Medicae':['medicae',''],'Tech-Use':['techUse',''],'Trade (Armourer)':['trade','Armourer'],'Forbidden Lore (Warp)':['forbiddenLore','Warp']};
function fixture(labels,patronage='undivided') {
 const actor={documentName:'Actor',type:'character',name:'Fortitude test',items:[],system:{patronage,creation:{completed:{patronage:true}},characteristics:{},experience:{total:10000,spent:0,purchases:[]}},
 async createEmbeddedDocuments(type,docs){assert.equal(type,'Item');this.items.push(...docs);return docs;},
 async update(changes){for(const [key,value] of Object.entries(changes))this.system.experience[key.split('.').at(-1)]=value;}};
 for(const label of labels?labels.split(', '):[]) {
  const [,name,num]=label.match(/^(.*) ([+]?\d+)$/);
  if(chars[name])actor.system.characteristics[chars[name]]={base:Number(num)};
  else {const [key,specialization]=skillNames[name];actor.items.push({type:'skill',system:{key,specialization,advance:Number(num)}});}
 }
 return actor;
}
const state=a=>JSON.stringify({items:a.items,xp:a.system.experience});
const prices={allied:[150,300,400],neutral:[250,500,750],hostile:[400,750,1000]};
const enemies={slaanesh:'khorne',khorne:'slaanesh',nurgle:'tzeentch',tzeentch:'nurgle'};
for(const [key,tier,god,labels] of expected) {
 const d=TALENTS[key];
 assert.deepEqual([d.tier,d.patronage,d.prerequisites],[tier,god,labels],key);
 for(const r of d.requirements)if(r.type==='skill')assert.ok(SKILLS[r.key],r.key);
 const spec=key==='resistance'?'Poison':'';
 const actor=fixture(labels);
 assert.equal(checkTalentPrerequisites(actor,key).met,true,key);
 for(const c of Object.values(actor.system.characteristics)) {
  c.base--; const before=state(actor);
  await assert.rejects(purchaseTalent(actor,key,spec),/Не выполнены требования/);
  assert.equal(state(actor),before); c.base++;
 }
 for(let i=0;i<actor.items.length;i++) {
  const [skill]=actor.items.splice(i,1);const before=state(actor);
  await assert.rejects(purchaseTalent(actor,key,spec),/Не выполнены требования/);
  assert.equal(state(actor),before);actor.items.splice(i,0,skill);
  if(skill.system.advance>0){skill.system.advance--;assert.equal(checkTalentPrerequisites(actor,key).met,false);skill.system.advance++;}
  if(skill.system.specialization){const old=skill.system.specialization;skill.system.specialization='Cook';assert.equal(checkTalentPrerequisites(actor,key).met,false);skill.system.specialization=old;}
 }
 for(const patronage of ['undivided','slaanesh','khorne','tzeentch','nurgle']) {
  const a=fixture(labels,patronage);
  const relation=patronage!=='undivided'&&patronage===god?'allied':enemies[patronage]===god?'hostile':'neutral';
  const cost=prices[relation][tier-1];a.system.experience.total=cost-1;
  const before=state(a);await assert.rejects(purchaseTalent(a,key,spec),/Недостаточно опыта/);assert.equal(state(a),before);
  a.system.experience.total=cost;
  const result=await purchaseTalent(a,key,spec);
  assert.equal(result.cost,cost);assert.equal(result.relation,relation);assert.equal(result.availableAfter,0);
  assert.equal(a.system.experience.purchases[0].key,spec?`${key}:${spec}`:key);
  const after=state(a);await assert.rejects(purchaseTalent(a,key,spec),/уже приобретён/);assert.equal(state(a),after);
 }
}
const senses=['Cold','Blindness','Deafness','Disease','Fear','Heat','Poison','Psychic Powers','Stun'];
assert.deepEqual(TALENTS.resistance.specializations,senses);
const actor=fixture('','tzeentch');
for(const bad of ['', 'Radiation']) {
 const before=state(actor);await assert.rejects(purchaseTalent(actor,'resistance',bad),/специализаци/);assert.equal(state(actor),before);
}
for(const spec of senses)await purchaseTalent(actor,'resistance',spec.toLowerCase());
assert.equal(actor.items.length,9);assert.equal(actor.system.experience.spent,3600);
assert.deepEqual(actor.items.map(i=>i.system.specialization),senses);
const before=state(actor);await assert.rejects(purchaseTalent(actor,'resistance',' pOiSoN '),/уже приобретён/);assert.equal(state(actor),before);
assert.ok(Object.keys(TALENTS).length >= 73);
console.log('PASS: 20 fortitude talents, 5 patronages, prerequisite boundaries, XP failures, duplicate protection, 9 Resistance specializations. Foundry validation pending.');

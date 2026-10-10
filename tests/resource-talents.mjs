import assert from 'node:assert/strict';
import {TALENTS} from '../scripts/data/talent-catalog.js';
import {checkTalentPrerequisites as check} from '../scripts/character/talent-prerequisites.js';
import {purchaseTalent as buy} from '../scripts/character/purchase-talent.js';
function actor(inf=70,cor=60,t=50,patronage='tzeentch') {
 return {documentName:'Actor',type:'character',name:'Resource tests',items:[],system:{infamy:{value:inf,points:100},corruption:cor,characteristics:{toughness:{base:t}},patronage,creation:{completed:{patronage:true}},experience:{total:10000,spent:0,purchases:[]}},
 async createEmbeddedDocuments(type,docs){assert.equal(type,'Item');this.items.push(...docs);return docs;},
 async update(changes){for(const [path,value]of Object.entries(changes))this.system.experience[path.split('.').at(-1)]=value;}};
}
const snapshot=a=>JSON.stringify({items:a.items,xp:a.system.experience});
assert.equal(Object.keys(TALENTS).length,75);
assert.deepEqual(TALENTS.eyeOfTheGods.requirements.map(r=>[r.type,r.key,r.value]),[['resource','infamy',70],['resource','corruption',60]]);
assert.deepEqual(TALENTS.hellishResilience.requirements.map(r=>[r.type,r.key,r.value]),[['characteristic','toughness',50],['resource','corruption',30]]);
for(const [key,a,label]of [
 ['eyeOfTheGods',actor(69,60),'Inf 70'],['eyeOfTheGods',actor(70,59),'Cor 60'],
 ['hellishResilience',actor(0,29,50),'Cor 30'],['hellishResilience',actor(0,30,49),'T 50']
]) {
 assert.ok(check(a,key).missing.some(r=>r.label===label));const before=snapshot(a);
 await assert.rejects(buy(a,key),/Не выполнены требования/);assert.equal(snapshot(a),before);
}
for(const value of [undefined,null,NaN,Infinity,'70',{},true]) {
 const a=actor();a.system.infamy.value=value;assert.equal(check(a,'eyeOfTheGods').met,false);
 a.system.infamy.value=70;a.system.corruption=value;assert.equal(check(a,'eyeOfTheGods').met,false);
}
const absent=actor();delete absent.system.infamy;assert.equal(check(absent,'eyeOfTheGods').met,false);
const live=actor(69,59);assert.equal(check(live,'eyeOfTheGods').met,false);
live.system.infamy.value=70;live.system.corruption=60;live.system.infamy.points=0;
assert.equal(check(live,'eyeOfTheGods').met,true);
for(const [key,cost,patronage,cor]of [
 ['eyeOfTheGods',750,'tzeentch',60],['eyeOfTheGods',750,'nurgle',60],
 ['hellishResilience',1000,'tzeentch',30],['hellishResilience',400,'nurgle',30],['hellishResilience',750,'undivided',30]
]) {
 const a=actor(70,cor,50,patronage);a.system.experience.total=cost-1;
 const before=snapshot(a);await assert.rejects(buy(a,key),/Недостаточно опыта/);assert.equal(snapshot(a),before);
 a.system.experience.total=cost;const result=await buy(a,key);assert.equal(result.cost,cost);assert.equal(result.availableAfter,0);
 assert.deepEqual(a.items[0].system.requirements,TALENTS[key].requirements);
 assert.equal(a.system.experience.purchases[0].key,key);
 const after=snapshot(a);await assert.rejects(buy(a,key),/уже приобретён/);assert.equal(snapshot(a),after);
}
// The existing anyOf dispatcher must support the new leaf type too.
const original=TALENTS.eyeOfTheGods.requirements;
try {
 TALENTS.eyeOfTheGods.requirements=[{type:'anyOf',anyOf:original}];
 assert.equal(check(actor(70,0),'eyeOfTheGods').met,true);
 assert.equal(check(actor(0,60),'eyeOfTheGods').met,true);
 assert.equal(check(actor(69,59),'eyeOfTheGods').met,false);
 TALENTS.eyeOfTheGods.requirements=[{type:'resource',key:'points',value:0}];
 assert.equal(check(actor(),'eyeOfTheGods').met,false);
} finally {TALENTS.eyeOfTheGods.requirements=original;}
console.log('PASS: Inf/Cor boundaries, missing/invalid values, points separation, live recalculation, OR, prices, XP rejection and duplicates.');

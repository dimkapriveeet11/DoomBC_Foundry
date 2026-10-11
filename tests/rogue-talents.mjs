import assert from "node:assert/strict";
import { TALENTS } from "../scripts/data/talent-catalog.js";
import { SKILLS } from "../scripts/data/skill-catalog.js";
import { checkTalentPrerequisites as check } from "../scripts/character/talent-prerequisites.js";
import { purchaseTalent as buy } from "../scripts/character/purchase-talent.js";
// Core pp. 74 and 85. Ten rogue talents and the Ambidextrous dependency.
const expected = [
 ["backstab",1,"tzeentch","Stealth +0"],
 ["closeQuarters",1,"slaanesh","A 40"],
 ["coupDeGrace",1,"undivided","Precise Blow"],
 ["streetFighting",1,"slaanesh","WS 30"],
 ["bladeJuggler",2,"slaanesh","WS 40, Deceive +0, Ambidextrous"],
 ["knifeFighter",2,"undivided","WS 40"],
 ["ridingTheMomentum",2,"slaanesh","A 45"],
 ["sabotage",2,"tzeentch","P 35, Tech-Use +0"],
 ["blindside",3,"tzeentch","A 40, Stealth +20"],
 ["razorsEdge",3,"slaanesh","WS 40, A 50"],
 ["ambidextrous",1,"undivided","A 30"]
];
const chars={WS:"weaponSkill",A:"agility",P:"perception",S:"strength",I:"intelligence",F:"fellowship"};
const skills={Stealth:"stealth",Deceive:"deceive","Tech-Use":"techUse"};
const talents={"Precise Blow":["preciseBlow",""],Ambidextrous:["ambidextrous",""]};
function reqs(labels){return (labels?labels.split(", "):[]).map(label=>{
 if(talents[label]){const [key,specialization]=talents[label];return {type:"talent",key,value:0,specialization};}
 const [,name,num]=label.match(/^(.*) ([+]?\d+)$/);
 return {type:chars[name]?"characteristic":"skill",key:chars[name]??skills[name],value:Number(num),specialization:""};
});}
function fixture(labels,patronage="undivided"){
 const a={documentName:"Actor",type:"character",name:"Rogue test",items:[],system:{patronage,creation:{completed:{patronage:true}},characteristics:{},wounds:{value:12,max:17},experience:{total:10000,spent:0,purchases:[]}},
 async createEmbeddedDocuments(type,docs){assert.equal(type,"Item");this.items.push(...structuredClone(docs));return docs;},
 async update(changes){for(const [path,value]of Object.entries(changes)){const parts=path.split(".");const last=parts.pop();let node=this;for(const part of parts)node=node[part];node[last]=value;}}};
 for(const r of reqs(labels))if(r.type==="characteristic")a.system.characteristics[r.key]={base:r.value};else a.items.push({type:r.type,system:{key:r.key,specialization:r.specialization,advance:r.value}});
 return a;
}
const state=a=>JSON.stringify({items:a.items,system:a.system});
const prices={allied:[150,300,400],neutral:[250,500,750],hostile:[400,750,1000]};
const enemies={slaanesh:"khorne",khorne:"slaanesh",nurgle:"tzeentch",tzeentch:"nurgle"};
assert.equal(Object.keys(TALENTS).length,139);
for(const [key,tier,god,labels]of expected){
 const d=TALENTS[key];assert.deepEqual([d.tier,d.patronage,d.prerequisites],[tier,god,labels],key);
 assert.deepEqual(d.requirements,reqs(labels),key);assert.equal(d.repeatable,false);
 for(const r of d.requirements){if(r.type==="skill")assert.ok(SKILLS[r.key]);if(r.type==="talent")assert.ok(TALENTS[r.key]);}
 const a=fixture(labels);assert.equal(check(a,key).met,true,key);
 for(const c of Object.values(a.system.characteristics)){c.base--;const before=state(a);await assert.rejects(buy(a,key),/Не выполнены требования/);assert.equal(state(a),before);c.base++;}
 for(let i=0;i<a.items.length;i++){
  const [item]=a.items.splice(i,1);const before=state(a);await assert.rejects(buy(a,key),/Не выполнены требования/);assert.equal(state(a),before);a.items.splice(i,0,item);
  if(item.type==="skill"){item.system.advance--;assert.equal(check(a,key).met,false);item.system.advance++;}
  if(item.system.specialization){const spec=item.system.specialization;item.system.specialization="Ranged";assert.equal(check(a,key).met,false);item.system.specialization=spec.toLowerCase();assert.equal(check(a,key).met,true);item.system.specialization=spec;}
 }
 for(const patronage of ["undivided","slaanesh","khorne","tzeentch","nurgle"]){
  const actor=fixture(labels,patronage);const spec="";
  const relation=patronage!=="undivided"&&patronage===god?"allied":enemies[patronage]===god?"hostile":"neutral";
  const cost=prices[relation][tier-1];actor.system.experience.total=cost-1;const before=state(actor);
  await assert.rejects(buy(actor,key,spec),/Недостаточно опыта/);assert.equal(state(actor),before);
  actor.system.experience.total=cost;const result=await buy(actor,key,spec);assert.equal(result.cost,cost);assert.equal(result.relation,relation);assert.equal(result.availableAfter,0);
  assert.deepEqual(actor.items.at(-1).system.requirements,reqs(labels));assert.equal(actor.system.experience.purchases[0].key,spec?`${key}:${spec}`:key);
  assert.deepEqual(actor.system.wounds,{value:12,max:17});const after=state(actor);await assert.rejects(buy(actor,key,spec),/уже приобретён/);assert.equal(state(actor),after);
 }
}
const blade=fixture("WS 40, A 30, Deceive +0");
assert.equal(check(blade,"bladeJuggler").met,false);
await buy(blade,"ambidextrous");assert.equal(check(blade,"bladeJuggler").met,true);
await buy(blade,"bladeJuggler");
const coup=fixture("WS 40");assert.equal(check(coup,"coupDeGrace").met,false);
await buy(coup,"sureStrike");assert.equal(check(coup,"coupDeGrace").met,false);
await buy(coup,"preciseBlow");assert.equal(check(coup,"coupDeGrace").met,true);
await buy(coup,"coupDeGrace");
// Stealth +0 must be acquired, even though its required advance is zero.
const stealth=fixture("A 40, Stealth +0");
assert.equal(check(stealth,"backstab").met,true);
assert.equal(check(stealth,"blindside").met,false);
stealth.items[0].system.advance=10;assert.equal(check(stealth,"blindside").met,false);
stealth.items[0].system.advance=20;assert.equal(check(stealth,"blindside").met,true);
assert.equal(TALENTS.razorsEdge.name,"Razor's Edge");
console.log("PASS: 10 rogue talents plus Ambidextrous, five patronages, thresholds, acquired skills, XP/duplicates and dependency purchase chains.");

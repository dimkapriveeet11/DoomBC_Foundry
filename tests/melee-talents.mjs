import assert from "node:assert/strict";
import { TALENTS } from "../scripts/data/talent-catalog.js";
import { SKILLS } from "../scripts/data/skill-catalog.js";
import { checkTalentPrerequisites as check } from "../scripts/character/talent-prerequisites.js";
import { purchaseTalent as buy } from "../scripts/character/purchase-talent.js";
// Core pp. 71–73 and 85. Disarm already existed; check it without duplicating it.
const expected = [
 ["disarm",1,"undivided","A 30"],
 ["doubleTeam",1,"undivided",""],
 ["everythingAWeapon",1,"khorne","WS 45, P 45"],
 ["fleshRender",1,"khorne",""],
 ["raptor",1,"undivided","Operate (Aeronautica) +0"],
 ["reaper",1,"undivided","A 50"],
 ["savior",1,"undivided","WS 40, A 40"],
 ["steadyFootwork",1,"nurgle","WS 35"],
 ["stockGrip",1,"nurgle",""],
 ["sureStrike",1,"slaanesh","WS 30"],
 ["takedown",1,"undivided",""],
 ["bayonetCharge",2,"nurgle","WS 35"],
 ["bladeBinding",2,"khorne","WS 50, S 50"],
 ["cleave",2,"khorne","WS 45, S 40"],
 ["counterAttack",2,"undivided","WS 40"],
 ["cripplingStrike",2,"slaanesh","WS 50"],
 ["falseAdvance",2,"tzeentch","WS 50, A 50"],
 ["gatekeeper",2,"undivided","WS 40, P 35, A 35"],
 ["grind",2,"khorne","Athletics +10"],
 ["preciseBlow",2,"slaanesh","WS 40, Sure Strike"],
 ["riposte",2,"slaanesh","Counter Attack, Two Weapon Wielder (Melee)"],
 ["strangeTechnique",2,"undivided","A 40, I 35"],
 ["swiftAttack",2,"khorne","WS 30"],
 ["tenacity",2,"nurgle","P 40"],
 ["whirlwindOfDeath",2,"khorne","WS 40"],
 ["assassinStrike",3,"slaanesh","A 40, Acrobatics +0"],
 ["blademaster",3,"khorne","WS 40"],
 ["crushingBlow",3,"khorne","WS 40"],
 ["hamstring",3,"slaanesh","WS 50, A 50"],
 ["lightningAttack",3,"khorne","Swift Attack"],
 ["reverseStrike",3,"slaanesh","WS 45"],
 ["showOff",3,"slaanesh","WS 50, F 40"],
 ["twoWeaponWielder",2,"undivided",""]
];
const chars={WS:"weaponSkill",A:"agility",P:"perception",S:"strength",I:"intelligence",F:"fellowship"};
const skills={"Operate (Aeronautica)":"operateAeronautica",Athletics:"athletics",Acrobatics:"acrobatics"};
const talents={"Sure Strike":["sureStrike",""],"Counter Attack":["counterAttack",""],"Two Weapon Wielder (Melee)":["twoWeaponWielder","Melee"],"Swift Attack":["swiftAttack",""]};
function reqs(labels){return (labels?labels.split(", "):[]).map(label=>{
 if(talents[label]){const [key,specialization]=talents[label];return {type:"talent",key,value:0,specialization};}
 const [,name,num]=label.match(/^(.*) ([+]?\d+)$/);
 return {type:chars[name]?"characteristic":"skill",key:chars[name]??skills[name],value:Number(num),specialization:""};
});}
function fixture(labels,patronage="undivided"){
 const a={documentName:"Actor",type:"character",name:"Melee test",items:[],system:{patronage,creation:{completed:{patronage:true}},characteristics:{},wounds:{value:12,max:17},experience:{total:10000,spent:0,purchases:[]}},
 async createEmbeddedDocuments(type,docs){assert.equal(type,"Item");this.items.push(...structuredClone(docs));return docs;},
 async update(changes){for(const [path,value]of Object.entries(changes)){const parts=path.split(".");const last=parts.pop();let node=this;for(const part of parts)node=node[part];node[last]=value;}}};
 for(const r of reqs(labels))if(r.type==="characteristic")a.system.characteristics[r.key]={base:r.value};else a.items.push({type:r.type,system:{key:r.key,specialization:r.specialization,advance:r.value}});
 return a;
}
const state=a=>JSON.stringify({items:a.items,system:a.system});
const prices={allied:[150,300,400],neutral:[250,500,750],hostile:[400,750,1000]};
const enemies={slaanesh:"khorne",khorne:"slaanesh",nurgle:"tzeentch",tzeentch:"nurgle"};
assert.equal(Object.keys(TALENTS).length,128);
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
  const actor=fixture(labels,patronage);const spec=key==="twoWeaponWielder"?"Melee":"";
  const relation=patronage!=="undivided"&&patronage===god?"allied":enemies[patronage]===god?"hostile":"neutral";
  const cost=prices[relation][tier-1];actor.system.experience.total=cost-1;const before=state(actor);
  await assert.rejects(buy(actor,key,spec),/Недостаточно опыта/);assert.equal(state(actor),before);
  actor.system.experience.total=cost;const result=await buy(actor,key,spec);assert.equal(result.cost,cost);assert.equal(result.relation,relation);assert.equal(result.availableAfter,0);
  assert.deepEqual(actor.items.at(-1).system.requirements,reqs(labels));assert.equal(actor.system.experience.purchases[0].key,spec?`${key}:${spec}`:key);
  assert.deepEqual(actor.system.wounds,{value:12,max:17});const after=state(actor);await assert.rejects(buy(actor,key,spec),/уже приобретён/);assert.equal(state(actor),after);
 }
}
for(const [first,last]of [["sureStrike","preciseBlow"],["swiftAttack","lightningAttack"]]){
 const a=fixture("WS 40");assert.equal(check(a,last).met,false);await buy(a,first);assert.equal(check(a,last).met,true);await buy(a,last);
}
const a=fixture("WS 40");
for(const spec of ["","Both","Other"]){const before=state(a);await assert.rejects(buy(a,"twoWeaponWielder",spec));assert.equal(state(a),before);}
await buy(a,"counterAttack");await buy(a,"twoWeaponWielder","Ranged");
const before=state(a);await assert.rejects(buy(a,"riposte"),/Не выполнены требования/);assert.equal(state(a),before);
await buy(a,"twoWeaponWielder"," melee ");assert.equal(check(a,"riposte").met,true);await buy(a,"riposte");
assert.deepEqual(a.system.experience.purchases.filter(p=>p.key.startsWith("twoWeaponWielder")).map(p=>p.key),["twoWeaponWielder:Ranged","twoWeaponWielder:Melee"]);
for(const spec of ["Melee"," ranged "]){const before=state(a);await assert.rejects(buy(a,"twoWeaponWielder",spec),/уже приобретён/);assert.equal(state(a),before);}
const wrongPilot=fixture("Operate (Aeronautica) +0");wrongPilot.items[0].system.key="operateSurface";assert.equal(check(wrongPilot,"raptor").met,false);
console.log("PASS: 32 melee talents plus TWW, thresholds, five patronages, XP/duplicates, skill identity, chains and Melee/Ranged specialization isolation.");

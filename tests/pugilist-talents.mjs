import assert from "node:assert/strict";
import { TALENTS } from "../scripts/data/talent-catalog.js";
import { SKILLS } from "../scripts/data/skill-catalog.js";
import { checkTalentPrerequisites as check } from "../scripts/character/talent-prerequisites.js";
import { purchaseTalent as buy } from "../scripts/character/purchase-talent.js";
// Independent expectations from Core pp. 75–76.
const expected = [
 ["headcracker",1,"undivided","WS 35"],
 ["rollingWithPunches",1,"slaanesh","A 40, Unarmed Warrior"],
 ["roundhouseKick",1,"undivided","S 40, Athletics +0"],
 ["unarmedWarrior",1,"khorne","WS 35, A 35"],
 ["whack",1,"khorne","WS 30"],
 ["chokehold",2,"khorne","S 40, WS 40"],
 ["goadingStrike",2,"tzeentch","WS 45"],
 ["haymaker",2,"khorne","S 40, T 40"],
 ["pounce",2,"khorne","Athletics +10"],
 ["slam",2,"khorne","S 50, Athletics +20"],
 ["thunderCharge",2,"khorne","S 50"],
 ["unarmedMaster",2,"khorne","WS 45, A 40, Unarmed Warrior"],
 ["wrestler",2,"khorne","S 40, Athletics +20"],
 ["flyingKick",3,"undivided","WS 30, Operate (Aeronautica) +20"],
 ["jockey",3,"slaanesh","A 50, Acrobatics +10"],
 ["kneeStrike",3,"khorne","S 35, Athletics +10"],
 ["pinDown",3,"khorne","Athletics +20"]
];
const chars={WS:"weaponSkill",A:"agility",P:"perception",S:"strength",I:"intelligence",F:"fellowship",T:"toughness"};
const skills={Athletics:"athletics",Acrobatics:"acrobatics","Operate (Aeronautica)":"operateAeronautica"};
const talents={"Unarmed Warrior":["unarmedWarrior",""]};
function reqs(labels){return (labels?labels.split(", "):[]).map(label=>{
 if(talents[label]){const [key,specialization]=talents[label];return {type:"talent",key,value:0,specialization};}
 const [,name,num]=label.match(/^(.*) ([+]?\d+)$/);
 return {type:chars[name]?"characteristic":"skill",key:chars[name]??skills[name],value:Number(num),specialization:""};
});}
function fixture(labels,patronage="undivided"){
 const a={documentName:"Actor",type:"character",name:"Pugilist test",items:[],system:{patronage,creation:{completed:{patronage:true}},characteristics:{},wounds:{value:12,max:17},experience:{total:10000,spent:0,purchases:[]}},
 async createEmbeddedDocuments(type,docs){assert.equal(type,"Item");this.items.push(...structuredClone(docs));return docs;},
 async update(changes){for(const [path,value]of Object.entries(changes)){const parts=path.split(".");const last=parts.pop();let node=this;for(const part of parts)node=node[part];node[last]=value;}}};
 for(const r of reqs(labels))if(r.type==="characteristic")a.system.characteristics[r.key]={base:r.value};else a.items.push({type:r.type,system:{key:r.key,specialization:r.specialization,advance:r.value}});
 return a;
}
const state=a=>JSON.stringify({items:a.items,system:a.system});
const prices={allied:[150,300,400],neutral:[250,500,750],hostile:[400,750,1000]};
const enemies={slaanesh:"khorne",khorne:"slaanesh",nurgle:"tzeentch",tzeentch:"nurgle"};
assert.equal(Object.keys(TALENTS).length,156);
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
const chain=fixture("WS 45, A 40");
for(const key of ["rollingWithPunches","unarmedMaster"]){
 const before=state(chain);await assert.rejects(buy(chain,key),/Не выполнены требования/);assert.equal(state(chain),before);
}
await buy(chain,"unarmedWarrior");
for(const key of ["rollingWithPunches","unarmedMaster"]){assert.equal(check(chain,key).met,true);await buy(chain,key);}
for(const level of [0,10,19,20]){
 const a=fixture("WS 30, Operate (Aeronautica) +20");a.items[0].system.advance=level;
 assert.equal(check(a,"flyingKick").met,level===20);
 if(level<20){const before=state(a);await assert.rejects(buy(a,"flyingKick"));assert.equal(state(a),before);}
}
const wrong=fixture("WS 30, Operate (Aeronautica) +20");wrong.items[0].system.key="operateSurface";
assert.equal(check(wrong,"flyingKick").met,false);
console.log("PASS: 17 pugilist talents, five patronages, characteristic/skill boundaries, acquired skills, XP/duplicates, Warrior chains and Aeronautica +20.");

import assert from "node:assert/strict";
import { TALENTS } from "../scripts/data/talent-catalog.js";
import { SKILLS } from "../scripts/data/skill-catalog.js";
import { checkTalentPrerequisites as check } from "../scripts/character/talent-prerequisites.js";
import { purchaseTalent as buy, getTalentPurchaseDetails as details } from "../scripts/character/purchase-talent.js";

// Independent expected data from Core pp. 69–70; Placebo uses the description by user choice.
const expected = [
  ["butAScratch",1,"nurgle","Medicae +10"],
  ["butcher",1,"nurgle","Medicae +0, WS 35"],
  ["deepDetox",1,"slaanesh","Trade (Chymist) +0"],
  ["fieldSurgeon",1,"nurgle","Medicae +10"],
  ["tolerance",1,"slaanesh","P 40, Trade (Chymist) +0"],
  ["antivenom",2,"nurgle","Scholastic Lore (Chymistry) +10"],
  ["cook",2,"slaanesh","Medicae +20, Trade (Chymist) +0"],
  ["fastStitches",2,"nurgle","A 40, Medicae +20"],
  ["frontlineMedic",2,"nurgle","Athletics +10, Medicae +10"],
  ["hookUp",2,"slaanesh","I 45, Trade (Chymist) +20"],
  ["poisoner",2,"nurgle","Medicae +10, Trade (Chymist) +20"],
  ["placebo",2,"tzeentch","Deceive +10, Medicae +20"],
  ["radicalTreatment",2,"undivided","I 40, Medicae +10"],
  ["restitching",2,"nurgle","Awareness +10, Medicae +20"],
  ["torturer",2,"slaanesh","Medicae +20"],
  ["triage",2,"nurgle","I 35, Medicae +10"],
  ["councilium",3,"undivided","Logic +20, Medicae +20"],
  ["masterChirurgeon",3,"nurgle","I 40, Medicae +20"],
  ["reanimate",3,"nurgle","Cor 30, Medicae +30"],
  ["surgicalPrecision",3,"tzeentch","P 45, Medicae +10"]
];
const chars = { WS:"weaponSkill", P:"perception", A:"agility", I:"intelligence" };
const skills = {
  Medicae:["medicae",""], "Trade (Chymist)":["trade","Chymist"],
  "Scholastic Lore (Chymistry)":["scholasticLore","Chymistry"],
  Athletics:["athletics",""], Deceive:["deceive",""], Awareness:["awareness",""], Logic:["logic",""]
};
function requirements(labels) {
  return labels.split(", ").map(label => {
    const [, name, number] = label.match(/^(.*) ([+]?\d+)$/);
    if (chars[name]) return {type:"characteristic",key:chars[name],value:Number(number),specialization:""};
    if (name === "Cor") return {type:"resource",key:"corruption",value:Number(number),specialization:""};
    const [key,specialization] = skills[name];
    return {type:"skill",key,value:Number(number),specialization};
  });
}
function fixture(labels, patronage="undivided") {
  const a = {
    documentName:"Actor",type:"character",name:"Medic test",items:[],
    system:{patronage,creation:{completed:{patronage:true}},characteristics:{},corruption:0,
      wounds:{value:12,max:17},experience:{total:10000,spent:0,purchases:[]}},
    async createEmbeddedDocuments(type,docs){assert.equal(type,"Item");this.items.push(...structuredClone(docs));return docs;},
    async update(changes){for(const [path,value] of Object.entries(changes)){
      const parts=path.split(".");const last=parts.pop();let target=this;
      for(const part of parts)target=target[part];target[last]=value;
    }}
  };
  for(const r of requirements(labels)){
    if(r.type==="characteristic")a.system.characteristics[r.key]={base:r.value};
    else if(r.type==="resource")a.system[r.key]=r.value;
    else a.items.push({type:"skill",system:{key:r.key,specialization:r.specialization,advance:r.value}});
  }
  return a;
}
const state = a => JSON.stringify({items:a.items,system:a.system});
const prices={allied:[150,300,400],neutral:[250,500,750],hostile:[400,750,1000]};
const enemies={slaanesh:"khorne",khorne:"slaanesh",nurgle:"tzeentch",tzeentch:"nurgle"};
assert.ok(Object.keys(TALENTS).length >= 96);
for(const [key,tier,god,labels] of expected){
  const d=TALENTS[key];
  assert.deepEqual([d.tier,d.patronage,d.prerequisites],[tier,god,labels],key);
  assert.deepEqual(d.requirements,requirements(labels),key);
  assert.equal(d.repeatable,key==="tolerance");
  for(const r of d.requirements)if(r.type==="skill")assert.ok(SKILLS[r.key],r.key);
  const a=fixture(labels);
  assert.equal(check(a,key).met,true,key);
  for(const c of Object.values(a.system.characteristics)){
    c.base--;const before=state(a);await assert.rejects(buy(a,key),/Не выполнены требования/);
    assert.equal(state(a),before);c.base++;
  }
  for(let i=0;i<a.items.length;i++){
    const [skill]=a.items.splice(i,1);const before=state(a);
    await assert.rejects(buy(a,key),/Не выполнены требования/);assert.equal(state(a),before);
    a.items.splice(i,0,skill);
    skill.system.advance--;assert.equal(check(a,key).met,false);skill.system.advance++;
    if(skill.system.specialization){
      const spec=skill.system.specialization;skill.system.specialization="Cook";
      const wrong=state(a);await assert.rejects(buy(a,key),/Не выполнены требования/);
      assert.equal(state(a),wrong);skill.system.specialization=spec.toLowerCase();
      assert.equal(check(a,key).met,true);skill.system.specialization=spec;
    }
  }
  for(const patronage of ["undivided","slaanesh","khorne","tzeentch","nurgle"]){
    const a=fixture(labels,patronage);
    const relation=patronage!=="undivided"&&patronage===god?"allied":enemies[patronage]===god?"hostile":"neutral";
    const cost=prices[relation][tier-1];
    assert.equal(details(a,key).cost,cost);
    a.system.experience.total=cost-1;const before=state(a);
    await assert.rejects(buy(a,key),/Недостаточно опыта/);assert.equal(state(a),before);
    a.system.experience.total=cost;const result=await buy(a,key);
    assert.equal(result.cost,cost);assert.equal(result.relation,relation);assert.equal(result.availableAfter,0);
    assert.deepEqual(a.items.at(-1).system.requirements,requirements(labels));
    assert.deepEqual(a.system.wounds,{value:12,max:17});
    assert.equal(a.system.experience.purchases[0].level,tier);
    if(key!=="tolerance"){
      const after=state(a);await assert.rejects(buy(a,key),/уже приобретён/);assert.equal(state(a),after);
    }
  }
}
// Description, not the contradictory table: +10 Deceive / +20 Medicae.
assert.equal(check(fixture("Deceive +10, Medicae +20"),"placebo").met,true);
assert.equal(check(fixture("Deceive +20, Medicae +10"),"placebo").met,false);
for(const cor of [29,30]){
  const a=fixture("Cor 30, Medicae +30");a.system.corruption=cor;
  assert.equal(check(a,"reanimate").met,cor===30);
  if(cor===29){const before=state(a);await assert.rejects(buy(a,"reanimate"));assert.equal(state(a),before);}
}
const tolerance=fixture("P 40, Trade (Chymist) +0");
for(let i=0;i<4;i++)await buy(tolerance,"tolerance");
const before=state(tolerance);await assert.rejects(buy(tolerance,"tolerance"),/лимит/);assert.equal(state(tolerance),before);
tolerance.items=structuredClone(tolerance.items);tolerance.system=structuredClone(tolerance.system);
assert.equal(details(tolerance,"tolerance").remaining,0);
tolerance.items.pop();await assert.rejects(buy(tolerance,"tolerance"),/лимит/);
tolerance.system.characteristics.perception.advances=9;assert.equal(details(tolerance,"tolerance").limit,4);
tolerance.system.characteristics.perception.advances=10;
assert.equal(details(tolerance,"tolerance").remaining,1);
const concurrent=await Promise.allSettled([buy(tolerance,"tolerance"),buy(tolerance,"tolerance")]);
assert.equal(concurrent.filter(r=>r.status==="fulfilled").length,1);
assert.equal(tolerance.system.experience.purchases.length,5);
tolerance.system.characteristics.perception.modifier=-10;
await assert.rejects(buy(tolerance,"tolerance"),/лимит/);
const imported=fixture("P 40, Trade (Chymist) +0");
for(let i=0;i<4;i++)imported.items.push({type:"talent",system:{key:"tolerance"}});
await assert.rejects(buy(imported,"tolerance"),/лимит/);
for(const value of [NaN,Infinity,"40",null]){
  const a=fixture("P 40, Trade (Chymist) +0");a.system.characteristics.perception.base=value;
  assert.throws(()=>details(a,"tolerance"));const before=state(a);await assert.rejects(buy(a,"tolerance"));assert.equal(state(a),before);
}
console.log("PASS: 20 medic talents, all patronage prices, boundaries, specializations, Placebo choice, Reanimate Cor, Tolerance cap/history/concurrency, XP and duplicates.");

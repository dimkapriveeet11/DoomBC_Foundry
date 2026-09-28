import {
  getPatronageRelation,
  getCharacteristicRelation,
  PATRONAGE_RELATION_NAMES
} from "../data/patronage-data.js";

const CHARACTERISTIC_COSTS = {
  allied: {
    5: 100,
    10: 250,
    15: 500,
    20: 750,
    25: 1000
  },

  neutral: {
    5: 250,
    10: 500,
    15: 750,
    20: 1000,
    25: 1500
  },

  hostile: {
    5: 500,
    10: 750,
    15: 1000,
    20: 1500,
    25: 2500
  }
};

const SKILL_COSTS = {
  allied: {
    0: 100,
    10: 200,
    20: 350,
    30: 550
  },

  neutral: {
    0: 200,
    10: 350,
    20: 500,
    30: 750
  },

  hostile: {
    0: 300,
    10: 500,
    20: 700,
    30: 900
  }
};

const TALENT_COSTS = {
  allied: {
    1: 150,
    2: 300,
    3: 400
  },

  neutral: {
    1: 250,
    2: 500,
    3: 750
  },

  hostile: {
    1: 400,
    2: 750,
    3: 1000
  }
};

function validateActor(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }

  if (!actor.system.patronage) {
    throw new Error(
      `DoomBC | У персонажа "${actor.name}" не выбрано Покровительство.`
    );
  }
}

function getCost(
  table,
  relation,
  level
) {
  const numericLevel =
    Number(level);

  if (
    !Object.prototype.hasOwnProperty.call(
      table[relation],
      numericLevel
    )
  ) {
    throw new Error(
      `DoomBC | Недопустимый уровень продвижения: ${level}`
    );
  }

  return Number(
    table[relation][numericLevel]
  );
}

export function getAdvancementRelation(
  actor,
  advancementPatronage
) {
  validateActor(actor);

  const affinity =
    String(
      advancementPatronage ?? ""
    ).trim();

  /*
   * Common Lore и Trade в DoomBC
   * всегда считаются дружественными.
   */
  if (affinity === "alwaysAllied") {
    return "allied";
  }

  return getPatronageRelation(
    actor.system.patronage,
    affinity
  );
}

export function getAdvancementCost(
  actor,
  type,
  level,
  advancementPatronage
) {
  validateActor(actor);

  const normalizedType =
    String(type ?? "")
      .trim()
      .toLowerCase();

  if (
    normalizedType === "characteristic"
  ) {
    throw new Error(
      "DoomBC | Для Характеристик используй getCharacteristicAdvancementCost()."
    );
  }

  const relation =
    getAdvancementRelation(
      actor,
      advancementPatronage
    );

  if (normalizedType === "skill") {
    return getCost(
      SKILL_COSTS,
      relation,
      level
    );
  }

  if (normalizedType === "talent") {
    return getCost(
      TALENT_COSTS,
      relation,
      level
    );
  }

  throw new Error(
    `DoomBC | Неизвестный тип продвижения: ${type}`
  );
}

export function getAdvancementCostDetails(
  actor,
  type,
  level,
  advancementPatronage
) {
  const relation =
    getAdvancementRelation(
      actor,
      advancementPatronage
    );

  const cost =
    getAdvancementCost(
      actor,
      type,
      level,
      advancementPatronage
    );

  return {
    characterPatronage:
      actor.system.patronage,

    advancementPatronage,

    relation,

    relationName:
      PATRONAGE_RELATION_NAMES[
        relation
      ],

    type,

    level: Number(level),

    cost
  };
}

export function getCharacteristicAdvancementCost(
  actor,
  characteristic,
  level
) {
  validateActor(actor);

  const relation =
    getCharacteristicRelation(
      actor,
      characteristic
    );

  return getCost(
    CHARACTERISTIC_COSTS,
    relation,
    level
  );
}

export function getCharacteristicAdvancementCostDetails(
  actor,
  characteristic,
  level
) {
  validateActor(actor);

  const relation =
    getCharacteristicRelation(
      actor,
      characteristic
    );

  const cost =
    getCharacteristicAdvancementCost(
      actor,
      characteristic,
      level
    );

  return {
    patronage:
      actor.system.patronage,

    stereotype:
      actor.system.patronageStereotype,

    characteristic,

    relation,

    relationName:
      PATRONAGE_RELATION_NAMES[
        relation
      ],

    level: Number(level),

    cost
  };
}
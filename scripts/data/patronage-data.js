export const PATRONAGES = {
  slaanesh: {
    id: "slaanesh",
    name: "Слаанеш"
  },

  nurgle: {
    id: "nurgle",
    name: "Нургл"
  },

  khorne: {
    id: "khorne",
    name: "Кхорн"
  },

  tzeentch: {
    id: "tzeentch",
    name: "Тзинч"
  },

  undivided: {
    id: "undivided",
    name: "Неделимый"
  }
};

export const PATRONAGE_IDS =
  Object.keys(PATRONAGES);

export const PATRONAGE_RELATIONS = {
  slaanesh: {
    slaanesh: "allied",
    nurgle: "neutral",
    khorne: "hostile",
    tzeentch: "neutral",
    undivided: "neutral"
  },

  nurgle: {
    slaanesh: "neutral",
    nurgle: "allied",
    khorne: "neutral",
    tzeentch: "hostile",
    undivided: "neutral"
  },

  khorne: {
    slaanesh: "hostile",
    nurgle: "neutral",
    khorne: "allied",
    tzeentch: "neutral",
    undivided: "neutral"
  },

  tzeentch: {
    slaanesh: "neutral",
    nurgle: "hostile",
    khorne: "neutral",
    tzeentch: "allied",
    undivided: "neutral"
  },

  undivided: {
    slaanesh: "neutral",
    nurgle: "neutral",
    khorne: "neutral",
    tzeentch: "neutral",
    undivided: "neutral"
  }
};

export const PATRONAGE_RELATION_NAMES = {
  allied: "Союзное",
  neutral: "Нейтральное",
  hostile: "Враждебное"
};

export const PATRONAGE_STEREOTYPES = {
  bladeDancer: {
    id: "bladeDancer",
    patronage: "slaanesh",
    name: "Танцор Клинка",
    alliedCharacteristic: "agility",
    hostileCharacteristics: [
      "intelligence",
      "toughness"
    ]
  },

  intriguer: {
    id: "intriguer",
    patronage: "slaanesh",
    name: "Интриган",
    alliedCharacteristic: "fellowship",
    hostileCharacteristics: [
      "strength",
      "toughness"
    ]
  },

  hedonist: {
    id: "hedonist",
    patronage: "slaanesh",
    name: "Гедонист",
    alliedCharacteristic: "perception",
    hostileCharacteristics: [
      "strength",
      "willpower"
    ]
  },

  meister: {
    id: "meister",
    patronage: "nurgle",
    name: "Мейстер",
    alliedCharacteristic: "intelligence",
    hostileCharacteristics: [
      "perception",
      "fellowship"
    ]
  },

  immortal: {
    id: "immortal",
    patronage: "nurgle",
    name: "Бессмертный",
    alliedCharacteristic: "toughness",
    hostileCharacteristics: [
      "agility",
      "fellowship"
    ]
  },

  cultist: {
    id: "cultist",
    patronage: "nurgle",
    name: "Культист",
    alliedCharacteristic: "fellowship",
    hostileCharacteristics: [
      "agility",
      "strength"
    ]
  },

  vanguard: {
    id: "vanguard",
    patronage: "khorne",
    name: "Авангард",
    alliedCharacteristic: "weaponSkill",
    hostileCharacteristics: [
      "intelligence",
      "willpower"
    ]
  },

  berserker: {
    id: "berserker",
    patronage: "khorne",
    name: "Берсерк",
    alliedCharacteristic: "strength",
    hostileCharacteristics: [
      "fellowship",
      "willpower"
    ]
  },

  smith: {
    id: "smith",
    patronage: "khorne",
    name: "Кузнец",
    alliedCharacteristic: "intelligence",
    hostileCharacteristics: [
      "fellowship",
      "agility"
    ]
  },

  sniper: {
    id: "sniper",
    patronage: "tzeentch",
    name: "Снайпер",
    alliedCharacteristic: "ballisticSkill",
    hostileCharacteristics: [
      "fellowship",
      "toughness"
    ]
  },

  warlock: {
    id: "warlock",
    patronage: "tzeentch",
    name: "Чернокнижник",
    alliedCharacteristic: "willpower",
    hostileCharacteristics: [
      "strength",
      "toughness"
    ]
  },

  sage: {
    id: "sage",
    patronage: "tzeentch",
    name: "Мудрец",
    alliedCharacteristic: "intelligence",
    hostileCharacteristics: [
      "strength",
      "agility"
    ]
  }
};

export function isValidPatronage(
  patronage
) {
  return PATRONAGE_IDS.includes(
    String(patronage ?? "")
      .trim()
      .toLowerCase()
  );
}

export function getPatronage(
  patronage
) {
  const id =
    String(patronage ?? "")
      .trim()
      .toLowerCase();

  return PATRONAGES[id] ?? null;
}

export function getPatronageRelation(
  characterPatronage,
  advancementPatronage
) {
  const character =
    String(characterPatronage ?? "")
      .trim()
      .toLowerCase();

  const advancement =
    String(advancementPatronage ?? "")
      .trim()
      .toLowerCase();

  if (!isValidPatronage(character)) {
    throw new Error(
      `DoomBC | Неизвестное Покровительство персонажа: ${characterPatronage}`
    );
  }

  if (!isValidPatronage(advancement)) {
    throw new Error(
      `DoomBC | Неизвестное Покровительство продвижения: ${advancementPatronage}`
    );
  }

  return (
    PATRONAGE_RELATIONS[character]?.[
      advancement
    ] ?? "neutral"
  );
}

export function getPatronageStereotype(
  stereotypeId
) {
  return (
    PATRONAGE_STEREOTYPES[
      String(stereotypeId ?? "").trim()
    ] ?? null
  );
}

export function getPatronageStereotypes(
  patronageId
) {
  const patronage =
    String(patronageId ?? "")
      .trim()
      .toLowerCase();

  return Object.values(
    PATRONAGE_STEREOTYPES
  ).filter(
    stereotype =>
      stereotype.patronage === patronage
  );
}

export function getCharacteristicRelation(
  actor,
  characteristic
) {
  const key =
    String(characteristic ?? "").trim();

  if (!actor?.system) {
    throw new Error(
      "DoomBC | Actor не найден."
    );
  }

  const patronage =
    String(actor.system.patronage ?? "");

  if (!isValidPatronage(patronage)) {
    throw new Error(
      "DoomBC | У персонажа не выбрано Покровительство."
    );
  }

  if (patronage === "undivided") {
    return "neutral";
  }

  const stereotype =
    getPatronageStereotype(
      actor.system.patronageStereotype
    );

  if (!stereotype) {
    throw new Error(
      "DoomBC | Не выбран стереотип Покровительства."
    );
  }

  if (
    stereotype.patronage !== patronage
  ) {
    throw new Error(
      "DoomBC | Стереотип не соответствует Покровительству персонажа."
    );
  }

  if (
    stereotype.alliedCharacteristic === key
  ) {
    return "allied";
  }

  if (
    stereotype.hostileCharacteristics.includes(
      key
    )
  ) {
    return "hostile";
  }

  return "neutral";
}
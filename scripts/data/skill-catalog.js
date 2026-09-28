export const SKILLS = {
  acrobatics: {
    key: "acrobatics",
    name: "Acrobatics",
    characteristic: "agility",
    patronage: "slaanesh",
    group: false,
    canUseUntrained: true
  },

  athletics: {
    key: "athletics",
    name: "Athletics",
    characteristic: "strength",
    patronage: "khorne",
    group: false,
    canUseUntrained: true
  },

  awareness: {
    key: "awareness",
    name: "Awareness",
    characteristic: "perception",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  charm: {
    key: "charm",
    name: "Charm",
    characteristic: "fellowship",
    patronage: "slaanesh",
    group: false,
    canUseUntrained: true
  },

  command: {
    key: "command",
    name: "Command",
    characteristic: "fellowship",
    patronage: "khorne",
    group: false,
    canUseUntrained: true
  },

  commerce: {
    key: "commerce",
    name: "Commerce",
    characteristic: "intelligence",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  commonLore: {
    key: "commonLore",
    name: "Common Lore",
    characteristic: "intelligence",
    patronage: "alwaysAllied",
    group: true,
    canUseUntrained: true
  },

  deceive: {
    key: "deceive",
    name: "Deceive",
    characteristic: "fellowship",
    patronage: "slaanesh",
    group: false,
    canUseUntrained: true
  },

  dodge: {
    key: "dodge",
    name: "Dodge",
    characteristic: "agility",
    patronage: "slaanesh",
    group: false,
    canUseUntrained: true
  },

  forbiddenLore: {
    key: "forbiddenLore",
    name: "Forbidden Lore",
    characteristic: "intelligence",
    patronage: "tzeentch",
    group: true,
    canUseUntrained: false
  },

  inquiry: {
    key: "inquiry",
    name: "Inquiry",
    characteristic: "fellowship",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  interrogate: {
    key: "interrogate",
    name: "Interrogate",
    characteristic: "willpower",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  intimidate: {
    key: "intimidate",
    name: "Intimidate",
    characteristic: "willpower",
    patronage: "nurgle",
    group: false,
    canUseUntrained: true
  },

  linguistics: {
    key: "linguistics",
    name: "Linguistics",
    characteristic: "intelligence",
    patronage: "undivided",
    group: true,
    canUseUntrained: true
  },

  logic: {
    key: "logic",
    name: "Logic",
    characteristic: "intelligence",
    patronage: "tzeentch",
    group: false,
    canUseUntrained: true
  },

  medicae: {
    key: "medicae",
    name: "Medicae",
    characteristic: "intelligence",
    patronage: "nurgle",
    group: false,
    canUseUntrained: true
  },

  navigation: {
    key: "navigation",
    name: "Navigation",
    characteristic: "intelligence",
    patronage: "undivided",
    group: true,
    canUseUntrained: true
  },

  operateSurface: {
    key: "operateSurface",
    name: "Operate (Surface)",
    characteristic: "agility",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  operateAeronautica: {
    key: "operateAeronautica",
    name: "Operate (Aeronautica)",
    characteristic: "agility",
    patronage: "undivided",
    group: false,
    canUseUntrained: false
  },

  operateVoidship: {
    key: "operateVoidship",
    name: "Operate (Voidship)",
    characteristic: "intelligence",
    patronage: "undivided",
    group: false,
    canUseUntrained: false
  },

  parry: {
    key: "parry",
    name: "Parry",
    characteristic: "weaponSkill",
    patronage: "khorne",
    group: false,
    canUseUntrained: true
  },

  psyniscience: {
    key: "psyniscience",
    name: "Psyniscience",
    characteristic: "perception",
    patronage: "tzeentch",
    group: false,
    canUseUntrained: true
  },

  scholasticLore: {
    key: "scholasticLore",
    name: "Scholastic Lore",
    characteristic: "intelligence",
    patronage: "undivided",
    group: true,
    canUseUntrained: true
  },

  scrutiny: {
    key: "scrutiny",
    name: "Scrutiny",
    characteristic: "perception",
    patronage: "tzeentch",
    group: false,
    canUseUntrained: true
  },

  security: {
    key: "security",
    name: "Security",
    characteristic: "intelligence",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  sleightOfHand: {
    key: "sleightOfHand",
    name: "Sleight of Hand",
    characteristic: "agility",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  stealth: {
    key: "stealth",
    name: "Stealth",
    characteristic: "agility",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  survival: {
    key: "survival",
    name: "Survival",
    characteristic: "perception",
    patronage: "nurgle",
    group: false,
    canUseUntrained: true
  },

  techUse: {
    key: "techUse",
    name: "Tech-Use",
    characteristic: "intelligence",
    patronage: "undivided",
    group: false,
    canUseUntrained: true
  },

  trade: {
    key: "trade",
    name: "Trade",
    characteristic: "intelligence",
    patronage: "alwaysAllied",
    group: true,
    canUseUntrained: true
  }
};

export function getSkillDefinition(
  skillKey
) {
  return (
    SKILLS[
      String(skillKey ?? "").trim()
    ] ?? null
  );
}

export function resolveSkillPatronage(
  skillKey,
  specialization = ""
) {
  const definition =
    getSkillDefinition(skillKey);

  if (!definition) {
    return null;
  }

  /*
   * DoomBC Core:
   * Forbidden Lore обычно относится к Тзинчу,
   * но специализация Heresy относится к Нурглу.
   */
  if (
    definition.key === "forbiddenLore" &&
    String(specialization)
      .trim()
      .toLowerCase() === "heresy"
  ) {
    return "nurgle";
  }

  return definition.patronage;
}

export function getSkillDisplayName(
  skillKey,
  specialization = ""
) {
  const definition =
    getSkillDefinition(skillKey);

  if (!definition) {
    return null;
  }

  const spec =
    String(specialization ?? "").trim();

  if (
    definition.group &&
    spec
  ) {
    return `${definition.name} (${spec})`;
  }

  return definition.name;
}
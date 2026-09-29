export const TALENTS = {
  unremarkable: {
    key: "unremarkable",
    name: "Unremarkable",
    tier: 1,
    patronage: "tzeentch",

    prerequisites: "",
    requirements: [],

    specialization: "",
    repeatable: false,

    description:
      "Персонажа значительно труднее опознать, описать или вспомнить по внешности."
  },

  quickDraw: {
    key: "quickDraw",
    name: "Quick Draw",
    tier: 1,
    patronage: "undivided",

    prerequisites: "",
    requirements: [],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет быстро достать подходящее оружие или инструмент."
  },

  disturbingVoice: {
    key: "disturbingVoice",
    name: "Disturbing Voice",
    tier: 1,
    patronage: "nurgle",

    prerequisites: "",
    requirements: [],

    specialization: "",
    repeatable: false,

    description:
      "Зловещий голос помогает при запугивании, но мешает части обычных социальных взаимодействий."
  },

  deadeyeShot: {
    key: "deadeyeShot",
    name: "Deadeye Shot",
    tier: 1,
    patronage: "tzeentch",

    prerequisites:
      "BS 30",

    requirements: [
      {
        type: "characteristic",
        key: "ballisticSkill",
        value: 30,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Уменьшает штраф за Избирательный выстрел и связанные прицельные атаки."
  },

  sharpshooter: {
    key: "sharpshooter",
    name: "Sharpshooter",
    tier: 2,
    patronage: "tzeentch",

    prerequisites:
      "BS 40, Deadeye Shot",

    requirements: [
      {
        type: "characteristic",
        key: "ballisticSkill",
        value: 40,
        specialization: ""
      },

      {
        type: "talent",
        key: "deadeyeShot",
        value: 0,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Дополнительно уменьшает штраф за Избирательный выстрел и Размер."
  },

  calmWinds: {
    key: "calmWinds",
    name: "Calm Winds",
    tier: 1,
    patronage: "tzeentch",

    prerequisites:
      "Psyniscience +10",

    requirements: [
      {
        type: "skill",
        key: "psyniscience",
        value: 10,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет лучше контролировать последствия Усмирения Варпа."
  },

  blasphemousIncantation: {
    key: "blasphemousIncantation",
    name: "Blasphemous Incantation",
    tier: 3,
    patronage: "tzeentch",

    prerequisites:
      "I 30, Scholastic Lore (Occult) +0",

    requirements: [
      {
        type: "characteristic",
        key: "intelligence",
        value: 30,
        specialization: ""
      },

      {
        type: "skill",
        key: "scholasticLore",
        value: 0,
        specialization: "Occult"
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет усилить психосилу за счёт более длительной и опасной инкантации."
  }
};

export function getTalentDefinition(
  talentKey
) {
  const key =
    String(talentKey ?? "").trim();

  return TALENTS[key] ?? null;
}

export function getTalentDisplayName(
  talentKey,
  specialization = ""
) {
  const definition =
    getTalentDefinition(talentKey);

  if (!definition) {
    return null;
  }

  const spec =
    String(
      specialization ?? ""
    ).trim();

  if (spec) {
    return `${definition.name} (${spec})`;
  }

  return definition.name;
}
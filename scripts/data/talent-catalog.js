export const TALENTS = {
  // =========================================================
  // Проверенные ранее таланты
  // =========================================================

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
      "Дополнительно уменьшает штрафы при точной стрельбе."
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
      "Позволяет усиливать психосилы с помощью опасных ритуальных инкантаций."
  },

  // =========================================================
  // СКОРОСТЬ
  // =========================================================

  leapUp: {
    key: "leapUp",
    name: "Leap Up",
    tier: 1,
    patronage: "slaanesh",

    prerequisites:
      "A 30",

    requirements: [
      {
        type: "characteristic",
        key: "agility",
        value: 30,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет Встать за свободное действие."
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
      "Позволяет быстро взять подходящее одноручное оружие или инструмент."
  },

  rapidReload: {
    key: "rapidReload",
    name: "Rapid Reload",
    tier: 1,
    patronage: "slaanesh",

    prerequisites: "",
    requirements: [],

    specialization: "",
    repeatable: false,

    description:
      "Сокращает время перезарядки оружия вдвое."
  },

  technicalKnock: {
    key: "technicalKnock",
    name: "Technical Knock",
    tier: 1,
    patronage: "undivided",

    prerequisites:
      "I 30",

    requirements: [
      {
        type: "characteristic",
        key: "intelligence",
        value: 30,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет проводить Расклин за полудействие."
  },

  breacher: {
    key: "breacher",
    name: "Breacher",
    tier: 2,
    patronage: "nurgle",

    prerequisites:
      "P 40",

    requirements: [
      {
        type: "characteristic",
        key: "perception",
        value: 40,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет эффективнее двигаться и атаковать в защитной стойке со щитом."
  },

  halfStep: {
    key: "halfStep",
    name: "Half-Step",
    tier: 2,
    patronage: "undivided",

    prerequisites:
      "A 35, P 35",

    requirements: [
      {
        type: "characteristic",
        key: "agility",
        value: 35,
        specialization: ""
      },

      {
        type: "characteristic",
        key: "perception",
        value: 35,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Даёт ограниченное дополнительное перемещение за свободное действие."
  },

  jumper: {
    key: "jumper",
    name: "Jumper",
    tier: 2,
    patronage: "slaanesh",

    prerequisites:
      "Acrobatics +10",

    requirements: [
      {
        type: "skill",
        key: "acrobatics",
        value: 10,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет выполнять Прыжки быстрее и совмещать их с Натиском."
  },

  reposition: {
    key: "reposition",
    name: "Reposition",
    tier: 2,
    patronage: "slaanesh",

    prerequisites:
      "A 35, P 45",

    requirements: [
      {
        type: "characteristic",
        key: "agility",
        value: 35,
        specialization: ""
      },

      {
        type: "characteristic",
        key: "perception",
        value: 45,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет совершить Полудвижение в начале боя после определения Инициативы."
  },

  preternaturalSpeed: {
    key: "preternaturalSpeed",
    name: "Preternatural Speed",
    tier: 3,
    patronage: "slaanesh",

    prerequisites:
      "WS 40, A 50",

    requirements: [
      {
        type: "characteristic",
        key: "weaponSkill",
        value: 40,
        specialization: ""
      },

      {
        type: "characteristic",
        key: "agility",
        value: 50,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет совершать Натиск на дистанцию Бега."
  },

  quickStore: {
    key: "quickStore",
    name: "Quick Store",
    tier: 3,
    patronage: "slaanesh",

    prerequisites:
      "A 50, Quick Draw",

    requirements: [
      {
        type: "characteristic",
        key: "agility",
        value: 50,
        specialization: ""
      },

      {
        type: "talent",
        key: "quickDraw",
        value: 0,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет быстро сложить подходящее оружие или инструмент."
  },

  sprint: {
    key: "sprint",
    name: "Sprint",
    tier: 3,
    patronage: "slaanesh",

    prerequisites: "",
    requirements: [],

    specialization: "",
    repeatable: false,

    description:
      "Значительно увеличивает дистанцию Полного Движения и Бега."
  },

  // =========================================================
  // ВНИМАТЕЛЬНОСТЬ
  // =========================================================

  analyticalEye: {
    key: "analyticalEye",
    name: "Analytical Eye",
    tier: 1,
    patronage: "undivided",

    prerequisites:
      "I 40, P 30",

    requirements: [
      {
        type: "characteristic",
        key: "intelligence",
        value: 40,
        specialization: ""
      },

      {
        type: "characteristic",
        key: "perception",
        value: 30,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет использовать Intelligence вместо Perception для части тестов Awareness."
  },

  blindFighting: {
    key: "blindFighting",
    name: "Blind Fighting",
    tier: 1,
    patronage: "tzeentch",

    prerequisites:
      "P 30",

    requirements: [
      {
        type: "characteristic",
        key: "perception",
        value: 30,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Уменьшает штрафы от слепоты, темноты и плохой видимости в ближнем бою."
  },

  heightenedSenses: {
    key: "heightenedSenses",
    name: "Heightened Senses",
    tier: 1,
    patronage: "slaanesh",

    prerequisites: "",
    requirements: [],

    specialization: "",

    specializations: [
      "Sight",
      "Hearing",
      "Smell",
      "Taste",
      "Touch"
    ],

    repeatable: false,

    description:
      "Даёт +10 к тестам, связанным с выбранным чувством."
  },

  lightSleeper: {
    key: "lightSleeper",
    name: "Light Sleeper",
    tier: 1,
    patronage: "tzeentch",

    prerequisites:
      "P 30",

    requirements: [
      {
        type: "characteristic",
        key: "perception",
        value: 30,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет сохранять полную внимательность даже во сне."
  },

  lipReading: {
    key: "lipReading",
    name: "Lip Reading",
    tier: 1,
    patronage: "tzeentch",

    prerequisites:
      "Awareness +10",

    requirements: [
      {
        type: "skill",
        key: "awareness",
        value: 10,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет понимать чужую речь по движениям губ."
  },

  taster: {
    key: "taster",
    name: "Taster",
    tier: 1,
    patronage: "tzeentch",

    prerequisites:
      "Trade (Cook) OR Trade (Chymist)",

    requirements: [
      {
        type: "anyOf",
        key: "",
        value: 0,
        specialization: "",

        anyOf: [
          {
            type: "skill",
            key: "trade",
            value: 0,
            specialization: "Cook"
          },

          {
            type: "skill",
            key: "trade",
            value: 0,
            specialization: "Chymist"
          }
        ]
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Помогает распознавать яды по запаху и вкусу и анализировать пищу и напитки."
  },

  sentry: {
    key: "sentry",
    name: "Sentry",
    tier: 2,
    patronage: "tzeentch",

    prerequisites:
      "P 40",

    requirements: [
      {
        type: "characteristic",
        key: "perception",
        value: 40,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Даёт Преимущество на пассивные тесты Awareness."
  },

  sixthSense: {
    key: "sixthSense",
    name: "Sixth Sense",
    tier: 2,
    patronage: "undivided",

    prerequisites:
      "Awareness +30",

    requirements: [
      {
        type: "skill",
        key: "awareness",
        value: 30,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет тратить Очко Бесчестия, чтобы получить шанс Избежать от Незримой атаки."
  },

  thiefcatcher: {
    key: "thiefcatcher",
    name: "Thiefcatcher",
    tier: 2,
    patronage: "tzeentch",

    prerequisites:
      "P 45",

    requirements: [
      {
        type: "characteristic",
        key: "perception",
        value: 45,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Улучшает способность замечать маскировку, воров, шпионов и скрытые движения."
  },

  blindsight: {
    key: "blindsight",
    name: "Blindsight",
    tier: 3,
    patronage: "slaanesh",

    prerequisites:
      "P 50, Awareness +30",

    requirements: [
      {
        type: "characteristic",
        key: "perception",
        value: 50,
        specialization: ""
      },

      {
        type: "skill",
        key: "awareness",
        value: 30,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Позволяет воспринимать окружение с помощью чрезвычайно развитых чувств даже без зрения."
  },

  securityDetail: {
    key: "securityDetail",
    name: "Security Detail",
    tier: 3,
    patronage: "tzeentch",

    prerequisites:
      "Awareness +20, Security +0",

    requirements: [
      {
        type: "skill",
        key: "awareness",
        value: 20,
        specialization: ""
      },

      {
        type: "skill",
        key: "security",
        value: 0,
        specialization: ""
      }
    ],

    specialization: "",
    repeatable: false,

    description:
      "Повышает эффективность Awareness при поиске скрытых угроз."
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
export const TALENTS = {
  soundConstitution: {
    key: "soundConstitution",
    name: "Sound Constitution",
    // Special advancement: no standard Tier or patronage cost table.
    tier: 0,
    patronage: "undivided",
    prerequisites: "",
    requirements: [],
    specialization: "",
    repeatable: true,
    description: "Крепкое Телосложение. +1 Рана. Цена: 100 XP или 70 XP при Покровительстве Нургла. Можно приобрести до T.b раз, ещё +2 раза для не-Космодесантников. Эффект +1 Рана пока применяется вручную."
  },

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
  },

  // ИЗБЕГАНИЕ — DoomBC Core, стр. 65–66. Эффекты пока не автоматизированы.
  bodyguard: {
    "key": "bodyguard",
    "name": "Bodyguard",
    "tier": 1,
    "patronage": "nurgle",
    "prerequisites": "WS 40",
    "requirements": [
      {
        "type": "characteristic",
        "key": "weaponSkill",
        "value": 40,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет парировать атаки по союзнику при соблюдении дистанции удара."
  },

  catfall: {
    "key": "catfall",
    "name": "Catfall",
    "tier": 1,
    "patronage": "slaanesh",
    "prerequisites": "A 30",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 30,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Уменьшает высоту падения для расчёта урона на A.b, даёт +20 на Группирование и позволяет приземляться на ноги."
  },

  chomper: {
    "key": "chomper",
    "name": "Chomper",
    "tier": 1,
    "patronage": "khorne",
    "prerequisites": "WS 35, Parry +0, Disarm",
    "requirements": [
      {
        "type": "characteristic",
        "key": "weaponSkill",
        "value": 35,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "parry",
        "value": 0,
        "specialization": ""
      },
      {
        "type": "talent",
        "key": "disarm",
        "value": 0,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет парировать имеющейся атакой укусом с Балансом 0 и сразу обезоруживать атакующего; неотменённые неизбирательные попадания приходятся в голову."
  },

  escapeArtist: {
    "key": "escapeArtist",
    "name": "Escape Artist",
    "tier": 1,
    "patronage": "slaanesh",
    "prerequisites": "A 40",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 40,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Уменьшает штрафы на тесты А против Snare и для выхода из Борьбы на A.b×5, удваивает конечные Успехи; при исходном штрафе ниже A.b×3 разрешает переброс."
  },

  flip: {
    "key": "flip",
    "name": "Flip",
    "tier": 1,
    "patronage": "slaanesh",
    "prerequisites": "A 45, Acrobatics +10",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 45,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "acrobatics",
        "value": 10,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "При сбивании с ног позволяет тестом Acrobatics +0 сразу встать; после падения на Трудном Ландшафте позволяет продолжить движение."
  },

  flourishDance: {
    "key": "flourishDance",
    "name": "Flourish Dance",
    "tier": 1,
    "patronage": "slaanesh",
    "prerequisites": "A 40, Trade (Dancer) +0",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "trade",
        "value": 0,
        "specialization": "Dancer"
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет танцем с плащом в свободной руке наложить штраф на атаки одного противника через встречный тест Dancer (A) против Awareness (P)."
  },

  highGuard: {
    "key": "highGuard",
    "name": "High Guard",
    "tier": 1,
    "patronage": "khorne",
    "prerequisites": "Parry +10",
    "requirements": [
      {
        "type": "skill",
        "key": "parry",
        "value": 10,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет проводить Вольт через Parry (WS) вместо Acrobatics (A), учитывая модификаторы баланса рукопашного оружия."
  },

  pirouette: {
    "key": "pirouette",
    "name": "Pirouette",
    "tier": 1,
    "patronage": "slaanesh",
    "prerequisites": "A 40, Acrobatics +0",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "acrobatics",
        "value": 0,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет тестом Acrobatics +0 без траты Реакции отскочить с пути Напролом или Тарана."
  },

  bladeReader: {
    "key": "bladeReader",
    "name": "Blade Reader",
    "tier": 2,
    "patronage": "khorne",
    "prerequisites": "WS 40, Scrutiny +0",
    "requirements": [
      {
        "type": "characteristic",
        "key": "weaponSkill",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "scrutiny",
        "value": 0,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет перебрасывать встречные тесты против Финта через Scrutiny (WS); для экзотического оружия требуется владение им или Arms Master."
  },

  caution: {
    "key": "caution",
    "name": "Caution",
    "tier": 2,
    "patronage": "undivided",
    "prerequisites": "P 40, Awareness +0",
    "requirements": [
      {
        "type": "characteristic",
        "key": "perception",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "awareness",
        "value": 0,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Раз в Ход позволяет получить 1 Реакцию за ментальное полудействие Концентрации."
  },

  combatMaster: {
    "key": "combatMaster",
    "name": "Combat Master",
    "tier": 2,
    "patronage": "khorne",
    "prerequisites": "WS 30",
    "requirements": [
      {
        "type": "characteristic",
        "key": "weaponSkill",
        "value": 30,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Противники не получают бонус за численное превосходство при рукопашных атаках по персонажу."
  },

  counterfeint: {
    "key": "counterfeint",
    "name": "Counterfeint",
    "tier": 2,
    "patronage": "tzeentch",
    "prerequisites": "P 50, Awareness +20",
    "requirements": [
      {
        "type": "characteristic",
        "key": "perception",
        "value": 50,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "awareness",
        "value": 20,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет использовать Awareness (P) вместо WS против Финтов, без бонусов от оружия."
  },

  deflectShot: {
    "key": "deflectShot",
    "name": "Deflect Shot",
    "tier": 2,
    "patronage": "slaanesh",
    "prerequisites": "A 50, Parry +10",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 50,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "parry",
        "value": 10,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет оружием с Балансом 1+ парировать дозвуковые снаряды и метательное оружие; при 5+ Успехах можно отбить гранату обратно."
  },

  hardTarget: {
    "key": "hardTarget",
    "name": "Hard Target",
    "tier": 2,
    "patronage": "slaanesh",
    "prerequisites": "A 50",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 50,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "После Верховой Атаки, Натиска или Бега стрельба по персонажу получает −10 до начала его следующего Хода."
  },

  meatShield: {
    "key": "meatShield",
    "name": "Meat Shield",
    "tier": 2,
    "patronage": "khorne",
    "prerequisites": "WS 30, Athletics +20",
    "requirements": [
      {
        "type": "characteristic",
        "key": "weaponSkill",
        "value": 30,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "athletics",
        "value": 20,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Перенаправляет попадания по персонажу с арки 180° со стороны удерживаемой в Захвате жертвы в эту жертву."
  },

  salto: {
    "key": "salto",
    "name": "Salto",
    "tier": 2,
    "patronage": "slaanesh",
    "prerequisites": "P 40, Acrobatics +10",
    "requirements": [
      {
        "type": "characteristic",
        "key": "perception",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "acrobatics",
        "value": 10,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Увеличивает дистанцию отскока в Раунд на P.b м; раз в Ход позволяет без Реакции уклониться от пересекаемого шаблона Linger."
  },

  slipAway: {
    "key": "slipAway",
    "name": "Slip Away",
    "tier": 2,
    "patronage": "slaanesh",
    "prerequisites": "A 40",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 40,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Раз в Раунд даёт +30 до броска или переброс для Уклонения от Захвата либо теста А в Борьбе; позволяет игнорировать авто-ничью от Unnatural Characteristic в соответствующих встречных тестах А."
  },

  speedAwareness: {
    "key": "speedAwareness",
    "name": "Speed Awareness",
    "tier": 2,
    "patronage": "slaanesh",
    "prerequisites": "Acrobatics +20, Awareness +20",
    "requirements": [
      {
        "type": "skill",
        "key": "acrobatics",
        "value": 20,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "awareness",
        "value": 20,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Разрешает Избегания после Бега со штрафом −5 за каждые полные P.b пробежанных метров."
  },

  adrenalineRush: {
    "key": "adrenalineRush",
    "name": "Adrenaline Rush",
    "tier": 3,
    "patronage": "undivided",
    "prerequisites": "T 40, A 40, P 40",
    "requirements": [
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "characteristic",
        "key": "agility",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "characteristic",
        "key": "perception",
        "value": 40,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Раз за бой или сцену позволяет потратить Очко Бесчестия, чтобы восстановить потраченные Реакции и дистанцию отскока."
  },

  bladeShield: {
    "key": "bladeShield",
    "name": "Blade Shield",
    "tier": 3,
    "patronage": "slaanesh",
    "prerequisites": "P 50, Parry +20, Deflect Shot",
    "requirements": [
      {
        "type": "characteristic",
        "key": "perception",
        "value": 50,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "parry",
        "value": 20,
        "specialization": ""
      },
      {
        "type": "talent",
        "key": "deflectShot",
        "value": 0,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет парировать стрельбу оружием с Балансом 1+, отменяя одно попадание; при Pen 6+ стрелковое оружие считается имеющим Power Field для парирования."
  },

  bulwark: {
    "key": "bulwark",
    "name": "Bulwark",
    "tier": 3,
    "patronage": "undivided",
    "prerequisites": "S 50, Parry +20",
    "requirements": [
      {
        "type": "characteristic",
        "key": "strength",
        "value": 50,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "parry",
        "value": 20,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Разрешает переброс Парирования щитом, считает его Баланс равным 1 для других Талантов и облегчает движение с каплевидными и башенными щитами."
  },

  snapshot: {
    "key": "snapshot",
    "name": "Snapshot",
    "tier": 3,
    "patronage": "tzeentch",
    "prerequisites": "BS 50, P 50, Trick Shooter",
    "requirements": [
      {
        "type": "characteristic",
        "key": "ballisticSkill",
        "value": 50,
        "specialization": ""
      },
      {
        "type": "characteristic",
        "key": "perception",
        "value": 50,
        "specialization": ""
      },
      {
        "type": "talent",
        "key": "trickShooter",
        "value": 0,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "При движении не дальше полудвижения даёт в конце Хода 1 ОД как Задержкой только для выстрела по брошенному предмету, игнорируя обычное ограничение атак Задержкой."
  },

  stepAside: {
    "key": "stepAside",
    "name": "Step Aside",
    "tier": 3,
    "patronage": "undivided",
    "prerequisites": "A 40, Dodge +0, Parry +0",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "dodge",
        "value": 0,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "parry",
        "value": 0,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Даёт 1 дополнительную Реакцию, которую можно потратить только на Избегание."
  },

  // Зависимости: Disarm — Core, стр. 71; Trick Shooter — стр. 80.
  disarm: {
    "key": "disarm",
    "name": "Disarm",
    "tier": 1,
    "patronage": "undivided",
    "prerequisites": "A 30",
    "requirements": [
      {
        "type": "characteristic",
        "key": "agility",
        "value": 30,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Открывает приём Обезоружить: встречный тест WS позволяет выбить оружие, а при 5+ Успехах — выбить второе или забрать первое; интегрированное оружие не выбивается."
  },

  trickShooter: {
    "key": "trickShooter",
    "name": "Trick Shooter",
    "tier": 1,
    "patronage": "tzeentch",
    "prerequisites": "BS 45",
    "requirements": [
      {
        "type": "characteristic",
        "key": "ballisticSkill",
        "value": 45,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Уменьшает на 30 штрафы за атаки по необычным целям, которые не наносят прямого урона персонажам, например по летящей гранате."
  },

  // СТОЙКОСТЬ — Core, стр. 67–68. Данные/покупка; эффекты не автоматизированы.
  decadence: {
    "key": "decadence",
    "name": "Decadence",
    "tier": 1,
    "patronage": "slaanesh",
    "prerequisites": "T 30",
    "requirements": [
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 30,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Удваивает пределы накопленных провалов от алкоголя и даёт +10 против негативных эффектов и пост-эффектов наркотиков и Зависимости."
  },

  dieHard: {
    "key": "dieHard",
    "name": "Die Hard",
    "tier": 1,
    "patronage": "nurgle",
    "prerequisites": "W 40",
    "requirements": [
      {
        "type": "characteristic",
        "key": "willpower",
        "value": 40,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет перебрасывать тесты на Кровотечение и смерть от шока."
  },

  dropAndRoll: {
    "key": "dropAndRoll",
    "name": "Drop and Roll",
    "tier": 1,
    "patronage": "nurgle",
    "prerequisites": "",
    "requirements": [],
    "specialization": "",
    "repeatable": false,
    "description": "За полудействие автоматически тушит себя или согласного либо паникующего персонажа в касании, сбивая потушенного с ног."
  },

  headGuard: {
    "key": "headGuard",
    "name": "Head Guard",
    "tier": 1,
    "patronage": "slaanesh",
    "prerequisites": "P 45, Awareness +10",
    "requirements": [
      {
        "type": "characteristic",
        "key": "perception",
        "value": 45,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "awareness",
        "value": 10,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Раз в Раунд позволяет перенести попадание в голову на выбранную руку, кроме Избирательного попадания в глаз или сочленения шеи."
  },

  ironJaw: {
    "key": "ironJaw",
    "name": "Iron Jaw",
    "tier": 1,
    "patronage": "nurgle",
    "prerequisites": "T 40",
    "requirements": [
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 40,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет тестом T +0 проигнорировать получаемое Оглушение."
  },

  snakeEater: {
    "key": "snakeEater",
    "name": "Snake Eater",
    "tier": 1,
    "patronage": "nurgle",
    "prerequisites": "T 40, Medicae +0",
    "requirements": [
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "medicae",
        "value": 0,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Уменьшает вдвое урон от ядов и длительность Отравления, эффектов ядов и пост-эффектов стимуляторов с округлением вверх."
  },

  resistance: {
    "key": "resistance",
    "name": "Resistance",
    "tier": 1,
    "patronage": "nurgle",
    "prerequisites": "",
    "requirements": [],
    "specialization": "",
    "repeatable": false,
    "description": "Даёт +10 на тесты сопротивления угрозам выбранной специализации.",
    "specializations": [
      "Cold",
      "Blindness",
      "Deafness",
      "Disease",
      "Fear",
      "Heat",
      "Poison",
      "Psychic Powers",
      "Stun"
    ]
  },

  thumper: {
    "key": "thumper",
    "name": "Thumper",
    "tier": 1,
    "patronage": "nurgle",
    "prerequisites": "",
    "requirements": [],
    "specialization": "",
    "repeatable": false,
    "description": "Даёт Преимущество на тесты T против Оглушения ударными волнами, уменьшает вдвое штрафы инфразвука с округлением вверх и на 20 — штраф слышимости речи сквозь шум."
  },

  armourMonger: {
    "key": "armourMonger",
    "name": "Armour-Monger",
    "tier": 2,
    "patronage": "undivided",
    "prerequisites": "I 35, Tech-Use +0, Trade (Armourer) +0",
    "requirements": [
      {
        "type": "characteristic",
        "key": "intelligence",
        "value": 35,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "techUse",
        "value": 0,
        "specialization": ""
      },
      {
        "type": "skill",
        "key": "trade",
        "value": 0,
        "specialization": "Armourer"
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Увеличивает AP личной брони на 2 на всех участках при ежедневном часовом обслуживании."
  },

  // По решению пользователя: требования из описания (стр. 68), не таблицы (стр. 67).
  finalPush: {
    "key": "finalPush",
    "name": "Final Push",
    "tier": 2,
    "patronage": "nurgle",
    "prerequisites": "",
    "requirements": [],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет тестом T +0 отложить применение полученных Критических Эффектов до конца своего Хода."
  },

  hunkerDown: {
    "key": "hunkerDown",
    "name": "Hunker Down",
    "tier": 2,
    "patronage": "nurgle",
    "prerequisites": "",
    "requirements": [],
    "specialization": "",
    "repeatable": false,
    "description": "За полудействие удваивает расчётный AP укрытия и даёт обычный AP укрытия выглядывающим частям тела до начала следующего Хода."
  },

  tireless: {
    "key": "tireless",
    "name": "Tireless",
    "tier": 2,
    "patronage": "nurgle",
    "prerequisites": "T 45",
    "requirements": [
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 45,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Убирает штраф −10 от Усталости для действий без типа Ментальное."
  },

  hardy: {
    "key": "hardy",
    "name": "Hardy",
    "tier": 2,
    "patronage": "nurgle",
    "prerequisites": "T 40",
    "requirements": [
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 40,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Для лечения персонаж всегда считается легко раненным."
  },

  mentalFortitude: {
    "key": "mentalFortitude",
    "name": "Mental Fortitude",
    "tier": 2,
    "patronage": "tzeentch",
    "prerequisites": "W 45",
    "requirements": [
      {
        "type": "characteristic",
        "key": "willpower",
        "value": 45,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "При Усталости не выше W.b не получает её штрафов; теряет сознание при T.b + 2×W.b вместо T.b + W.b."
  },

  stonewall: {
    "key": "stonewall",
    "name": "Stonewall",
    "tier": 2,
    "patronage": "nurgle",
    "prerequisites": "S 40, T 40",
    "requirements": [
      {
        "type": "characteristic",
        "key": "strength",
        "value": 40,
        "specialization": ""
      },
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 40,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Тест S +0 позволяет игнорировать сбивание с ног или принудительное перемещение; при рукопашном приёме на 5+ Успехах можно соответственно сбить или сдвинуть атакующего."
  },

  ablativeHardening: {
    "key": "ablativeHardening",
    "name": "Ablative Hardening",
    "tier": 3,
    "patronage": "undivided",
    "prerequisites": "Trade (Armourer) +20",
    "requirements": [
      {
        "type": "skill",
        "key": "trade",
        "value": 20,
        "specialization": "Armourer"
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "После часового обслуживания броня получает I.b зарядов прочности; каждый позволяет игнорировать один эффект снижения AP."
  },

  hardenedSoul: {
    "key": "hardenedSoul",
    "name": "Hardened Soul",
    "tier": 3,
    "patronage": "tzeentch",
    "prerequisites": "Forbidden Lore (Warp) +10",
    "requirements": [
      {
        "type": "skill",
        "key": "forbiddenLore",
        "value": 10,
        "specialization": "Warp"
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Добавляет половину I.b с округлением вверх к поглощению урона варп-оружия и на столько же уменьшает кубики урона при проигрыше против Выжигания Души, минимум до одного."
  },

  neverDie: {
    "key": "neverDie",
    "name": "Never Die",
    "tier": 3,
    "patronage": "nurgle",
    "prerequisites": "W 50, T 50",
    "requirements": [
      {
        "type": "characteristic",
        "key": "willpower",
        "value": 50,
        "specialization": ""
      },
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 50,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Позволяет потратить Очко Бесчестия, чтобы игнорировать все эффекты полученного Критического Эффекта; урон не предотвращается."
  },

  painIsAnIllusion: {
    "key": "painIsAnIllusion",
    "name": "Pain Is an Illusion",
    "tier": 3,
    "patronage": "tzeentch",
    "prerequisites": "W 50",
    "requirements": [
      {
        "type": "characteristic",
        "key": "willpower",
        "value": 50,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Тест W +0 уменьшает полученный Критический Эффект на число Успехов, минимум до 1."
  },

  trueGrit: {
    "key": "trueGrit",
    "name": "True Grit",
    "tier": 3,
    "patronage": "nurgle",
    "prerequisites": "T 45",
    "requirements": [
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 45,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "При отрицательных Ранах уменьшает получаемый урон на T.b до минимума 1; действует и на попадание, переводящее Раны ниже нуля, но оставляет как минимум −1 Рану."
  },

  // Core, стр. 68. Infamy/Corruption prerequisites; эффекты не автоматизированы.
  eyeOfTheGods: {
    "key": "eyeOfTheGods",
    "name": "Eye of the Gods",
    "tier": 3,
    "patronage": "undivided",
    "prerequisites": "Inf 70, Cor 60",
    "requirements": [
      {
        "type": "resource",
        "key": "infamy",
        "value": 70,
        "specialization": ""
      },
      {
        "type": "resource",
        "key": "corruption",
        "value": 60,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "Ограничивает потерю Ран от атак рядовых врагов суммарно 10 за Раунд и отдельно 10 от каждого значимого персонажа; игнорирование урона считается действием щита-дефлектора и обходится методами против него."
  },

  hellishResilience: {
    "key": "hellishResilience",
    "name": "Hellish Resilience",
    "tier": 3,
    "patronage": "nurgle",
    "prerequisites": "T 50, Cor 30",
    "requirements": [
      {
        "type": "characteristic",
        "key": "toughness",
        "value": 50,
        "specialization": ""
      },
      {
        "type": "resource",
        "key": "corruption",
        "value": 30,
        "specialization": ""
      }
    ],
    "specialization": "",
    "repeatable": false,
    "description": "При получении непоглощённого урона позволяет потратить Очко Бесчестия для +Cor.b поглощения против этого урона и до конца следующего Хода."
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
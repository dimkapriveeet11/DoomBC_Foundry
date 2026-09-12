const EMPTY_MODIFIERS = {
  weaponSkill: 0,
  ballisticSkill: 0,
  strength: 0,
  toughness: 0,
  agility: 0,
  intelligence: 0,
  perception: 0,
  willpower: 0,
  fellowship: 0
};

function aspiration(data) {
  return {
    infamy: 0,
    corruption: 0,
    wounds: 0,
    skillModifiers: [],
    specialRules: [],
    choiceType: "",
    choiceOptions: [],
    characteristicModifiers: {},
    ...data
  };
}

export const ASPIRATION_TABLES = {
  pride: {
    1: aspiration({
      name: "Красота",
      effectSummary: "+5 Inf, +5 F, -5 W.",
      infamy: 5,
      characteristicModifiers: {
        fellowship: 5,
        willpower: -5
      }
    }),

    2: aspiration({
      name: "Очарование",
      effectSummary: "+5 F или P, -5 T.",
      characteristicModifiers: {
        toughness: -5
      },
      choiceType: "oneCharacteristicPlus5",
      choiceOptions: [
        "fellowship",
        "perception"
      ]
    }),

    3: aspiration({
      name: "Ремесло",
      effectSummary:
        "+1 Inf, +3 A, +3 I, -3 WS, -3 BS.",
      infamy: 1,
      characteristicModifiers: {
        agility: 3,
        intelligence: 3,
        weaponSkill: -3,
        ballisticSkill: -3
      }
    }),

    4: aspiration({
      name: "Вера",
      effectSummary: "+5 W, -5 S.",
      characteristicModifiers: {
        willpower: 5,
        strength: -5
      }
    }),

    5: aspiration({
      name: "Стойкость",
      effectSummary: "+5 T, -3 I, -3 F.",
      characteristicModifiers: {
        toughness: 5,
        intelligence: -3,
        fellowship: -3
      }
    }),

    6: aspiration({
      name: "Проницательность",
      effectSummary: "+5 P, -5 F.",
      characteristicModifiers: {
        perception: 5,
        fellowship: -5
      }
    }),

    7: aspiration({
      name: "Логика",
      effectSummary: "+5 I, -5 F.",
      characteristicModifiers: {
        intelligence: 5,
        fellowship: -5
      }
    }),

    8: aspiration({
      name: "Мастерство",
      effectSummary: "+5 WS или BS, -5 I.",
      characteristicModifiers: {
        intelligence: -5
      },
      choiceType: "oneCharacteristicPlus5",
      choiceOptions: [
        "weaponSkill",
        "ballisticSkill"
      ]
    }),

    9: aspiration({
      name: "Изящество",
      effectSummary: "+5 A, -5 BS.",
      characteristicModifiers: {
        agility: 5,
        ballisticSkill: -5
      }
    }),

    10: aspiration({
      name: "Богатство",
      effectSummary:
        "+1 дополнительное снаряжение с R 4, -3 W.",
      characteristicModifiers: {
        willpower: -3
      },
      specialRules: [
        "Дополнительное стартовое снаряжение с R 4"
      ]
    })
  },

  disgrace: {
    1: aspiration({
      name: "Предательство",
      effectSummary:
        "+3 Cor, +5 I, -10 на тесты Charm.",
      corruption: 3,
      characteristicModifiers: {
        intelligence: 5
      },
      skillModifiers: [
        {
          skill: "Charm",
          modifier: -10
        }
      ]
    }),

    2: aspiration({
      name: "Обман",
      effectSummary: "+1 Cor, +5 F, -5 P.",
      corruption: 1,
      characteristicModifiers: {
        fellowship: 5,
        perception: -5
      }
    }),

    3: aspiration({
      name: "Страх",
      effectSummary: "+5 P, -5 W.",
      characteristicModifiers: {
        perception: 5,
        willpower: -5
      }
    }),

    4: aspiration({
      name: "Разрушение",
      effectSummary: "+1 Inf, +5 S, -5 F.",
      infamy: 1,
      characteristicModifiers: {
        strength: 5,
        fellowship: -5
      }
    }),

    5: aspiration({
      name: "Расточительность",
      effectSummary: "+2 Раны, -5 A.",
      wounds: 2,
      characteristicModifiers: {
        agility: -5
      }
    }),

    6: aspiration({
      name: "Жадность",
      effectSummary:
        "+5 T, -10 на тесты Commerce.",
      characteristicModifiers: {
        toughness: 5
      },
      skillModifiers: [
        {
          skill: "Commerce",
          modifier: -10
        }
      ]
    }),

    7: aspiration({
      name: "Спесь",
      effectSummary: "+5 W, -5 I.",
      characteristicModifiers: {
        willpower: 5,
        intelligence: -5
      }
    }),

    8: aspiration({
      name: "Сожаление",
      effectSummary:
        "+5 A, -10 на тесты Intimidate.",
      characteristicModifiers: {
        agility: 5
      },
      skillModifiers: [
        {
          skill: "Intimidate",
          modifier: -10
        }
      ]
    }),

    9: aspiration({
      name: "Растраты",
      effectSummary:
        "+3 Раны, -1 Inf.b при расчёте стартового снаряжения.",
      wounds: 3,
      specialRules: [
        "-1 Inf.b при расчёте стартового снаряжения"
      ]
    }),

    10: aspiration({
      name: "Гнев",
      effectSummary:
        "+5 WS или BS, -2 W, -1 Рана.",
      wounds: -1,
      characteristicModifiers: {
        willpower: -2
      },
      choiceType: "oneCharacteristicPlus5",
      choiceOptions: [
        "weaponSkill",
        "ballisticSkill"
      ]
    })
  },

  motivation: {
    1: aspiration({
      name: "Таинства",
      effectSummary: "+4 Cor, +5 I, -4 S.",
      corruption: 4,
      characteristicModifiers: {
        intelligence: 5,
        strength: -4
      }
    }),

    2: aspiration({
      name: "Возвышение",
      effectSummary: "+1 Inf, +5 W, -2 Раны.",
      infamy: 1,
      wounds: -2,
      characteristicModifiers: {
        willpower: 5
      }
    }),

    3: aspiration({
      name: "Владычество",
      effectSummary:
        "+1 Inf, +2 W, +2 F, -4 A.",
      infamy: 1,
      characteristicModifiers: {
        willpower: 2,
        fellowship: 2,
        agility: -4
      }
    }),

    4: aspiration({
      name: "Бессмертие",
      effectSummary: "+2 Раны, +2 T, -5 WS.",
      wounds: 2,
      characteristicModifiers: {
        toughness: 2,
        weaponSkill: -5
      }
    }),

    5: aspiration({
      name: "Инновация",
      effectSummary:
        "+2 Cor, +4 I, +10 на тесты Исследований, -2 Раны.",
      corruption: 2,
      wounds: -2,
      characteristicModifiers: {
        intelligence: 4
      },
      skillModifiers: [
        {
          skill: "Research",
          modifier: 10
        }
      ]
    }),

    6: aspiration({
      name: "Наследие",
      effectSummary: "+2 Inf, +5 F, -5 I.",
      infamy: 2,
      characteristicModifiers: {
        fellowship: 5,
        intelligence: -5
      }
    }),

    7: aspiration({
      name: "Солипсизм",
      effectSummary: "+5 Cor, +3 W.",
      corruption: 5,
      characteristicModifiers: {
        willpower: 3
      }
    }),

    8: aspiration({
      name: "Совершенство",
      effectSummary:
        "+5 к одной Характеристике, -3 к двум другим.",
      choiceType: "perfection",
      choiceOptions: [
        "weaponSkill",
        "ballisticSkill",
        "strength",
        "toughness",
        "agility",
        "intelligence",
        "perception",
        "willpower",
        "fellowship"
      ]
    }),

    9: aspiration({
      name: "Месть",
      effectSummary: "+3 WS, +3 BS, -5 P.",
      characteristicModifiers: {
        weaponSkill: 3,
        ballisticSkill: 3,
        perception: -5
      }
    }),

    10: aspiration({
      name: "Насилие",
      effectSummary: "+5 Cor, +5 S, -3 I.",
      corruption: 5,
      characteristicModifiers: {
        strength: 5,
        intelligence: -3
      }
    })
  }
};

export const ASPIRATION_CATEGORIES = [
  "pride",
  "disgrace",
  "motivation"
];

export const ASPIRATION_CATEGORY_NAMES = {
  pride: "Гордость",
  disgrace: "Позор",
  motivation: "Мотивация"
};

export function getAspiration(
  category,
  roll
) {
  return ASPIRATION_TABLES?.[category]?.[roll] ?? null;
}

export function createAspirationItemData(
  category,
  roll,
  generated = false
) {
  const definition =
    getAspiration(category, roll);

  if (!definition) {
    throw new Error(
      `DoomBC | Не найдено Стремление: ${category} ${roll}`
    );
  }

  return {
    name: definition.name,
    type: "aspiration",

    system: {
      category,
      roll,
      generated,
      confirmed: false,

      effectSummary:
        definition.effectSummary ?? "",

      characteristicModifiers: {
        ...EMPTY_MODIFIERS,
        ...(definition.characteristicModifiers ?? {})
      },

      infamy:
        Number(definition.infamy ?? 0),

      corruption:
        Number(definition.corruption ?? 0),

      wounds:
        Number(definition.wounds ?? 0),

      skillModifiers:
        definition.skillModifiers ?? [],

      specialRules:
        definition.specialRules ?? [],

      choiceType:
        definition.choiceType ?? "",

      choiceOptions:
        definition.choiceOptions ?? [],

      choiceSelections: []
    }
  };
}
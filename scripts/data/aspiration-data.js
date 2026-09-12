const {
  ArrayField,
  BooleanField,
  NumberField,
  SchemaField,
  StringField
} = foundry.data.fields;

function modifierField() {
  return new NumberField({
    required: true,
    nullable: false,
    integer: true,
    initial: 0
  });
}

function skillModifierField() {
  return new SchemaField({
    skill: new StringField({
      required: true,
      nullable: false,
      initial: ""
    }),

    modifier: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0
    })
  });
}

export class DoomBCAspirationData
  extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    return {
      category: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      roll: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 1,
        max: 10,
        initial: 1
      }),

      generated: new BooleanField({
        required: true,
        nullable: false,
        initial: false
      }),

      confirmed: new BooleanField({
        required: true,
        nullable: false,
        initial: false
      }),

      effectSummary: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      characteristicModifiers: new SchemaField({
        weaponSkill: modifierField(),
        ballisticSkill: modifierField(),
        strength: modifierField(),
        toughness: modifierField(),
        agility: modifierField(),
        intelligence: modifierField(),
        perception: modifierField(),
        willpower: modifierField(),
        fellowship: modifierField()
      }),

      infamy: modifierField(),
      corruption: modifierField(),
      wounds: modifierField(),

      skillModifiers: new ArrayField(
        skillModifierField(),
        {
          required: true,
          nullable: false,
          initial: []
        }
      ),

      specialRules: new ArrayField(
        new StringField({
          required: true,
          nullable: false
        }),
        {
          required: true,
          nullable: false,
          initial: []
        }
      ),

      choiceType: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      choiceOptions: new ArrayField(
        new StringField({
          required: true,
          nullable: false
        }),
        {
          required: true,
          nullable: false,
          initial: []
        }
      ),

      choiceSelections: new ArrayField(
        new StringField({
          required: true,
          nullable: false
        }),
        {
          required: true,
          nullable: false,
          initial: []
        }
      )
    };
  }
}
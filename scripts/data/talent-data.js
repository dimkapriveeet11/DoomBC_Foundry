const {
  ArrayField,
  BooleanField,
  NumberField,
  SchemaField,
  StringField
} = foundry.data.fields;

function simpleRequirementField() {
  return new SchemaField({
    type: new StringField({
      required: true,
      nullable: false,
      initial: ""
    }),

    key: new StringField({
      required: true,
      nullable: false,
      initial: ""
    }),

    value: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0
    }),

    specialization: new StringField({
      required: true,
      nullable: false,
      initial: ""
    })
  });
}

function requirementField() {
  return new SchemaField({
    type: new StringField({
      required: true,
      nullable: false,
      initial: ""
    }),

    key: new StringField({
      required: true,
      nullable: false,
      initial: ""
    }),

    value: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0
    }),

    specialization: new StringField({
      required: true,
      nullable: false,
      initial: ""
    }),

    anyOf: new ArrayField(
      simpleRequirementField(),
      {
        required: true,
        nullable: false,
        initial: []
      }
    )
  });
}

export class DoomBCTalentData
  extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    return {
      key: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      tier: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        // 0 denotes a special talent without a standard Tier (Core p. 67).
        min: 0,
        max: 3,
        initial: 1
      }),

      patronage: new StringField({
        required: true,
        nullable: false,
        initial: "undivided"
      }),

      prerequisites: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      requirements: new ArrayField(
        requirementField(),
        {
          required: true,
          nullable: false,
          initial: []
        }
      ),

      specialization: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      specializations: new ArrayField(
        new StringField({
          required: true,
          nullable: false,
          initial: ""
        }),
        {
          required: true,
          nullable: false,
          initial: []
        }
      ),

      repeatable: new BooleanField({
        required: true,
        nullable: false,
        initial: false
      }),

      description: new StringField({
        required: true,
        nullable: false,
        initial: ""
      })
    };
  }
}
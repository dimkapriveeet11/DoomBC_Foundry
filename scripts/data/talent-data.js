const {
  ArrayField,
  BooleanField,
  NumberField,
  SchemaField,
  StringField
} = foundry.data.fields;

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
    })
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
        min: 1,
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
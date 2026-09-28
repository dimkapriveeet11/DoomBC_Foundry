const {
  BooleanField,
  NumberField,
  StringField
} = foundry.data.fields;

export class DoomBCSkillData
  extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    return {
      key: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      characteristic: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      patronage: new StringField({
        required: true,
        nullable: false,
        initial: "undivided"
      }),

      specialization: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      group: new BooleanField({
        required: true,
        nullable: false,
        initial: false
      }),

      canUseUntrained: new BooleanField({
        required: true,
        nullable: false,
        initial: true
      }),

      advance: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 0,
        max: 30,
        initial: 0
      })
    };
  }
}
const {
  NumberField,
  StringField
} = foundry.data.fields;

export class DoomBCSubraceData
  extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    return {
      parentRace: new StringField({
        required: true,
        nullable: false,
        initial: ""
      }),

      xpCost: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 0,
        initial: 0
      }),

      corruption: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 0
      })
    };
  }
}
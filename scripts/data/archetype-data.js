const {
  ArrayField,
  NumberField,
  SchemaField,
  StringField
} = foundry.data.fields;

function characteristicBonusField() {
  return new NumberField({
    required: true,
    nullable: false,
    integer: true,
    initial: 0
  });
}

export class DoomBCArchetypeData
  extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    return {
      allowedRaces: new ArrayField(
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

      characteristicBonuses: new SchemaField({
        weaponSkill: characteristicBonusField(),
        ballisticSkill: characteristicBonusField(),
        strength: characteristicBonusField(),
        toughness: characteristicBonusField(),
        agility: characteristicBonusField(),
        intelligence: characteristicBonusField(),
        perception: characteristicBonusField(),
        willpower: characteristicBonusField(),
        fellowship: characteristicBonusField()
      }),

      woundsFormula: new StringField({
        required: true,
        nullable: false,
        initial: ""
      })
    };
  }
}
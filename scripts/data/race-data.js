const {
  NumberField,
  SchemaField
} = foundry.data.fields;

function startingCharacteristic(initial = 0) {
  return new NumberField({
    required: true,
    nullable: false,
    integer: true,
    min: 0,
    initial
  });
}

export class DoomBCRaceData
  extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    return {
      characteristics: new SchemaField({
        weaponSkill: startingCharacteristic(),
        ballisticSkill: startingCharacteristic(),
        strength: startingCharacteristic(),
        toughness: startingCharacteristic(),
        agility: startingCharacteristic(),
        intelligence: startingCharacteristic(),
        perception: startingCharacteristic(),
        willpower: startingCharacteristic(),
        fellowship: startingCharacteristic()
      }),

      corruption: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 0,
        initial: 0
      }),

      infamy: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 0,
        initial: 0
      }),

      bonusRolls: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 0,
        initial: 0
      }),

      bonusPoints: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 0,
        initial: 0
      }),

      characteristicShifts: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 0,
        initial: 0
      })
    };
  }
}
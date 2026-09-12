const {
  ArrayField,
  BooleanField,
  NumberField,
  SchemaField,
  StringField
} = foundry.data.fields;

function characteristicField() {
  return new SchemaField({
    base: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      min: 0,
      initial: 0
    }),

    creation: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      min: 0,
      initial: 0
    }),

    shift: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0
    }),

    advances: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      min: 0,
      max: 25,
      initial: 0
    }),

    modifier: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0
    })
  });
}

function assignmentField() {
  return new NumberField({
    required: true,
    nullable: false,
    integer: true,
    min: -1,
    max: 8,
    initial: -1
  });
}

function pointBuyValueField() {
  return new NumberField({
    required: true,
    nullable: false,
    integer: true,
    min: 2,
    max: 20,
    initial: 2
  });
}

function shiftPairField() {
  return new SchemaField({
    increase: new StringField({
      required: true,
      nullable: false,
      initial: ""
    }),

    decrease: new StringField({
      required: true,
      nullable: false,
      initial: ""
    })
  });
}

export class DoomBCCharacterData
  extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    return {
      characteristics: new SchemaField({
        weaponSkill: characteristicField(),
        ballisticSkill: characteristicField(),
        strength: characteristicField(),
        toughness: characteristicField(),
        agility: characteristicField(),
        intelligence: characteristicField(),
        perception: characteristicField(),
        willpower: characteristicField(),
        fellowship: characteristicField()
      }),

      infamy: new SchemaField({
        value: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 0
        }),

        points: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 0
        })
      }),

      corruption: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 0,
        initial: 0
      }),

      wounds: new SchemaField({
        value: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0
        }),

        max: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 0
        })
      }),

      experience: new SchemaField({
        total: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 0
        }),

        spent: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 0
        })
      }),

      creation: new SchemaField({
        active: new BooleanField({
          required: true,
          nullable: false,
          initial: true
        }),

        step: new StringField({
          required: true,
          nullable: false,
          initial: "race"
        }),

        method: new StringField({
          required: true,
          nullable: false,
          initial: ""
        }),

        generation: new SchemaField({
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

          setA: new ArrayField(
            new NumberField({
              required: true,
              nullable: false,
              integer: true,
              min: 2,
              max: 20
            }),
            {
              required: true,
              nullable: false,
              initial: []
            }
          ),

          setB: new ArrayField(
            new NumberField({
              required: true,
              nullable: false,
              integer: true,
              min: 2,
              max: 20
            }),
            {
              required: true,
              nullable: false,
              initial: []
            }
          ),

          selectedSet: new StringField({
            required: true,
            nullable: false,
            initial: ""
          }),

          selectedValues: new ArrayField(
            new NumberField({
              required: true,
              nullable: false,
              integer: true,
              min: 2,
              max: 20
            }),
            {
              required: true,
              nullable: false,
              initial: []
            }
          ),

          assignments: new SchemaField({
            weaponSkill: assignmentField(),
            ballisticSkill: assignmentField(),
            strength: assignmentField(),
            toughness: assignmentField(),
            agility: assignmentField(),
            intelligence: assignmentField(),
            perception: assignmentField(),
            willpower: assignmentField(),
            fellowship: assignmentField()
          })
        }),

        pointBuy: new SchemaField({
          budget: new NumberField({
            required: true,
            nullable: false,
            integer: true,
            min: 0,
            initial: 0
          }),

          spent: new NumberField({
            required: true,
            nullable: false,
            integer: true,
            min: 0,
            initial: 0
          }),

          confirmed: new BooleanField({
            required: true,
            nullable: false,
            initial: false
          }),

          allocations: new SchemaField({
            weaponSkill: pointBuyValueField(),
            ballisticSkill: pointBuyValueField(),
            strength: pointBuyValueField(),
            toughness: pointBuyValueField(),
            agility: pointBuyValueField(),
            intelligence: pointBuyValueField(),
            perception: pointBuyValueField(),
            willpower: pointBuyValueField(),
            fellowship: pointBuyValueField()
          })
        }),

        shifts: new SchemaField({
          available: new NumberField({
            required: true,
            nullable: false,
            integer: true,
            min: 0,
            initial: 0
          }),

          used: new NumberField({
            required: true,
            nullable: false,
            integer: true,
            min: 0,
            initial: 0
          }),

          pairs: new ArrayField(
            shiftPairField(),
            {
              required: true,
              nullable: false,
              initial: []
            }
          )
        }),

        completed: new SchemaField({
          race: new BooleanField({
            required: true,
            nullable: false,
            initial: false
          }),

          characteristics: new BooleanField({
            required: true,
            nullable: false,
            initial: false
          }),

          subrace: new BooleanField({
            required: true,
            nullable: false,
            initial: false
          }),

          archetype: new BooleanField({
            required: true,
            nullable: false,
            initial: false
          }),

          aspiration: new BooleanField({
            required: true,
            nullable: false,
            initial: false
          }),

          abilities: new BooleanField({
            required: true,
            nullable: false,
            initial: false
          }),

          equipment: new BooleanField({
            required: true,
            nullable: false,
            initial: false
          })
        })
      })
    };
  }
}
import {
  getTalentDefinition
} from "../data/talent-catalog.js";

const CHARACTERISTIC_NAMES = {
  weaponSkill: "WS",
  ballisticSkill: "BS",
  strength: "S",
  toughness: "T",
  agility: "A",
  intelligence: "I",
  perception: "P",
  willpower: "W",
  fellowship: "F"
};

function validateActor(actor) {
  if (!actor || actor.documentName !== "Actor") {
    throw new Error(
      "DoomBC | checkTalentPrerequisites: Actor не найден."
    );
  }

  if (actor.type !== "character") {
    throw new Error(
      `DoomBC | Actor "${actor.name}" не является character.`
    );
  }
}

function getCharacteristicValue(
  actor,
  key
) {
  const characteristic =
    actor.system.characteristics?.[key];

  if (!characteristic) {
    return null;
  }

  return (
    Number(characteristic.base ?? 0) +
    Number(characteristic.creation ?? 0) +
    Number(characteristic.shift ?? 0) +
    Number(characteristic.advances ?? 0) +
    Number(characteristic.modifier ?? 0)
  );
}

function findSkill(
  actor,
  key,
  specialization = ""
) {
  const wanted =
    String(specialization ?? "")
      .trim()
      .toLowerCase();

  return actor.items.find(item => {
    if (item.type !== "skill") {
      return false;
    }

    if (
      String(item.system.key ?? "") !==
      key
    ) {
      return false;
    }

    const current =
      String(
        item.system.specialization ?? ""
      )
        .trim()
        .toLowerCase();

    return current === wanted;
  }) ?? null;
}

function findTalent(
  actor,
  key,
  specialization = ""
) {
  const wanted =
    String(specialization ?? "")
      .trim()
      .toLowerCase();

  return actor.items.find(item => {
    if (item.type !== "talent") {
      return false;
    }

    if (
      String(item.system.key ?? "") !==
      key
    ) {
      return false;
    }

    const current =
      String(
        item.system.specialization ?? ""
      )
        .trim()
        .toLowerCase();

    return current === wanted;
  }) ?? null;
}

function checkCharacteristicRequirement(
  actor,
  requirement
) {
  const current =
    getCharacteristicValue(
      actor,
      requirement.key
    );

  const required =
    Number(requirement.value ?? 0);

  const name =
    CHARACTERISTIC_NAMES[
      requirement.key
    ] ?? requirement.key;

  return {
    type: "characteristic",
    key: requirement.key,
    required,
    current,

    met:
      current !== null &&
      current >= required,

    label:
      `${name} ${required}`
  };
}

// Only explicit character values are allowed; Infamy points are not Infamy.
function checkResourceRequirement(actor, requirement) {
  const resources = {
    infamy: { label: "Inf", value: actor.system.infamy?.value },
    corruption: { label: "Cor", value: actor.system.corruption }
  };
  const resource = Object.hasOwn(resources, requirement.key)
    ? resources[requirement.key]
    : null;
  const raw = resource?.value;
  const current = typeof raw === "number" && Number.isFinite(raw)
    ? raw
    : null;
  const required = requirement.value;

  return {
    type: "resource",
    key: requirement.key,
    required,
    current,
    met: current !== null && Number.isFinite(required) && current >= required,
    label: `${resource?.label ?? requirement.key} ${required}`
  };
}

function checkSkillRequirement(
  actor,
  requirement
) {
  const skill =
    findSkill(
      actor,
      requirement.key,
      requirement.specialization
    );

  const required =
    Number(requirement.value ?? 0);

  const current =
    skill
      ? Number(
          skill.system.advance ?? 0
        )
      : null;

  const specialization =
    String(
      requirement.specialization ?? ""
    ).trim();

  const label =
    specialization
      ? `${requirement.key} (${specialization}) +${required}`
      : `${requirement.key} +${required}`;

  return {
    type: "skill",
    key: requirement.key,
    specialization,
    required,
    current,

    met:
      skill !== null &&
      current >= required,

    label
  };
}

function checkTalentRequirement(
  actor,
  requirement
) {
  const specialization =
    String(
      requirement.specialization ?? ""
    ).trim();

  const talent =
    findTalent(
      actor,
      requirement.key,
      specialization
    );

  const definition =
    getTalentDefinition(
      requirement.key
    );

  const baseName =
    definition?.name ??
    requirement.key;

  const label =
    specialization
      ? `${baseName} (${specialization})`
      : baseName;

  return {
    type: "talent",
    key: requirement.key,
    specialization,
    required: true,
    current: Boolean(talent),
    met: Boolean(talent),
    label
  };
}

function checkAnyOfRequirement(
  actor,
  requirement
) {
  const options =
    Array.from(
      requirement.anyOf ?? []
    ).map(
      option =>
        checkRequirement(
          actor,
          option
        )
    );

  return {
    type: "anyOf",
    key: "",
    required: true,
    current:
      options.some(
        option => option.met
      ),

    met:
      options.some(
        option => option.met
      ),

    options,

    label:
      options
        .map(
          option => option.label
        )
        .join(" ИЛИ ")
  };
}

function checkRequirement(
  actor,
  requirement
) {
  switch (requirement.type) {
    case "resource":
      return checkResourceRequirement(actor, requirement);

    case "characteristic":
      return checkCharacteristicRequirement(
        actor,
        requirement
      );

    case "skill":
      return checkSkillRequirement(
        actor,
        requirement
      );

    case "talent":
      return checkTalentRequirement(
        actor,
        requirement
      );

    case "anyOf":
      return checkAnyOfRequirement(
        actor,
        requirement
      );

    default:
      return {
        type:
          String(
            requirement.type ?? ""
          ),

        key:
          String(
            requirement.key ?? ""
          ),

        required:
          requirement.value ?? null,

        current: null,
        met: false,

        label:
          `Неподдерживаемое требование: ${requirement.type}`
      };
  }
}

export function checkTalentPrerequisites(
  actor,
  talentKey
) {
  validateActor(actor);

  const definition =
    getTalentDefinition(talentKey);

  if (!definition) {
    throw new Error(
      `DoomBC | Неизвестный Талант: ${talentKey}`
    );
  }

  const results =
    Array.from(
      definition.requirements ?? []
    ).map(
      requirement =>
        checkRequirement(
          actor,
          requirement
        )
    );

  const missing =
    results.filter(
      result => !result.met
    );

  return {
    talentKey:
      definition.key,

    talentName:
      definition.name,

    met:
      missing.length === 0,

    requirements:
      results,

    missing
  };
}

export function assertTalentPrerequisites(
  actor,
  talentKey
) {
  const result =
    checkTalentPrerequisites(
      actor,
      talentKey
    );

  if (result.met) {
    return result;
  }

  const missingText =
    result.missing
      .map(
        requirement =>
          requirement.label
      )
      .join(", ");

  throw new Error(
    `DoomBC | Не выполнены требования Таланта "${result.talentName}": ${missingText}.`
  );
}
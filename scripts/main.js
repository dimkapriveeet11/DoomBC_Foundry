import { applyRace } from "./character/apply-race.js";
import { setCharacteristicMethod } from "./character/set-characteristic-method.js";
import { generateCharacteristics } from "./character/generate-characteristics.js";
import { selectGenerationSet } from "./character/select-generation-set.js";
import { assignGenerationResult } from "./character/assign-generation-result.js";
import { confirmGenerationAssignments } from "./character/confirm-generation-assignments.js";
import { applyCharacteristicShift } from "./character/apply-characteristic-shift.js";
import { setPointBuyValue } from "./character/set-point-buy-value.js";
import { confirmPointBuy } from "./character/confirm-point-buy.js";
import { setStartingExperience } from "./character/set-starting-experience.js";
import { applySubrace } from "./character/apply-subrace.js";
import { skipSubrace } from "./character/skip-subrace.js";
import { applyArchetype } from "./character/apply-archetype.js";

import { generateAspirations } from "./character/generate-aspirations.js";
import { selectAspiration } from "./character/select-aspiration.js";
import { setAspirationChoice } from "./character/set-aspiration-choice.js";
import { confirmAspirations } from "./character/confirm-aspirations.js";

import { DoomBCRaceData } from "./data/race-data.js";
import { DoomBCSubraceData } from "./data/subrace-data.js";
import { DoomBCArchetypeData } from "./data/archetype-data.js";
import { DoomBCAspirationData } from "./data/aspiration-data.js";
import { DoomBCCharacterData } from "./data/character-data.js";

import { logger } from "./core/logger.js";
import { DOOMBC } from "./core/config.js";
import { registerSettings } from "./core/settings.js";
import { runMigrations } from "./core/migrations.js";

Hooks.once("init", () => {
  registerSettings();

  // Actor Data Models
  CONFIG.Actor.dataModels.character =
    DoomBCCharacterData;

  // Item Data Models
  CONFIG.Item.dataModels.race =
    DoomBCRaceData;

  CONFIG.Item.dataModels.subrace =
    DoomBCSubraceData;

  CONFIG.Item.dataModels.archetype =
    DoomBCArchetypeData;

  CONFIG.Item.dataModels.aspiration =
    DoomBCAspirationData;

  // DoomBC public API
  game.doombc = {
    config: DOOMBC,
    logger,

    character: {
      applyRace,

      setCharacteristicMethod,
      generateCharacteristics,
      selectGenerationSet,
      assignGenerationResult,
      confirmGenerationAssignments,

      setPointBuyValue,
      confirmPointBuy,

      applyCharacteristicShift,

      setStartingExperience,

      applySubrace,
      skipSubrace,

      applyArchetype,

      generateAspirations,
      selectAspiration,
      setAspirationChoice,
      confirmAspirations
    }
  };

  logger.info("init");
  logger.debug("Debug logger loaded.");
  logger.info("Config loaded:", DOOMBC);

  logger.debug(
    "Character Data Model registered."
  );

  logger.debug(
    "Race Data Model registered."
  );

  logger.debug(
    "Subrace Data Model registered."
  );

  logger.debug(
    "Archetype Data Model registered."
  );

  logger.debug(
    "Aspiration Data Model registered."
  );
});

Hooks.once("ready", async () => {
  logger.info("ready");

  await runMigrations();
});
import { logger } from "./core/logger.js";
import { DOOMBC } from "./core/config.js";
import { registerSettings } from "./core/settings.js";
import { runMigrations } from "./core/migrations.js";

Hooks.once("init", () => {
  registerSettings();

  game.doombc = {
    config: DOOMBC,
    logger
  };

  logger.info("init");
  logger.debug("Debug logger loaded.");
  logger.info("Config loaded:", DOOMBC);
});

Hooks.once("ready", async () => {
  logger.info("ready");

  await runMigrations();
});
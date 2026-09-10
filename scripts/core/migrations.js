import { logger } from "./logger.js";

export const CURRENT_SCHEMA_VERSION = 1;

export async function runMigrations() {
  const currentVersion =
    game.settings.get("doombc", "schemaVersion");

  logger.debug(
    `Schema version: ${currentVersion} → ${CURRENT_SCHEMA_VERSION}`
  );

  if (currentVersion >= CURRENT_SCHEMA_VERSION) {
    logger.debug("No migrations required.");
    return;
  }

  logger.info(
    `Migrating world data: ${currentVersion} → ${CURRENT_SCHEMA_VERSION}`
  );

  await game.settings.set(
    "doombc",
    "schemaVersion",
    CURRENT_SCHEMA_VERSION
  );

  logger.info(
    `Migration complete. Schema version: ${CURRENT_SCHEMA_VERSION}`
  );
}
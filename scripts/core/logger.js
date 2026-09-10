const PREFIX = "DoomBC";

function isDebugEnabled() {
  try {
    return game.settings.get("doombc", "debugMode");
  } catch {
    return false;
  }
}

export const logger = {
  info(...args) {
    console.log(`${PREFIX} | INFO |`, ...args);
  },

  debug(...args) {
    if (!isDebugEnabled()) return;

    console.debug(
      `${PREFIX} | DEBUG |`,
      ...args
    );
  },

  warn(...args) {
    console.warn(
      `${PREFIX} | WARN |`,
      ...args
    );
  },

  error(...args) {
    console.error(
      `${PREFIX} | ERROR |`,
      ...args
    );
  }
};
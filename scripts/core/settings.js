export function registerSettings() {
  game.settings.register("doombc", "debugMode", {
    name: "Debug Mode",
    hint: "Показывать подробные отладочные сообщения DoomBC в консоли.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("doombc", "schemaVersion", {
    name: "DoomBC Schema Version",
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });
}
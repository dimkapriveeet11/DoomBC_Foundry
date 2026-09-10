const SYSTEM_ID = "doombc";

Hooks.once("init", () => {
  game.doombc = {
    id: SYSTEM_ID,
    version: game.system?.version ?? "0.1.0"
  };

  console.log("DoomBC | init");
});

Hooks.once("ready", () => {
  console.log("DoomBC | ready");
});

const TALENT = {
  id: "xyx0zeRdS2xHwyNk",
  name: "Air of Authority"
};

export function registerAirOfAuthority(api) {
  api.talents.airOfAuthority = {
    id: TALENT.id,
    name: TALENT.name,

    get(actor) {
      const active = api.hasTalent(actor, TALENT);
      const fellowshipBonus = api.characteristicBonus(actor, "fellowship");

      return {
        active,
        fellowshipBonus,
        commandTargets: active ? fellowshipBonus * 10 : null,
        minionLoyaltyBonus: active ? 10 : 0,
        affectsHostileTargets: false,
        affectsOnlyNPCs: true
      };
    }
  };
}

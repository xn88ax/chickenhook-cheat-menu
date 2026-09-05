export const shoutNicks = [
  "Kurczak_200iq",
  "n00b_killer",
  "SkrzydelkoPL",
  "hvh_grzegorz",
  "PanieszSmakuje",
  "GesslerFan1998",
  "tofu_hater",
  "bhop_bolek",
  "AimAssistent",
  "zabka_hotdog",
  "MagdaMaster",
  "crispy_one_tap",
];

export const shoutLines = [
  "aim dzisiaj smakuje",
  "invite pls",
  "config od proa ktos ma?",
  "gram 3 dni, 0 banow, panie to jest rewelacja",
  "kto na faceit? robimy 5 stack",
  "loader wstrzyknal sie w 4 sekundy XD",
  "ten skeleton esp to poezja",
  "wczoraj 41 fragow, dzis 42, progres",
  "czy tryb kurczaka juz dziala u kogos?",
  "premium warte kazdej zlotowki",
  "ktos testowal noclip na de_dust2?",
  "moj kolega dostal bana ale on gral bez chickenhooka",
  "admin odpisal mi w 12 sekund, rekord",
  "kupilem elite i placze ze szczescia",
  "znowu ktos leakuje configi na telegramie",
  "wchodze na premier, zyczcie mi 30 fragow",
  "smooth 18 to zloty standard, zapiszcie",
  "kfc na rogu ma promocje, idealny pre-game",
];

export type Fragger = {
  nick: string;
  hs: string;
  kd: string;
  elo: string;
  plan: string;
};

export const fraggers: Fragger[] = [
  { nick: "Kurczak_200iq", hs: "99,9%", kd: "41,2", elo: "12 345", plan: "Elite" },
  { nick: "crispy_one_tap", hs: "99,4%", kd: "38,7", elo: "11 980", plan: "Elite" },
  { nick: "SkrzydelkoPL", hs: "98,8%", kd: "33,1", elo: "10 402", plan: "Premium" },
  { nick: "hvh_grzegorz", hs: "97,2%", kd: "29,9", elo: "9 871", plan: "Elite" },
  { nick: "bhop_bolek", hs: "96,5%", kd: "24,4", elo: "8 655", plan: "Premium" },
  { nick: "GesslerFan1998", hs: "95,1%", kd: "21,8", elo: "8 210", plan: "Premium" },
  { nick: "AimAssistent", hs: "93,7%", kd: "19,3", elo: "7 640", plan: "Solo" },
  { nick: "zabka_hotdog", hs: "91,2%", kd: "17,0", elo: "7 001", plan: "Solo" },
];

export const banFeedLines = [
  "skeet.cc — 412 kont zbanowanych falą VAC",
  "onetap.su — 289 kont poszło w ciemność",
  "aimware.net — 176 kont, loader wykryty w 6 h",
  "neverlose.cc — 98 kont, koniec sezonu",
  "darmowy cheat z YouTube'a — 3 402 konta",
  "cheat od kolegi ze szkoły — 1 konto (kolega)",
  "gamesense.pub — 244 konta, zostały wspomnienia",
  "„niewykrywalny\" cheat z Allegro — 611 kont",
];

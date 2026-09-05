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

export type Opp = {
  nick: string;
  cheat: string;
  reason: string;
  date: string;
};

export const opps: Opp[] = [
  { nick: "skeet_fanboy_99", cheat: "skeet.cc", reason: "fala VAC, loader wykryty", date: "12.08.2026" },
  { nick: "onetap_oliwier", cheat: "onetap.su", reason: "glow esp widoczne na demku", date: "09.08.2026" },
  { nick: "aimware_andrzej", cheat: "aimware.net", reason: "spinbot na premier, 41 zgłoszeń", date: "02.08.2026" },
  { nick: "free_cheats_krzys", cheat: "cheat z YouTube'a", reason: "pobrał plik free_aim_2026.exe", date: "28.07.2026" },
  { nick: "neverlose_norbert", cheat: "neverlose.cc", reason: "koniec subskrypcji = koniec szczęścia", date: "21.07.2026" },
  { nick: "kolega_ze_szkoly", cheat: "cheat od kolegi", reason: "kolega też dostał bana", date: "14.07.2026" },
  { nick: "gs_weteran", cheat: "gamesense.pub", reason: "nostalgia nie chroni przed VAC", date: "05.07.2026" },
  { nick: "allegro_aimbot", cheat: "cheat z Allegro", reason: "sprzedawca miał 12% pozytywów", date: "29.06.2026" },
];

export const banFeedLines = [
  "skeet.cc — 412 kont zbanowanych falą VAC",
  "onetap.su — 289 kont poszło w ciemność",
  "aimware.net — 176 kont, loader wykryty w 6 h",
  "neverlose.cc — 98 kont, koniec sezonu",
  "darmowy cheat z YouTube'a — 3 402 konta",
  "cheat od kolegi ze szkoły — 1 konto (kolega)",
  "gamesense.pub — 244 konta, zostały wspomnienia",
  "„niewykrywalny” cheat z Allegro — 611 kont",
];

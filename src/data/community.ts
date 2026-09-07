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
  wave: string;
};

// Nicki sa wymyslone (parodia) - nie da sie legalnie wskazywac realnych osob.
// Daty i nazwy fal odpowiadaja chronologii sezonu 2025/2026 na naszej osi czasu.
export const opps: Opp[] = [
  { nick: "skeet_fanboy_99", cheat: "skeet.cc", reason: "fala VAC, loader wykryty po 6 h", date: "2026-08-12", wave: "Fala #17" },
  { nick: "onetap_oliwier", cheat: "onetap.su", reason: "glow ESP widoczne na demku", date: "2026-08-09", wave: "Fala #17" },
  { nick: "aimware_andrzej", cheat: "aimware.net", reason: "spinbot na Premier, 41 zgloszen", date: "2026-08-02", wave: "Fala #16" },
  { nick: "free_cheats_krzys", cheat: "cheat z YouTube'a", reason: "uruchomil free_aim_2026.exe", date: "2026-07-28", wave: "Fala #16" },
  { nick: "neverlose_norbert", cheat: "neverlose.cc", reason: "koniec subskrypcji = koniec szczescia", date: "2026-07-21", wave: "Fala #15" },
  { nick: "kolega_ze_szkoly", cheat: "cheat od kolegi", reason: "kolega tez dostal bana", date: "2026-07-14", wave: "Fala #15" },
  { nick: "gs_weteran", cheat: "gamesense.pub", reason: "nostalgia nie chroni przed VAC", date: "2026-07-05", wave: "Fala #14" },
  { nick: "allegro_aimbot", cheat: "cheat z Allegro", reason: "sprzedawca mial 12% pozytywow", date: "2026-06-29", wave: "Fala #14" },
  { nick: "primordial_pawel", cheat: "primordial.wtf", reason: "recoil control na streamie", date: "2026-06-18", wave: "Fala #13" },
  { nick: "fatality_filip", cheat: "fatality.win", reason: "resolver ustawil go na scianie", date: "2026-06-11", wave: "Fala #13" },
  { nick: "otc_ozzy", cheat: "otc.gg", reason: "trigger bot, 3 mecze z rzedu", date: "2026-05-30", wave: "Fala #12" },
  { nick: "pandora_patryk", cheat: "pandora.gg", reason: "backtrack 400 ms, overwatch jednoglosnie", date: "2026-05-22", wave: "Fala #12" },
  { nick: "nixware_nikodem", cheat: "nixware.cc", reason: "wallbang przez trzy sciany", date: "2026-05-14", wave: "Fala #11" },
  { nick: "gamesense_gustaw", cheat: "gamesense.vip", reason: "config od \u201eproa\u201d z Discorda", date: "2026-05-03", wave: "Fala #11" },
  { nick: "medal_maciek", cheat: "cheat z reklamy na TikToku", reason: "zamiast cheata dostal koparke", date: "2026-04-25", wave: "Fala #10" },
  { nick: "hvh_hubert", cheat: "leaked source z forum", reason: "kompilowal sam, zbanowal sie sam", date: "2026-04-17", wave: "Fala #10" },
];

export type BanWave = {
  date: string;
  cheat: string;
  accounts: number;
  note: string;
};

// Feed leci z tej samej osi czasu co lista oppsow - od najnowszej fali.
export const banWaves: BanWave[] = [
  { date: "2026-08-12", cheat: "skeet.cc", accounts: 412, note: "loader wykryty w 6 h" },
  { date: "2026-08-09", cheat: "onetap.su", accounts: 289, note: "sygnatura ESP w pamieci" },
  { date: "2026-08-02", cheat: "aimware.net", accounts: 176, note: "spinbot na Premier" },
  { date: "2026-07-28", cheat: "darmowy cheat z YouTube'a", accounts: 3402, note: "jeden plik, tysiace lez" },
  { date: "2026-07-21", cheat: "neverlose.cc", accounts: 98, note: "koniec sezonu, koniec kont" },
  { date: "2026-07-14", cheat: "cheat od kolegi ze szkoly", accounts: 1, note: "kolega tez juz nie gra" },
  { date: "2026-07-05", cheat: "gamesense.pub", accounts: 244, note: "zostaly tylko wspomnienia" },
  { date: "2026-06-29", cheat: "cheat z Allegro", accounts: 611, note: "sprzedawca zniknal razem z kontami" },
  { date: "2026-06-18", cheat: "primordial.wtf", accounts: 133, note: "recoil control na streamie" },
  { date: "2026-06-11", cheat: "fatality.win", accounts: 207, note: "resolver przestal resolvowac" },
  { date: "2026-05-30", cheat: "otc.gg", accounts: 89, note: "trigger bot, trzy mecze" },
  { date: "2026-05-22", cheat: "pandora.gg", accounts: 154, note: "backtrack 400 ms" },
  { date: "2026-05-14", cheat: "nixware.cc", accounts: 121, note: "wallbang przez trzy sciany" },
  { date: "2026-05-03", cheat: "gamesense.vip", accounts: 318, note: "config z Discorda zrobil swoje" },
  { date: "2026-04-25", cheat: "cheat z TikToka", accounts: 2740, note: "koparka w zestawie" },
  { date: "2026-04-17", cheat: "leaked source z forum", accounts: 66, note: "self-ban speedrun" },
];

export const plDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
};

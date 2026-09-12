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
  reason: string;
  bannedBy: string;
  date: string;
  duration: string;
};

// Nicki sa wymyslone (parodia) - nie da sie legalnie wskazywac realnych osob.
// To rejestr banow forumowych chickenhook.wtf, od najnowszego.
export const opps: Opp[] = [
  { nick: "leaker_lucjan", reason: "leakowanie loadera na zagraniczne forum", bannedBy: "adam chicken", date: "2026-08-12", duration: "na zawsze" },
  { nick: "kod_sprzedawca", reason: "sprzedawanie kodow zaproszen na Allegro", bannedBy: "adam chicken", date: "2026-08-09", duration: "na zawsze" },
  { nick: "scam_stefan", reason: "scamowanie czlonkow na \"darmowy config\"", bannedBy: "moderacja", date: "2026-08-02", duration: "na zawsze" },
  { nick: "tajny_wspolpracownik", reason: "screeny z dzialu VIP wyslane konkurencji", bannedBy: "adam chicken", date: "2026-07-28", duration: "na zawsze" },
  { nick: "ddos_daniel", reason: "grozby DDoS w strone serwera (doslownie wyslal namicie)", bannedBy: "adam chicken", date: "2026-07-21", duration: "na zawsze" },
  { nick: "crack_karol", reason: "proba cracka loadera i chwalenie sie tym w shoutboxie", bannedBy: "moderacja", date: "2026-07-14", duration: "na zawsze" },
  { nick: "multikonto_michal", reason: "12 multikont po poprzednim banie", bannedBy: "moderacja", date: "2026-07-05", duration: "na zawsze" },
  { nick: "pytajacz_piotr", reason: "spam \"kiedy update\" x340 po 6 h od update'u", bannedBy: "moderacja", date: "2026-06-29", duration: "30 dni" },
  { nick: "ratunkowy_radek", reason: "wrzucil fake loader z ratem na pastebina", bannedBy: "adam chicken", date: "2026-06-18", duration: "na zawsze" },
  { nick: "sympatyk_skeeta", reason: "reklama konkurencji w dziale ogolnym, 4. wysoki ton", bannedBy: "moderacja", date: "2026-06-11", duration: "14 dni" },
  { nick: "wiek_wiktor", reason: "wyznal w ankiecie, ze ma 11 lat", bannedBy: "moderacja", date: "2026-05-30", duration: "do 18. urodzin" },
  { nick: "bot_bartek", reason: "auto-odpowiadanie skryptem we wszystkich watkach", bannedBy: "moderacja", date: "2026-05-22", duration: "na zawsze" },
  { nick: "klotnia_klaudia", reason: "flamewar w 9 watkach jednoczesnie, w tym o kebab", bannedBy: "moderacja", date: "2026-05-14", duration: "7 dni" },
  { nick: "refund_robert", reason: "chargeback po 8 miesiacach grania", bannedBy: "adam chicken", date: "2026-05-03", duration: "na zawsze" },
  { nick: "nudes_norbert", reason: "NSFW w dziale \"Problemy techniczne\"", bannedBy: "moderacja", date: "2026-04-25", duration: "na zawsze" },
  { nick: "ratunek_roman", reason: "napisal \"pomozcie, VAC mnie nie wykrylo, sam sie zglaszam\"", bannedBy: "adam chicken", date: "2026-04-17", duration: "na zyczenie" },
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

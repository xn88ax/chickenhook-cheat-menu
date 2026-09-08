export type Build = {
  version: string;
  date: string;
  tag: "Aktualny" | "Stabilny" | "Archiwalny";
  notes: string[];
};

export const builds: Build[] = [
  {
    version: "4.chkn",
    date: "8 września 2026",
    tag: "Aktualny",
    notes: [
      "Każda funkcja w menu ma teraz własne opcje po polsku: aimbot (FOV, smooth, kość, RCS), ESP (ramka, szkielet, radar), bhop i exploity.",
      "Poprawki stabilności: aimbot już nie strzela w kurczaki, a loader nie otwiera menu po arabsku.",
    ],
  },
  {
    version: "4.12.0",
    date: "2 września 2026",
    tag: "Stabilny",
    notes: [
      "Naprawiono bug, że aimbot strzelał w kurczaki zamiast w CT.",
      "Skeleton ESP nie rysuje już szkieletu Twojego własnego kolegi z drużyny (przepraszamy, Bolek).",
      "Dodano suwak „chrupkość” — nie robi nic, ale ładnie wygląda.",
      "Loader wstrzykuje się 0,4 s szybciej, bo usunęliśmy jeden console.log.",
    ],
  },
  {
    version: "4.11.3",
    date: "24 sierpnia 2026",
    tag: "Stabilny",
    notes: [
      "Triggerbot przestał strzelać do własnego cienia na de_mirage.",
      "Króliczy skok nie wyrzuca już gracza w kosmos przy 300 FPS.",
      "Zmieniacz skórek: dodano nóż z motywem panierki.",
      "Poprawiono literówkę w słowie „undetected” (było „undetectd”).",
    ],
  },
  {
    version: "4.11.0",
    date: "9 sierpnia 2026",
    tag: "Stabilny",
    notes: [
      "Nowy moduł: Awaria serwera (tylko Elite, tylko własne serwery, tylko na własną odpowiedzialność).",
      "Radar 2D pokazuje teraz odległość do najbliższego KFC.",
      "Bypass przepisany po patchu Valve — zajęło 6 h i dwa kubełki.",
    ],
  },
  {
    version: "4.10.2",
    date: "27 lipca 2026",
    tag: "Archiwalny",
    notes: [
      "Naprawiono awarię, przy której menu otwierało się w języku, którego nikt nie rozpoznał.",
      "Speedhack ograniczony do 5x, bo ktoś przebił mapę.",
      "Usunięto przycisk „Zbanuj mnie” dodany omyłkowo w 4.10.1.",
    ],
  },
  {
    version: "4.10.0",
    date: "12 lipca 2026",
    tag: "Archiwalny",
    notes: [
      "Pierwszy build z menu w nowym stylu.",
    ],
  },
  {
    version: "4.9.1",
    date: "28 czerwca 2026",
    tag: "Archiwalny",
    notes: [
      "Anti-aim nie odwraca już głowy o 180° podczas jedzenia kanapki.",
      "Hitboxy przeciwnika są teraz rysowane na właściwej warstwie — pod spodem.",
      "Dodano eksperymentalny tryb „stary dziadek” (wszystko działa wolniej, ale nostalgiowo).",
    ],
  },
  {
    version: "4.9.0",
    date: "15 czerwca 2026",
    tag: "Archiwalny",
    notes: [
      "Nowy moduł: Auto-strażak gasi smoke'y (tylko wizualnie, nadal umierasz).",
      "ESP pokazuje teraz pseudonimy w czcionce Comic Sans dla dyskrecji.",
      "Loader ma nowy dźwięk startowy — ktoś powiedział „ku-ku-ry-ku” w mikrofon.",
    ],
  },
  {
    version: "4.8.2",
    date: "30 maja 2026",
    tag: "Archiwalny",
    notes: [
      "Naprawiono crash przy włączeniu chamsów na Intel HD Graphics z 2012.",
      "Aimbot FOV zmniejszony domyślnie, bo tester przypadkiem trafił gracza na innej mapie.",
      "Dodano opcję „ukryj przed mamą” — zwija menu do ikony kurczaka w trayu.",
    ],
  },
  {
    version: "4.8.0",
    date: "18 maja 2026",
    tag: "Archiwalny",
    notes: [
      "Pierwsza wersja z własnym odtwarzaczem muzycznym — ChickenAmp 1.0.",
      "Zmieniono domyślny kolor ESP z różowego na bardziej męski burgund.",
      "Dodano 3 nowe configi: de_dust2, de_mirage i „moja siostra gra lepiej”.",
    ],
  },
  {
    version: "4.7.1",
    date: "5 maja 2026",
    tag: "Archiwalny",
    notes: [
      "Bunnyhop nie włącza się już sam podczas pisania na czacie.",
      "Naprawiono błąd, w którym nazwa okna loadera była widoczna na streamie.",
      "Dodano tłumaczenie na „górnośląski” (dzięki, Zbyszek).",
    ],
  },
  {
    version: "4.7.0",
    date: "20 kwietnia 2026",
    tag: "Archiwalny",
    notes: [
      "Nowy moduł: Auto-gg wyświetla „gg wp” po każdej rundzie, niezależnie od wyniku.",
      "Triggerbot obsługuje teraz shotguny — używaj na własną odpowiedzialność.",
    ],
  },
  {
    version: "4.6.0",
    date: "3 kwietnia 2026",
    tag: "Archiwalny",
    notes: [
      "ESP Healthbar pokazuje teraz procent zamiast nastroju przeciwnika.",
    ],
  },
  {
    version: "4.5.2",
    date: "15 marca 2026",
    tag: "Archiwalny",
    notes: [
      "Naprawiono bug, w którym aimbot śledził martwego gracza przez całą rundę.",
      "Dodano losowy cytat kurczaka przy starcie loadera.",
      "Zmieniono czcionkę menu na coś, co da się przeczytać bez lupy.",
    ],
  },
  {
    version: "4.5.0",
    date: "1 marca 2026",
    tag: "Archiwalny",
    notes: [
      "Pierwszy publiczny build z nowym systemem subskrypcji.",
      "Dodano moduł Skin Changer — teraz Twój Deagle może wyglądać na droższy.",
      "Wprowadzono kod zaproszenia, bo za dużo osób wpadało z TikToka.",
    ],
  },
  {
    version: "4.0.0",
    date: "10 lutego 2026",
    tag: "Archiwalny",
    notes: [
      "Wielka przepisywanka — nowy loader, nowe menu, nowy vibe.",
      "CS2 support w wersji beta (działało w 4 rundach na 5).",
      "Usunięto wsparcie dla CS:GO, bo Valve też je usunęło.",
    ],
  },
  {
    version: "3.9.0",
    date: "20 stycznia 2026",
    tag: "Archiwalny",
    notes: [
      "Ostatni build CS:GO — sentymentalnie działał tylko na starych matchmakingach.",
      "Dodano aimbot do łopat w Danger Zone (nie pytaj dlaczego).",
      "Pierwsza wzmianka o „zero banów” — wtedy jeszcze prawda.",
    ],
  },
];

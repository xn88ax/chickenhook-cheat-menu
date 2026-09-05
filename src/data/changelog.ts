export type Build = {
  version: string;
  date: string;
  tag: "Aktualny" | "Stabilny" | "Archiwalny";
  notes: string[];
};

export const builds: Build[] = [
  {
    version: "4.12.0",
    date: "2 września 2026",
    tag: "Aktualny",
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
      "Dodano licznik użytkowników online (na razie pokazuje 6 albo 7).",
      "Support na Discordzie dostał drugiego admina — cześć, Grzegorz.",
    ],
  },
];

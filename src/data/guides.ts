export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  body: { heading: string; paragraphs: string[] }[];
};

export const guides: Guide[] = [
  {
    slug: "jak-nie-dostac-bana",
    title: "Jak nie dostać bana w 3 prostych krokach",
    excerpt:
      "Krok pierwszy: nie chwal się. Krok drugi: nadal się nie chwal. Krok trzeci: patrz krok drugi.",
    date: "1 września 2026",
    readTime: "4 min",
    author: "Kurczak_200iq",
    body: [
      {
        heading: "Krok 1 — cisza to złoto",
        paragraphs: [
          "Największym wykrywaczem cheatów nie jest anti-cheat, tylko czat ogólny. Statystyki naszego wymyślonego działu badań mówią jasno: 94% zgłoszeń bierze się z wpisania „ez" po rundzie.",
          "Jeśli musisz coś napisać, napisz „gg" i wyjdź z serwera jak dżentelmen.",
        ],
      },
      {
        heading: "Krok 2 — smooth to Twój przyjaciel",
        paragraphs: [
          "Smooth 2 wygląda jak robot. Smooth 18 wygląda jak człowiek, który miał dobry dzień. Smooth 40 wygląda jak człowiek, który miał zły dzień, ale nadal wygrywa.",
          "Ustaw FOV na wartość, której nie wstydzisz się pokazać mamie.",
        ],
      },
      {
        heading: "Krok 3 — graj czasem źle",
        paragraphs: [
          "Nikt nie robi 30 fragów co mecz. Przegraj świadomie jedną rundę, chybij jeden strzał, kup dezaktywator, gdy nie ma bomby. To się nazywa aktorstwo.",
          "I pamiętaj: ta strona jest parodią, więc najbezpieczniejszy sposób na brak bana to po prostu grać legit.",
        ],
      },
    ],
  },
  {
    slug: "hvh-dla-poczatkujacych",
    title: "HvH dla początkujących kurczaków",
    excerpt:
      "Wchodzisz na serwer, wszyscy latają i teleportują się. Spokojnie — to normalne. Oto co robić.",
    date: "26 sierpnia 2026",
    readTime: "6 min",
    author: "hvh_grzegorz",
    body: [
      {
        heading: "Czym w ogóle jest HvH",
        paragraphs: [
          "HvH to skrót od „hack versus hack". Wszyscy mają cheaty, więc wygrywa ten, kto ma lepszy config i mocniejsze nerwy.",
          "To trochę jak konkurs na najbardziej chrupiące skrzydełko, tylko że wszyscy używają tej samej panierki.",
        ],
      },
      {
        heading: "Pierwszy config",
        paragraphs: [
          "Nie kopiuj configu od kolegi. Kolega ma inną myszkę, inne ping i inny poziom cierpliwości.",
          "Zacznij od naszego generatora configu, potem zmieniaj po jednej wartości. Jeśli zmienisz dziesięć, nie będziesz wiedział, która zepsuła aim.",
        ],
      },
      {
        heading: "Etykieta w HvH",
        paragraphs: [
          "Nie płacz na czacie. Nie wychodź po dwóch rundach. Nie pisz do admina, że przeciwnik cheatuje — cheatują wszyscy, taka jest umowa.",
          "Po meczu wypada podziękować. Krótkie „smaczne" wystarczy.",
        ],
      },
    ],
  },
  {
    slug: "aim-jak-magda-gessler",
    title: "Aim jak Magda Gessler: 5 zasad idealnego strzału",
    excerpt: "Za mało czosnku w Twoim aimie? Ten poradnik to zmieni. Rewelacja.",
    date: "18 sierpnia 2026",
    readTime: "5 min",
    author: "GesslerFan1998",
    body: [
      {
        heading: "Zasada 1 — świeże składniki",
        paragraphs: [
          "Świeży build to świeży aim. Stary build jest jak wczorajsza panierka — technicznie działa, ale nikt tego nie chce.",
        ],
      },
      {
        heading: "Zasada 2 — nie przesadzaj z przyprawami",
        paragraphs: [
          "Włączone naraz wszystkie moduły to nie „mocny config", to zupa. Wybierz trzy rzeczy i zrób je dobrze.",
        ],
      },
      {
        heading: "Zasada 3 — próbuj w trakcie gotowania",
        paragraphs: [
          "Testuj config na mapie treningowej, nie na Premierze o 23:40, gdy masz 4 promile zmęczenia.",
        ],
      },
      {
        heading: "Zasada 4 — podanie ma znaczenie",
        paragraphs: [
          "Ustaw sobie czysty crosshair i viewmodel. To jest talerz, na którym podajesz swoje fragi.",
        ],
      },
      {
        heading: "Zasada 5 — szacunek do produktu",
        paragraphs: [
          "Nie krzycz na kolegów z drużyny. Krzycz na siebie, cicho, w środku, jak profesjonalista.",
        ],
      },
    ],
  },
  {
    slug: "co-zrobic-po-zakupie",
    title: "Kupiłem subskrypcję — co teraz?",
    excerpt:
      "Loader, klucz, config i pierwsze 10 minut. Instrukcja dla tych, którzy nie czytają instrukcji.",
    date: "5 sierpnia 2026",
    readTime: "3 min",
    author: "AimAssistent",
    body: [
      {
        heading: "Minuta 0–2: ticket",
        paragraphs: [
          "Zakładasz ticket na supporcie i czekasz. Admin odpisze szybciej, niż zdążysz napisać „halo?".",
        ],
      },
      {
        heading: "Minuta 2–5: loader",
        paragraphs: [
          "Pobierasz loader, wyłączasz Secure Boot, klikasz start. Jeśli nic się nie dzieje, to znaczy, że wszystko się udało — tak działa dobry bypass.",
        ],
      },
      {
        heading: "Minuta 5–10: config",
        paragraphs: [
          "Wchodzisz do menu na Insercie, wybierasz gotowy config i ruszasz. Moduły ryzykowne wymagają planu Elite i zaakceptowanego podania.",
        ],
      },
    ],
  },
];

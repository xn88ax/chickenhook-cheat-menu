// Zestawy opcji dla każdego modułu — inspirowane listą funkcji neverlose.cc,
// nazwy i opisy przetłumaczone na polski (i lekko przekręcone pod ChickenHook).

export type MenuControl =
  | { kind: "toggle"; label: string; on?: boolean; hint?: string }
  | { kind: "select"; label: string; options: string[]; value?: number; hint?: string }
  | { kind: "slider"; label: string; value: number; unit?: string; hint?: string }
  | { kind: "stepper"; label: string; value: number; hint?: string }
  | { kind: "key"; label: string; value: string; hint?: string }
  | { kind: "text"; label: string; value: string; placeholder?: string; hint?: string };


export type MenuConfig = {
  /** Krótki podpis pod panelem — wyjaśnienie funkcji. */
  note: string;
  left: MenuControl[];
  right: MenuControl[];
};

export const menuOptions: Record<string, MenuConfig> = {
  "robot-celu": {
    note: "Aimbot koryguje kąt strzału w stronę wybranej kości. Im niższy smooth, tym szybszy, ale mniej naturalny ruch.",
    left: [
      { kind: "toggle", label: "Włącz aimbota", on: true },
      { kind: "select", label: "Tryb", options: ["Wsparcie (legit)", "Silent aim", "Rage"], value: 0 },
      { kind: "select", label: "Kość docelowa", options: ["Głowa", "Szyja", "Klatka", "Najbliższa", "Losowa"], value: 0 },
      { kind: "slider", label: "Pole widzenia (FOV)", value: 24, unit: "°" },
      { kind: "slider", label: "Wygładzanie (smooth)", value: 62 },
      { kind: "slider", label: "Minimalne obrażenia", value: 40, unit: "HP" },
    ],
    right: [
      { kind: "toggle", label: "Kontrola odrzutu (RCS)", on: true },
      { kind: "slider", label: "Siła RCS w pionie", value: 85, unit: "%" },
      { kind: "slider", label: "Siła RCS w poziomie", value: 70, unit: "%" },
      { kind: "toggle", label: "Automatyczny strzał", on: false },
      { kind: "toggle", label: "Ignoruj oślepionych", on: true },
      { kind: "select", label: "Profil broni", options: ["Wspólny", "Snajperki", "Automaty", "Pistolety"], value: 2 },
      { kind: "key", label: "Klawisz aimbota", value: "MOUSE5" },
      { kind: "toggle", label: "Anti-aim (kręcenie modelem)", on: false, hint: "Tylko HvH" },
      { kind: "select", label: "Kierunek anti-aimu", options: ["Tył", "Boki", "Losowy jitter", "Desync"], value: 2 },
      { kind: "toggle", label: "Fake lag", on: false },
      { kind: "stepper", label: "Wstrzymane ticki (choke)", value: 14 },
      { kind: "toggle", label: "Fake duck", on: false },
      { kind: "toggle", label: "Auto slow walk przy anti-aimie", on: true },
      { kind: "toggle", label: "Bezpieczne punkty (hitbox safe point)", on: true },
      { kind: "toggle", label: "Priorytet na najsłabszego wroga", on: false },
      { kind: "toggle", label: "Auto scope przy snajperce", on: true },
      { kind: "toggle", label: "Sprawdzanie przebicia ścian (autowall)", on: true },

      { kind: "toggle", label: "Brak rozrzutu (no spread)", on: true },
      { kind: "toggle", label: "Szybki ostrzał (rapid fire)", on: true },
      { kind: "toggle", label: "Podwójny strzał (double tap)", on: false, hint: "Dwa pociski w jednym ticku" },
      { kind: "toggle", label: "Szybkie przeładowanie (fast reload)", on: true },
      { kind: "toggle", label: "Cofanie w czasie (backtrack)", on: true, hint: "Strzał w dawne pozycje hitboxa" },
      { kind: "toggle", label: "Cichy aimbot (silent aim)", on: false },
      { kind: "toggle", label: "Ferrari peek", on: false, hint: "Wyglądanie z pełną prędkością" },
      { kind: "toggle", label: "Kurczak resolver", on: true, hint: "Naprawia desync animacji modelu" },
      { kind: "toggle", label: "Celowanie w powietrzu (in air)", on: false },
      { kind: "toggle", label: "Wymuś celność (force accuracy)", on: true },
      { kind: "toggle", label: "Celowanie w pięty wroga", on: false, hint: "Tryb szacunek" },
      { kind: "toggle", label: "Auto headshot na babci z sklepu", on: false, hint: "Nieaktualne od 2024" },
      { kind: "slider", label: "Szacunek do przeciwnika", value: 0, unit: "%", hint: "100% = sam skończy" },
      { kind: "toggle", label: "Strzelaj tylko gdy mama patrzy", on: false },
    ],
  },

  "robot-spustu": {
    note: "Triggerbot oddaje strzał w chwili, gdy celownik przechodzi po przeciwniku. Losowe opóźnienie maskuje reakcję.",
    left: [
      { kind: "toggle", label: "Włącz triggerbota", on: true },
      { kind: "select", label: "Warunek strzału", options: ["Dowolny hitbox", "Tylko głowa", "Głowa i klatka", "Nogi (żart)"], value: 1 },
      { kind: "slider", label: "Opóźnienie", value: 35, unit: "ms" },
      { kind: "slider", label: "Losowość opóźnienia", value: 20, unit: "%" },
      { kind: "slider", label: "Minimalne obrażenia", value: 25, unit: "HP" },
    ],
    right: [
      { kind: "toggle", label: "Blokada przez dym", on: true },
      { kind: "toggle", label: "Blokada po flashu", on: true },
      { kind: "toggle", label: "Tryb burst", on: false },
      { kind: "toggle", label: "Sprawdzanie przebicia (autowall)", on: true },
      { kind: "slider", label: "Szansa trafienia (hitchance)", value: 65, unit: "%" },
      { kind: "toggle", label: "Strzelaj tylko po zatrzymaniu", on: true },
      { kind: "toggle", label: "Strzelaj przy noclipie wroga", on: false },
      { kind: "toggle", label: "Ignoruj drużynę", on: true },
      { kind: "toggle", label: "Auto strzał w scope", on: false },
      { kind: "stepper", label: "Pociski w serii", value: 3 },
      { kind: "select", label: "Tryb pracy", options: ["Przytrzymanie", "Przełącznik", "Zawsze"], value: 0 },
      { kind: "key", label: "Klawisz", value: "ALT" },
      { kind: "toggle", label: "Nie strzelaj do kurczaków", on: true, hint: "Nasze zwierzaki" },
      { kind: "toggle", label: "Przeproś po każdym fragu", on: false },
    ],

  },

  wizualizacje: {
    note: "ESP rysuje przeciwników przez ściany. Ramka, szkielet i paski stanu czytane są z danych, które gra i tak wysyła.",
    left: [
      { kind: "toggle", label: "Włącz ESP", on: true },
      { kind: "select", label: "Ramka", options: ["Wyłączona", "Pełna", "Narożniki", "Tylko dolna kreska"], value: 2 },
      { kind: "toggle", label: "Szkielet", on: true },
      { kind: "toggle", label: "Pasek zdrowia", on: true },
      { kind: "toggle", label: "Nazwa gracza", on: true },
      { kind: "toggle", label: "Ikony broni i granatów", on: false },
    ],
    right: [
      { kind: "select", label: "Chams (modele)", options: ["Wyłączone", "Płaskie", "Metaliczne", "Panierka"], value: 1 },
      { kind: "select", label: "Podświetlenie (glow)", options: ["Wyłączone", "Delikatne", "Mocne"], value: 1 },
      { kind: "toggle", label: "Radar 2D", on: true },
      { kind: "toggle", label: "Dystans do celu", on: false },
      { kind: "toggle", label: "Strzałki poza ekranem (out of FOV)", on: true, hint: "Pokazuje wrogów za plecami" },
      { kind: "toggle", label: "Porzucone bronie i zestaw saperski", on: true },
      { kind: "toggle", label: "ESP granatów i toru lotu", on: true },
      { kind: "toggle", label: "Timer bomby i czas defuse", on: true },
      { kind: "toggle", label: "Dźwięki wrogów (sound ESP)", on: false },
      { kind: "toggle", label: "Znacznik trafienia (hitmarker)", on: true },
      { kind: "toggle", label: "Liczby obrażeń", on: true },
      { kind: "toggle", label: "Linia patrzenia wroga", on: false },
      { kind: "toggle", label: "Wskaźnik lunety i przeładowania", on: true },
      { kind: "toggle", label: "Celownik przebicia ścian", on: true },
      { kind: "toggle", label: "Podgląd ostatniej pozycji (backtrack)", on: false },
      { kind: "slider", label: "Zasięg rysowania", value: 75, unit: "m" },
      { kind: "slider", label: "Przezroczystość", value: 80, unit: "%" },
      { kind: "toggle", label: "Pokaż kto gra na laptopie mamy", on: false },
      { kind: "toggle", label: "ESP marzeń wroga", on: false, hint: "Widzisz, o czym śpi w nocy" },
      { kind: "toggle", label: "Korona nad najlepszym kurczakiem", on: true },
    ],

  },

  "zmieniacz-skorek": {
    note: "Podmiana wyglądu ekwipunku działa tylko po Twojej stronie — inni gracze widzą Twoje prawdziwe przedmioty.",
    left: [
      { kind: "toggle", label: "Włącz podmianę", on: true },
      { kind: "select", label: "Nóż", options: ["Domyślny", "Karambit", "Butterfly", "Skin do kurczaka"], value: 1 },
      { kind: "select", label: "Rękawiczki", options: ["Brak", "Sport", "Specjalist", "Rękawice z KFC"], value: 3 },
      { kind: "slider", label: "Zużycie (float)", value: 4, unit: "%" },
    ],
    right: [
      { kind: "stepper", label: "Seed wzoru", value: 387 },
      { kind: "toggle", label: "Naklejki", on: true },
      { kind: "toggle", label: "Brelok", on: false },
      { kind: "toggle", label: "Własne modele noży", on: true },
      { kind: "select", label: "Agent (model gracza)", options: ["Domyślny", "Cmdr. Mae", "Sir Bloody Darryl", "Kurczak w kominiarce"], value: 3 },
      { kind: "select", label: "Zestaw muzyczny", options: ["Domyślny", "AWOLNATION", "Kurnik FM", "xn88ax"], value: 3 },
      { kind: "slider", label: "Zużycie naklejek", value: 12, unit: "%" },
      { kind: "toggle", label: "Podmiana medali i odznak", on: true },
      { kind: "toggle", label: "Auto odświeżanie ekwipunku", on: true },
      { kind: "select", label: "Preset ekwipunku", options: ["Codzienny", "Turniejowy", "Bogaty kurczak"], value: 2 },
    ],

  },

  ruch: {
    note: "Poprawki poruszania się: szybsze zatrzymanie przed strzałem, czystsze wyjścia z zasłon i skoki z krawędzi.",
    left: [
      { kind: "toggle", label: "Włącz usprawnienia ruchu", on: true },
      { kind: "toggle", label: "Fast stop", on: true },
      { kind: "slider", label: "Siła fast stopu", value: 90, unit: "%" },
      { kind: "toggle", label: "Edge jump", on: true },
      { kind: "toggle", label: "Jump bug", on: false },
    ],
    right: [
      { kind: "select", label: "Auto peek", options: ["Wyłączony", "Powrót po strzale", "Powrót po klawiszu"], value: 1 },
      { kind: "slider", label: "Dystans peeka", value: 45 },
      { kind: "toggle", label: "Optymalizacja długich skoków", on: true },
      { kind: "toggle", label: "Auto slide", on: false },
      { kind: "toggle", label: "Slow walk (ciche podejście)", on: true },
      { kind: "toggle", label: "Edge bug", on: false },
      { kind: "toggle", label: "Strafe na drabinie", on: true },
      { kind: "toggle", label: "Air duck (kucanie w powietrzu)", on: false },
      { kind: "toggle", label: "Bind jump throw", on: true },
      { kind: "toggle", label: "Auto unduck po skoku", on: true },
      { kind: "key", label: "Klawisz peeka", value: "SHIFT" },
      { kind: "key", label: "Klawisz slow walk", value: "CTRL" },
      { kind: "toggle", label: "Moonwalk (chodzenie tyłem)", on: false, hint: "Jak Michael Jackson" },
      { kind: "toggle", label: "Krok kurczaka", on: true, hint: "Dziobanie przy każdym kroku" },
    ],

  },

  "kroliczy-skok": {
    note: "Bunnyhop trzyma idealny timing skoków. Szansa trafienia poniżej 100% wygląda bardziej po ludzku.",
    left: [
      { kind: "toggle", label: "Włącz auto bhop", on: true },
      { kind: "slider", label: "Szansa trafienia skoku", value: 82, unit: "%" },
      { kind: "select", label: "Auto strafe", options: ["Wyłączony", "Klawisze", "Ruch myszy", "Pełna synchronizacja"], value: 2 },
      { kind: "slider", label: "Płynność strafe'a", value: 65 },
    ],
    right: [
      { kind: "toggle", label: "Limit prędkości", on: true },
      { kind: "slider", label: "Maksymalna prędkość", value: 55, unit: "u/s" },
      { kind: "toggle", label: "Skok na drabinie", on: false },
      { kind: "toggle", label: "Auto długi skok (long jump)", on: true },
      { kind: "toggle", label: "Pomiar prędkości w rogu ekranu", on: true },

      { kind: "toggle", label: "Wskaźnik prędkości", on: true },
      { kind: "select", label: "Tryb", options: ["Przytrzymanie spacji", "Przełącznik"], value: 0 },
    ],
  },

  przyspieszenie: {
    note: "Speedhack podbija prędkość ruchu. Tryb cichy trzyma wartości w granicach, których serwer nie odrzuca.",
    left: [
      { kind: "toggle", label: "Włącz przyspieszenie", on: false },
      { kind: "slider", label: "Mnożnik prędkości", value: 40 },
      { kind: "slider", label: "Prędkość w powietrzu", value: 30 },
      { kind: "toggle", label: "Tryb cichy", on: true },
    ],
    right: [
      { kind: "select", label: "Tryb pracy", options: ["Przytrzymanie", "Przełącznik"], value: 0 },
      { kind: "toggle", label: "Wyłącz przy strzale", on: true },
      { kind: "toggle", label: "Płynne narastanie", on: true },
      { kind: "toggle", label: "Przyspieszenie tylko w powietrzu", on: false },
      { kind: "toggle", label: "Wyłącz przy sapowaniu bomby", on: true },

      { kind: "key", label: "Klawisz", value: "MOUSE4" },
    ],
  },

  "brak-klipu": {
    note: "Noclip wyłącza kolizję z geometrią mapy. Tryb cichy trzyma pozycję zgodną z tym, co widzi serwer.",
    left: [
      { kind: "toggle", label: "Włącz noclip", on: false },
      { kind: "slider", label: "Prędkość lotu", value: 50 },
      { kind: "toggle", label: "Tryb cichy", on: true },
      { kind: "toggle", label: "Powrót na legalną pozycję", on: true },
    ],
    right: [
      { kind: "select", label: "Sterowanie", options: ["Kamera", "Osie mapy"], value: 0 },
      { kind: "toggle", label: "Bezwładność", on: false },
      { kind: "toggle", label: "Ukryj efekty ruchu", on: true },
      { kind: "key", label: "Klawisz", value: "V" },
    ],
  },

  "tryb-boga": {
    note: "Nietykalność działa tylko tam, gdzie masz prawa administratora albo offline — na oficjalnych serwerach nie.",
    left: [
      { kind: "toggle", label: "Włącz tryb boga", on: false },
      { kind: "toggle", label: "Odporność na obrażenia", on: true },
      { kind: "toggle", label: "Odporność na upadek", on: true },
      { kind: "toggle", label: "Nieskończone HP i kamizelka", on: true },
    ],
    right: [
      { kind: "toggle", label: "Brak flasha", on: true },
      { kind: "toggle", label: "Brak podpalenia", on: true },
      { kind: "select", label: "Dozwolone serwery", options: ["Tylko offline", "Offline i workshop", "Wszędzie (ryzyko)"], value: 1 },
      { kind: "toggle", label: "Wymagaj potwierdzenia", on: true },
    ],
  },

  teleport: {
    note: "Teleport przenosi Cię w zapisany punkt. Tryb krokowy dzieli drogę na małe skoki, więc mniej rzuca się w oczy.",
    left: [
      { kind: "toggle", label: "Włącz teleport", on: false },
      { kind: "select", label: "Cel", options: ["Zapisany punkt", "Bomba", "Najbliższy wróg", "Losowe miejsce"], value: 0 },
      { kind: "stepper", label: "Numer punktu", value: 2 },
      { kind: "toggle", label: "Tryb krokowy", on: true },
    ],
    right: [
      { kind: "slider", label: "Długość kroku", value: 35 },
      { kind: "toggle", label: "Zapisz pozycję powrotu", on: true },
      { kind: "toggle", label: "Ukryj animację", on: true },
      { kind: "key", label: "Klawisz teleportu", value: "F" },
      { kind: "key", label: "Klawisz powrotu", value: "G" },
    ],
  },

  "awaria-serwera": {
    note: "Moduł testowy wysyła zniekształcone pakiety. Używaj tylko na własnych serwerach — inaczej to zwykły atak.",
    left: [
      { kind: "toggle", label: "Włącz moduł", on: false },
      { kind: "select", label: "Rodzaj pakietów", options: ["Zniekształcone", "Zapętlone", "Zbyt duże"], value: 0 },
      { kind: "slider", label: "Intensywność", value: 15, unit: "%" },
      { kind: "stepper", label: "Pakiety na sekundę", value: 8 },
    ],
    right: [
      { kind: "toggle", label: "Log odpowiedzi serwera", on: true },
      { kind: "toggle", label: "Limit bezpieczeństwa", on: true },
      { kind: "toggle", label: "Wymagaj potwierdzenia", on: true },
      { kind: "select", label: "Zatrzymaj po", options: ["10 s", "30 s", "Ręcznie"], value: 0 },
    ],
  },

  "glitch-kasy": {
    note: "Podbicie stanu konta działa wyłącznie na serwerach z modami — oficjalne serwery Valve liczą kasę u siebie.",
    left: [
      { kind: "toggle", label: "Włącz glitch kasy", on: false },
      { kind: "slider", label: "Kwota startowa", value: 65 },
      { kind: "toggle", label: "Auto buy", on: true },
      { kind: "select", label: "Zestaw zakupów", options: ["Pełny", "Eco", "Snajperski", "Tylko nóż"], value: 0 },
    ],
    right: [
      { kind: "toggle", label: "Log transakcji", on: true },
      { kind: "toggle", label: "Tylko serwery community", on: true },
      { kind: "toggle", label: "Ukryj powiadomienia", on: false },
      { kind: "stepper", label: "Powtórzenia na rundę", value: 1 },
    ],
  },

  rozne: {
    note: "Drobne dodatki poprawiające komfort i bezpieczeństwo — od widoku z trzeciej osoby po listę obserwujących.",
    left: [
      { kind: "toggle", label: "Widok z trzeciej osoby", on: false },
      { kind: "slider", label: "Dystans kamery", value: 45 },
      { kind: "toggle", label: "Zoom", on: true },
      { kind: "slider", label: "Pole widzenia (FOV)", value: 68, unit: "°" },
    ],
    right: [
      { kind: "toggle", label: "Night mode", on: true },
      { kind: "toggle", label: "Lista obserwujących", on: true },
      { kind: "toggle", label: "Czysta konsola", on: true },
      { kind: "toggle", label: "Auto akceptacja meczu", on: true },
      { kind: "toggle", label: "Auto defuse i auto plant", on: true },
      { kind: "toggle", label: "Bot zakupów (buy bot)", on: false },
      { kind: "toggle", label: "Kill say na czacie", on: false, hint: "Wysyła tekst po fragu" },
      { kind: "toggle", label: "Spamer clan tagu", on: false },
      { kind: "toggle", label: "Zmieniacz nicku", on: false },
      { kind: "toggle", label: "Usuń dym, flasha i scope", on: true },
      { kind: "select", label: "Skybox", options: ["Domyślny", "Nocny", "Kurczak orange", "Vertigo blue"], value: 2 },
      { kind: "select", label: "Kolory świata", options: ["Domyślne", "Szare", "Neon", "Panierka"], value: 0 },
      { kind: "toggle", label: "Lista bindów na HUD", on: true },
      { kind: "toggle", label: "Watermark z FPS i pingiem", on: true },
      { kind: "select", label: "Viewmodel", options: ["Domyślny", "Bliski", "Daleki", "Ukryty"], value: 1 },
      { kind: "key", label: "Klawisz zoomu", value: "C" },
      { kind: "toggle", label: "Auto GG po meczu", on: true },
      { kind: "toggle", label: "Zgłoś wroga za granie lepiej", on: false, hint: "Oczywiście żartobliwie" },
      { kind: "toggle", label: "Kokardka na grzbiecie", on: true },
      { kind: "select", label: "Wymówka po przegranej", options: ["Lagi", "Myszka się zacięła", "Kot skoczył na klawiaturę", "Brak wymówek (rage)"], value: 2 },
    ],

  },

  "czat-glosowy": {
    note: "Modulator przetwarza mikrofon w czasie rzeczywistym. Soundboard puszcza pliki wprost do kanału głosowego.",
    left: [
      { kind: "toggle", label: "Włącz modulator", on: true },
      { kind: "select", label: "Barwa głosu", options: ["Kurczak", "Robot", "Bas", "Dziecko", "Radio CB"], value: 0 },
      { kind: "slider", label: "Wysokość tonu", value: 58 },
      { kind: "slider", label: "Głośność mikrofonu", value: 74, unit: "%" },
      { kind: "toggle", label: "Filtr szumu", on: true },
    ],
    right: [
      { kind: "toggle", label: "Soundboard", on: true },
      { kind: "select", label: "Zestaw dźwięków", options: ["Kurnik", "Memy", "Krzyki", "Reklamy"], value: 0 },
      { kind: "slider", label: "Głośność dźwięków", value: 60, unit: "%" },
      { kind: "toggle", label: "Nagrywaj kanał wroga", on: false },
      { kind: "toggle", label: "Podsłuch drużyny przeciwnej", on: false },
      { kind: "key", label: "Klawisz push-to-talk", value: "K" },
    ],
  },

  "custom-skin": {
    note: "Podgląd pokazuje wgrany model na obracającej się postaci. Zmiany widzisz tylko Ty — serwer dostaje oryginalne pliki.",
    left: [
      { kind: "toggle", label: "Włącz własne modele", on: true },
      { kind: "select", label: "Postać w podglądzie", options: ["CT — SAS", "CT — SEAL", "T — Phoenix", "T — Balkan"], value: 0 },
      { kind: "select", label: "Zestaw tekstur", options: ["Kurczak gold", "Camo panierka", "Neon", "Własny plik"], value: 0 },
      { kind: "slider", label: "Metaliczność", value: 55, unit: "%" },
      { kind: "slider", label: "Zużycie (float)", value: 6, unit: "%" },
    ],
    right: [
      { kind: "toggle", label: "Animowany podgląd", on: true },
      { kind: "slider", label: "Prędkość obrotu", value: 45 },
      { kind: "toggle", label: "Światło studyjne", on: true },
      { kind: "toggle", label: "Pokaż siatkę modelu", on: false },
      { kind: "stepper", label: "Slot presetu", value: 1 },
      { kind: "key", label: "Klawisz podglądu", value: "P" },
    ],
  },

  radio: {
    note: "Radio miksuje muzykę z dźwiękiem gry. Auto ciszej ścisza utwór, gdy zaczyna się runda, żeby słyszeć kroki.",
    left: [
      { kind: "toggle", label: "Włącz radio", on: true },
      { kind: "select", label: "Playlista", options: ["xn88ax", "HvH classics", "Kurnik FM", "Własny strumień"], value: 0 },
      { kind: "slider", label: "Głośność", value: 42, unit: "%" },
      { kind: "toggle", label: "Losowa kolejność", on: true },
      { kind: "toggle", label: "Powtarzanie", on: false },
    ],
    right: [
      { kind: "toggle", label: "Wizualizator na HUD", on: true },
      { kind: "select", label: "Equalizer", options: ["Płaski", "Bass boost", "Vocal", "Nocny"], value: 1 },
      { kind: "toggle", label: "Auto ciszej w rundzie", on: true },
      { kind: "toggle", label: "Nakładka z tytułem", on: true },
      { kind: "key", label: "Następny utwór", value: "]" },
    ],
  },

  "2pacalypse": {
    note: "Panel-parodia legendarnego bootera 2PACALYPSE 2.3 z 2011. Nic naprawdę nie wysyła — botnety są udawane, a licznik i sylwetka 2Paca to hołd dla ery skiddie.",
    left: [
      { kind: "toggle", label: "Uzbrój 2PACALYPSE", on: false },
      { kind: "text", label: "IP celu", value: "64.231.75.201", placeholder: "0.0.0.0" },
      { kind: "text", label: "Port", value: "80", placeholder: "80" },
      { kind: "select", label: "Typ ataku", options: ["UDP flood", "SYN flood", "HTTP GET", "Slowloris", "Ping of Death"], value: 0 },
      { kind: "slider", label: "Intensywność", value: 88, unit: "%" },
    ],
    right: [
      { kind: "stepper", label: "Botnets online", value: 22 },
      { kind: "toggle", label: "Losuj port", on: false },
      { kind: "toggle", label: "Spoof źródła", on: true },
      { kind: "toggle", label: "Odtwórz „Hit 'Em Up”", on: true },
      { kind: "select", label: "Dedykacja", options: ["r.i.p 2pac", "Moneymack forever", "West Side", "1996"], value: 0 },
      { kind: "key", label: "Klawisz DDoS", value: "F" },
    ],
  },

  "auto-strazak": {
    note: "Auto strażak zajmuje się wyłącznie ogniem: gasi molotovy i incendiary. Nie dotyka aimu, ruchu ani niczego innego.",
    left: [
      { kind: "toggle", label: "Włącz auto strażaka", on: true },
      { kind: "toggle", label: "Gaś molotovy", on: true },
      { kind: "toggle", label: "Gaś incendiary", on: true },
      { kind: "slider", label: "Promień reakcji", value: 240, unit: "u" },
      { kind: "slider", label: "Opóźnienie reakcji", value: 12, unit: "ms" },
      { kind: "select", label: "Priorytet", options: ["Ogień pod tobą", "Ogień na trasie ruchu", "Najbliższy płomień"], value: 0 },
    ],
    right: [
      { kind: "toggle", label: "Gaś tylko własne obrażenia", on: true },
      { kind: "toggle", label: "Gaś ogień kolegom z drużyny", on: false },
      { kind: "toggle", label: "Alert na HUD", on: true },
      { kind: "toggle", label: "Licznik ugaszonych w rundzie", on: true },
      { kind: "select", label: "Tryb pracy", options: ["Automatyczny", "Przytrzymanie klawisza"], value: 0 },
      { kind: "key", label: "Klawisz ręczny", value: "F" },
    ],
  },

  "auto-flash": {
    note: "Auto flash assist podaje flashbangi dla teammate'ów. Sam liczy czas lotu i wybuchu, żeby wspierać wypad bez oślepiania własnych.",
    left: [
      { kind: "toggle", label: "Włącz auto flash assist", on: true },
      { kind: "toggle", label: "Tylko na callout teammate'a", on: false },
      { kind: "slider", label: "Promień detekcji wsparcia", value: 320, unit: "u" },
      { kind: "slider", label: "Czas lotu flasha", value: 900, unit: "ms" },
      { kind: "select", label: "Tryb rzutu", options: ["Stojąc", "Z biegu", "Skok", "Podkręcony (run-boost)"], value: 1 },
      { kind: "select", label: "Cel rzutu", options: ["Przed teammate'a", "Za plecy wroga", "Nad głowę", "Na ziemię"], value: 0 },
    ],
    right: [
      { kind: "toggle", label: "Nie oślepiaj drużyny", on: true },
      { kind: "toggle", label: "Unikaj oślepienia siebie", on: true },
      { kind: "toggle", label: "Alert na HUD", on: true },
      { kind: "toggle", label: "Licznik asyst flashowych", on: true },
      { kind: "select", label: "Aktywacja", options: ["Automatyczna", "Przytrzymanie klawisza"], value: 1 },
      { kind: "key", label: "Klawisz ręczny", value: "G" },
    ],
  },

  "nade-helper": {
    note: "Nade helper tylko pokazuje lineupy i kąt celowania — nie rzuca za ciebie i nie rusza myszką.",
    left: [
      { kind: "toggle", label: "Włącz nade helper", on: true },
      { kind: "toggle", label: "Smoke'y", on: true },
      { kind: "toggle", label: "Molotovy i incendiary", on: true },
      { kind: "toggle", label: "Flashe", on: true },
      { kind: "toggle", label: "HE", on: false },
      { kind: "select", label: "Zestaw lineupów", options: ["Pro (HLTV)", "Matchmaking", "Własne", "Wszystkie"], value: 0 },
    ],
    right: [
      { kind: "toggle", label: "Znacznik pozycji na ziemi", on: true },
      { kind: "toggle", label: "Znacznik kąta celowania", on: true },
      { kind: "toggle", label: "Podpowiedź: stój / skok / bieg", on: true },
      { kind: "toggle", label: "Podgląd toru lotu", on: true },
      { kind: "slider", label: "Zasięg podpowiedzi", value: 500, unit: "u" },
      { kind: "key", label: "Klawisz listy lineupów", value: "N" },
    ],
  },

  "pyszne-kfc": {
    note: "Panel Pyszne.pl podpięty pod najbliższe KFC. Zamówienie składasz w podglądzie obok — koszyk liczy się na żywo, a przy 39 zł dostawa jest darmowa.",
    left: [
      { kind: "toggle", label: "Włącz panel Pyszne.pl", on: true },
      { kind: "text", label: "Adres dostawy", value: "ul. Kurza 88/2, Warszawa", placeholder: "ulica, numer, miasto" },
      { kind: "select", label: "Restauracja", options: ["KFC Złote Tarasy", "KFC Dworzec Centralny", "KFC Marszałkowska", "KFC Blue City"], value: 0 },
      { kind: "select", label: "Płatność", options: ["BLIK", "Karta", "Gotówka u kuriera", "Skiny z inwentarza"], value: 0 },
      { kind: "text", label: "Kod promocyjny", value: "CHICKENHOOK", placeholder: "kod rabatowy" },
    ],
    right: [
      { kind: "toggle", label: "Podwójna panierka", on: true },
      { kind: "toggle", label: "Bez sałaty", on: false },
      { kind: "stepper", label: "Sosy dodatkowe", value: 4 },
      { kind: "select", label: "Napój", options: ["Pepsi", "Pepsi Max", "Mirinda", "Lipton", "Woda (po co)"], value: 1 },
      { kind: "toggle", label: "Zamów po przegranej rundzie", on: false },
      { kind: "key", label: "Powtórz zamówienie", value: "F9" },
    ],
  },
};


export const fallbackMenuConfig: MenuConfig = {
  note: "Ten moduł nie ma jeszcze własnych ustawień w tym buildzie.",
  left: [{ kind: "toggle", label: "Włączone", on: false }],
  right: [{ kind: "toggle", label: "Automatyczny zapis", on: true }],
};

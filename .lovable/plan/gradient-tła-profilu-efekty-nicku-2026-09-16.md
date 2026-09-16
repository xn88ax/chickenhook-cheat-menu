# Gradient tła profilu + efekty nicku

## Co dostajesz

**1. Gradient jako tło profilu**
- W Ustawieniach → Profil pojawia się wybór tła: „Jednolity kolor" albo „Gradient".
- Przy gradiencie ustawiasz dwa kolory (górny i dolny) własnymi pipetami, plus kierunek (z góry na dół / po skosie / promieniście).
- Podgląd na bieżąco w Ustawieniach; po zapisaniu tło banera i całego profilu używa tego gradientu (gdy nie masz wgranego banera; z banerem gradient zostaje delikatną nakładką jak teraz).

**2. Własne kolory profilu**
- Oba kolory (główny i drugi) można wybrać dowolną pipetą, nie tylko z gotowych presetów — tak jak już działa główny kolor.
- Drugi kolor napędza też efekty nicku, więc jeden wybór stylizuje całość.

**3. Efekty nicku do wyboru**
Siedem stylów, wybieranych kafelkami z podglądem nicku w danym efekcie:
- Solid — zwykły kolor
- Gradient — przejście z koloru 1 do koloru 2
- Neon — świecąca poświata
- Toon — gruby obrys w kontrastowym kolorze
- Pop — cień/przesunięta kopia liter
- Gummy — miękki, „żelkowy" połysk
- Prism — tęczowe, ruchome przejście kolorów

Wybrany efekt widać na profilu, na czacie i przy postach na forum. Efekty ruchome wyłączają się, gdy w ustawieniach strony masz wyłączone animacje.

## Szczegóły techniczne

- Migracja `public.profiles`: dodanie `accent_2 text`, `bg_mode text default 'solid'` (`solid` | `gradient`), `bg_angle text default 'down'`, `name_effect text default 'solid'`. Bez zmian w politykach — profil edytuje właściciel, czyta każdy (już tak jest).
- `src/lib/profile-media.ts`: `NAME_EFFECTS`, `BG_MODES`, `BG_ANGLES`, helpery `secondAccent()`, `nameEffect()`, `profileBackground()` zwracające gotowy `background` (CSS gradient) z dwóch kolorów.
- `src/styles.css`: klasy `.nick-fx-solid|gradient|neon|toon|pop|gummy|prism` oparte na `--role-color`/`--profile-accent` i nowej `--profile-accent-2`; animacja tylko dla `prism`, wygaszana przez istniejący `:root[data-site-animations="off"]` i `prefers-reduced-motion`. `.profile-banner-fallback` czyta `--profile-bg` zamiast twardego radial-gradientu.
- `src/routes/_authenticated/ustawienia.tsx`: sekcja „Tło i kolory" (tryb, dwie pipety, kierunek) + sekcja „Efekt nicku" z kafelkami-podglądami; wartości lecą do `profiles` przy „Zapisz profil".
- `src/routes/profil.$username.tsx`: do zapytania dochodzą nowe kolumny; `--profile-accent-2` i `--profile-bg` na `<main>`, nagłówek nicku dostaje `nick-fx-*`.
- `src/components/forum/user-identity.tsx` i `src/components/shoutbox.tsx`: nick renderowany z klasą `nick-fx-*` z profilu autora (pobierana razem z resztą danych autora, bez dodatkowych zapytań na wiadomość).

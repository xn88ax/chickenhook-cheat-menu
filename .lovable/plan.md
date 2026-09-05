# ChickenHook — pakiet bekowy (kategorie 1–4)

Robimy wszystko z kategorii 1, 2, 3 i easter egg z kategorii 4. Całość w obecnym stylu GameSense: płaskie ciemne panele `GsPanel`, czerwone akcenty, teksty po polsku.

## 1. Społeczność / żywy świat (strona główna)
- **Licznik online** — pasek z liczbą graczy, która losowo skacze co kilka sekund (np. 41–63), plus „szczyt dzisiaj". Ląduje w panelu Statystyki.
- **Shoutbox** — panel „Czat społeczności": wiadomości wymyślonych użytkowników dopisują się same co 3–6 s, przewijana lista, pole do wpisania własnej wiadomości (dodaje ją lokalnie, bez zapisu).
- **Hall of Fame** — tabela top fraggerów: nick, HS%, K/D, ELO, „banów: 0", medale za pierwsze trzy miejsca.
- **Live ban feed** — kolumna z falstartowymi banami konkurencji („skeet.cc — 412 kont VAC"), a na dole zawsze „ChickenHook — undetected". Wpisy dopisują się na żywo.

## 2. Narzędzia / generatory (nowa podstrona /narzedzia)
- **Generator configu HvH** — przycisk losuje nazwę pliku i zestaw żartobliwych ustawień (FOV, smooth, „chicken_mode 1"), pokazuje wynik jako podglądany plik .cfg z przyciskiem „Pobierz" (kopiuje tekst).
- **Fake VAC scanner** — przycisk startuje udawany skan z paskiem postępu i lecącymi krokami („sprawdzam pliki…", „usypiam Valve…"), wynik: „0% ryzyka".
- **Koło fortuny** — obracające się koło z nagrodami („1 dzień Elite", „ban (żart)", „nic", „config od proa"), animacja obrotu i wynik. Jedno kręcenie na wejście, potem „wróć za 24 h".
- **Porównanie z konkurencją** — tabela ChickenHook vs Skeet vs Onetap vs Aimware; zielone fajki tylko u nas, konkurencja z krzyżykami i przypisami.

## 3. Treści / marketing
- **Patch notes** — nowa podstrona `/changelog`: lista buildów z datami i punktami zmian (żartobliwe), najnowszy build oznaczony jako aktualny. Skrót ostatniego wpisu też na stronie głównej.
- **Blog / poradniki** — `/poradniki` z listą artykułów i `/poradniki/$slug` z treścią. 4–5 wpisów, m.in. „Jak nie dostać bana w 3 prostych krokach", „HvH dla początkujących kurczaków".
- **Sklep z merch** — `/sklep`: siatka produktów (koszulka, kubek, naklejki, poduszka-kurczak), ceny w zł, każdy oznaczony „Wyprzedane" albo „Tylko Elite" — nic nie da się kupić.
- **O nas** — `/o-nas`: historia powstania w stylu legendy, kalendarium i „zespół" (pseudonimy + role).

## 4. Easter egg — Konami code
- Nasłuch klawiszy globalnie: ↑↑↓↓←→←→BA. Po wpisaniu włącza się „tryb kurczaka": kursor zmienia się na kurczaka, po ekranie przelatują emoji kurczaków, pojawia się plakietka „TRYB KURCZAKA AKTYWNY" z możliwością wyłączenia. Stan trzymany w pamięci przeglądarki, wyłączany przy `prefers-reduced-motion` (animacje statyczne).

## Nawigacja
Górna nawigacja dostaje nowe zakładki: Narzędzia, Changelog, Poradniki, Sklep, O nas. Przy tej liczbie pozycji nav zwija część linków do rozwijanego „Więcej", żeby na telefonie nie pękał.

## Szczegóły techniczne
- Nowe trasy w `src/routes/`: `narzedzia.tsx`, `changelog.tsx`, `poradniki.tsx`, `poradniki.$slug.tsx`, `sklep.tsx`, `o-nas.tsx` — każda z własnym `head()` (unikalny title/description/og).
- Nowe komponenty w `src/components/`: `online-counter.tsx`, `shoutbox.tsx`, `hall-of-fame.tsx`, `ban-feed.tsx`, `config-generator.tsx`, `vac-scanner.tsx`, `fortune-wheel.tsx`, `competitor-table.tsx`, `konami.tsx`.
- Dane statyczne w `src/data/`: `shoutbox.ts`, `fraggers.ts`, `bans.ts`, `changelog.ts`, `guides.ts`, `merch.ts`, `wheel.ts`.
- Wszystko po stronie klienta (`useState`/`useEffect`, `setInterval`), bez bazy i bez funkcji serwerowych — to czysta parodia.
- Nowe klasy pomocnicze (koło fortuny, pasek skanera, kursor-kurczak) dodane do `src/styles.css`; zero kolorów wpisanych na sztywno.
- Konami code montowany raz w `src/routes/__root.tsx`, żeby działał na każdej podstronie.

## Kolejność prac
1. Kategoria 1 na stronie głównej (licznik, shoutbox, hall of fame, ban feed).
2. Podstrona Narzędzia z czterema narzędziami + nowa nawigacja.
3. Changelog, poradniki, sklep, O nas.
4. Konami code i tryb kurczaka.

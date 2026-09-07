# Przebudowa strony głównej: ciemne forum 2026

## Cel
Uprościć stronę główną do czytelnego, nowoczesnego układu forum/overlay: jedna hierarchia, spokojne tło, jeden header, spójne karty i oszczędne użycie czerwieni. Zachować działanie czatu, feedu banów, logowania, cen i okien funkcji.

## Zakres zmian

### 1. Fundament wizualny
- Wprowadzić podane tokeny kolorów, promieni, odstępów i szerokości jako semantyczne zmienne projektu, zapisane w formacie zgodnym z obecnym systemem stylów.
- Ustawić Barlow dla treści i Bebas Neue dla logo; zachować ich obecne ładowanie.
- Dodać stałe, ciche tło z dwoma subtelnymi poświatami i przesuwającą się siatką 48 px, bez canvasu i particles.
- Wyłączyć ruch siatki dla `prefers-reduced-motion` oraz ujednolicić focus, disabled, linki i kotwice.

### 2. Jeden header i jeden banner
- Zastąpić osobny pasek logo, nawigację, pasek informacji i breadcrumbs jednym sticky headerem o wysokości 56 px.
- Ułożyć: logo, główne linki, rozwijane „Więcej”, status `Undetected · 4.12.0`, logowanie i CTA „Kup”.
- Logo: `chicken` białe, `hook.ru` czerwone; aktywny link czerwony, status zielony.
- Na telefonie zachować dostęp do wszystkich linków przez kompaktowe menu bez ściskania elementów.
- Połączyć dwie obecne belki w jedną zamykaną kartę-banner wewnątrz kontenera 1160 px, z linkiem do changelogu i pamiętaniem zamknięcia w sesji.

### 3. Spójny układ kart
- Przebudować wspólny panel na jeden wzorzec: ciemne podniesione tło, cienka linia, radius 10 px i nagłówek 11 px uppercase.
- Usunąć czerwone kreski spod sekcji, gradientowe ozdobniki i czerwone liczby; 2 px czerwieni pozostawić tylko przy ogłoszeniu.
- Ustawić szerokość treści 1160 px, boki 20 px i odstępy sekcji 24 px.
- Główny układ desktopowy oprzeć na proporcji `1.4fr / 1fr`; poniżej 860 px przełączyć na jedną kolumnę.

### 4. Górna część home
- Ogłoszenie zamienić w pojedynczą kartę alertu z normalnym tekstem, krótkim labelem i czerwonymi linkami.
- Statystyki rozbić na cztery osobne kafelki: `6–7`, `0`, `13`, `412`; liczby białe, etykiety stonowane.
- Licznik live, szczyt i kolejkę przenieść do osobnego paska pod kafelkami; tylko status OK będzie zielony, a „nadal Ty” żółty.

### 5. Shoutbox i fala banów
- Umieścić oba moduły w jednej siatce 1.4fr / 1fr, z shoutboxem pierwszym na telefonie.
- Shoutbox: lista 280 px, stała kolumna czasu 44 px, czerwone nicki, spokojniejsza treść oraz composer `input + Wyślij` w jednym rzędzie.
- Dla gościa zostawić jedną szarą informację pod polem; zachować nick gościa, trwałe wiadomości, realtime, usuwanie i `aria-live`.
- Feed banów ujednolicić z wierszami shoutboxa: data, nazwa, krótki powód; ChickenHook zakończy listę jako zwykły wiersz z zieloną kropką.

### 6. Skrócenie dalszej części home
- Lista oppsów: pokazać 5 rekordów w karcie, dodać przycisk „Pełna lista” rozwijający resztę; sticky nagłówek i delikatna zebra.
- Changelog: maksymalnie 3 punkty i link do pełnej strony.
- Funkcje: pokazać 3 kompaktowe karty w trzech kolumnach (jedna na telefonie), każda z tytułem, jednym zdaniem i tagiem; pełna lista pozostanie na `/opcje`.
- Ograniczyć podglądy YouTube na home do maksymalnie dwóch; pozostałe filmy nadal będą dostępne na stronie funkcji.
- Cennik i status bezpieczeństwa ułożyć jako 3–4 kompaktowe karty zamiast długich list forum.
- Usunąć z home ścianę 39 cudzych opinii i zastąpić sekcję trzema krótkimi, własnymi opiniami w tym samym stylu kart.

### 7. FAQ i zakończenie strony
- Zbudować kontrolowany accordion z przyciskami, `aria-expanded`, chevronem obracanym o 90° i pełnymi istniejącymi odpowiedziami.
- Dodać właściwe stany hover/open, cienkie separatory i czytelny tekst odpowiedzi bez czerwonej kreski.
- Nad FAQ dodać linię `DEMO · STRONA PARODYSTYCZNA`; skrócić stopkę do copyrightu i tej samej informacji.

## Zachowane działanie
- Czat gości i użytkowników, logowanie, feed aktualizowany na żywo, okna funkcji, ceny, statusy oraz wszystkie istniejące podstrony pozostają funkcjonalne.
- Dane 39 opinii nie będą usuwane z projektu; zniknie tylko ich długa prezentacja ze strony głównej.
- Metadane, GIF podglądu linku i favicon pozostaną bez zmian.

## Weryfikacja
- Sprawdzić stronę na desktopie 1280 px oraz telefonie poniżej 860 px.
- Potwierdzić działanie sticky headera, menu „Więcej”, zamykania bannera, accordionu FAQ, rozwijania oppsów, formularza shoutboxa i wszystkich linków.
- Zweryfikować brak nakładania tekstu, odpowiedni kontrast, widoczne focusy, reduced motion oraz czysty wynik kompilacji.

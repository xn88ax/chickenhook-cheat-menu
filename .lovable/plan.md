# Profil forum: linki, UID i brokatowe role

## Zakres
- Usunąć „Punkty” oraz „Punkty kurnika” z profilu użytkownika.
- Dodać do profilu miejsce na maksymalnie trzy własne linki, edytowane w ustawieniach i widoczne publicznie.
- Pokazać UID użytkownika na profilu oraz przy jego postach w wątku.
- Wyświetlać role `Admin`, `Owner` i `Moderator` jako wyraźne odznaki; `Admin` i `Owner` dostaną animowany, brokatowy połysk.
- Ujednolicić kartę autora pierwszego posta i odpowiedzi, aby nick prowadził do profilu, a UID i rola były czytelne.

## Dane i bezpieczeństwo
- Rozszerzyć profil o trzy opcjonalne adresy URL.
- Linki będą zapisywane wyłącznie przez właściciela profilu zgodnie z obecną ochroną danych.
- Akceptować tylko pełne adresy `http://` lub `https://`; puste pola pozostaną niewidoczne.

## Techniczne
- Migracja Lovable Cloud doda kolumny linków do istniejącej tabeli profili bez zmiany ról i uprawnień.
- Publiczny profil i widok wątku pobiorą role oraz nowe pola profilu.
- Efekt brokatu będzie zrobiony w CSS, z wyłączeniem animacji przy ustawieniu ograniczania ruchu.
- Po wdrożeniu sprawdzić zapis linków, profil i widok wątku oraz stan kompilacji.

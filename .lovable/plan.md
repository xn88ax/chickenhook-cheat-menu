# Efekty profilu w stylu Discorda

## Zakres
- Rozszerzyć profil o trzy osobne kosmetyki: dekorację awatara, animację całej karty profilu i tabliczkę pod nickiem.
- Zachować obecne kolory, gradienty, banner GIF i efekty nicku; nowe opcje będą działały razem z nimi.
- Przygotować własne odpowiedniki stylistyczne, bez kopiowania płatnych grafik i nazw kolekcji Discorda.

## Wygląd i zachowanie
- **Dekoracje awatara:** pierścień energii, płomienie, piksele, korona i kurczak — animowane nakładki wokół zdjęcia.
- **Efekty profilu:** iskry, spadające płatki, wyładowania, glitch oraz konfetti — uruchamiane po otwarciu profilu i zapętlone subtelnie.
- **Tabliczki nicku:** neon, glitch, hologram i ogień — dekoracyjne tło bezpośrednio pod nazwą.
- Dodać podglądy wszystkich opcji w Ustawieniach oraz pozycję „Brak”.
- Animacje mają być wyłączane przez istniejące ustawienie animacji i `prefers-reduced-motion`.

## Dane i integracja
- Dodać do profilu pola identyfikujące wybraną dekorację awatara, efekt profilu i tabliczkę nicku.
- Wyświetlać pełny zestaw na stronie profilu; subtelną dekorację awatara i styl nicku także na forum oraz czacie.
- Użyć lekkich efektów CSS, bez pobierania cudzych assetów i bez wpływu na klikalność elementów.

## Weryfikacja
- Sprawdzić zapis i ponowne odczytanie ustawień.
- Zweryfikować profil, forum i czat na desktopie oraz telefonie.
- Sprawdzić wyłączenie animacji, typy i aktualny build.

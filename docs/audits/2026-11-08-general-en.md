# Przegląd pakietu General Knowledge (EN)

Zakres: 577 pytań pakietu `databases/categories/general_en.json`, wszystkie warianty odpowiedzi i oba wyjaśnienia oraz opis. Przeczytano cały pakiet i poprawiono stwierdzone błędy, niejednoznaczności i wybrane twierdzenia zależne od czasu. Liczba rekordów i opis pozostają bez zmian. Stan danych: 8 listopada 2026 r.

Poprawki obejmują m.in. fałszywą przynależność K2 do Himalajów (#538), niedokładne przedstawienie grobowca Tutanchamona, Magna Carta i rozejmu 1918 r., liczby i statusy w geografii i astronomii, szczegóły zasad krykieta, badmintona i siatkówki oraz twierdzenia o badaniach DNA, transfuzji i helie. Doprecyzowano historyczny zakres rankingów sportowych. Zastąpiono dwie pary identycznych pytań (#67/#305 i #202/#412), zachowując liczbę rekordów.

Wybrane źródła:

- [Library of Congress: Magna Carta](https://www.loc.gov/exhibits/magna-carta-muse-and-mentor/rebellion-and-the-great-charter.html) — przyjęcie i pieczęć Jana bez twierdzenia o podpisie.
- [NASA: Ceres](https://science.nasa.gov/mission/dawn/science/ceres/) — historia klasyfikacji Ceres; [NASA: Alpha Centauri](https://imagine.gsfc.nasa.gov/features/cosmic/nearest_star_info.html) — odległość Proksimy.
- [IHO: projekt czwartego wydania S-23](https://legacy.iho.int/mtg_docs/com_wg/S-23WG/S-23WG_Misc/Draft_2002/Draft_2002.htm) — dokument z 2002 r. pozostał projektem, więc usunięto twierdzenie o zatwierdzeniu Oceanu Południowego w 2000 r.
- [EPA: Lake Michigan](https://www.epa.gov/sites/production/files/2015-11/documents/lake-michigan-lamp-report-2011-4pp.pdf) — jedyne Wielkie Jezioro leżące w całości w USA.
- [International Cricket Council: wickets](https://www.icc-cricket.com/news/mens-test-match-clause-8-the-wickets) — wicket składa się z trzech stumps i dwóch bails.
- [FIFA: mistrzowie świata](https://www.fifa.com/en/tournaments/mens/worldcup/articles/teams-most-wins-titles-trophies) — liczby tytułów po turnieju 2026 oraz wynik finału 2002; [ATP: Djokovic](https://www.atptour.com/en/news/djokovic-us-open-2026-r1-upset-shocking-facts) — 24 tytuły wielkoszlemowe w 2026 r.
- [European Forest Institute](https://efi.int/publication/how-did-eu-27-forests-develop-and-why-do-they-differ-those-past) — odsetek pokrycia lasami w Finlandii i Szwecji.

Weryfikacja strukturalna: projektowy `python3 scripts/audit_questions.py --json` wykonał się bez błędów i zwrócił pustą listę problemów dla 229 paczek; dodatkowo sprawdzono 577 rekordów, po cztery różne warianty, obecność właściwej odpowiedzi w wariantach i brak identycznych znormalizowanych treści pytań w tym pakiecie.

Ograniczenia: pakiet zawiera wiele pytań bliskich tematycznie, mimo usunięcia identycznych treści. Źródła są wybrane i nie dokumentują osobno każdej pozycji. Rankingi, szacunki geograficzne i rekordy sportowe mogą się zmienić; niektóre pozostają zależne od przyjętych definicji. Przegląd nie zastępuje specjalistycznej recenzji każdej dziedziny.

Zmienione rekordy (kolejność w pliku): 2, 4, 8, 10, 11, 23, 25, 29, 31, 44, 46, 49, 58, 67, 68, 76, 80, 82, 85, 86, 90, 98, 99, 100, 110, 121, 126, 135, 136, 137, 143, 154, 169, 176, 192, 202, 214, 217, 220, 221, 223, 226, 228, 232, 236, 238, 239, 255, 260, 270, 281, 283, 287, 290, 297, 305, 307, 315, 320, 329, 349, 352, 354, 361, 365, 378, 380, 389, 395, 403, 412, 414, 415, 419, 421, 426, 430, 440, 442, 448, 452, 453, 460, 467, 470, 474, 481, 493, 500, 520, 521, 532, 533, 536, 537, 538, 541, 544, 547, 549, 563, 572.

# Nierozstrzygnięte podobieństwa między paczkami — 2026-11-05

Raport zawiera szczegółowe porównanie czterech par podobnych paczek oraz przekrojową listę wszystkich par, w których znaleziono identyczne teksty pytań. To rozpoznanie powtórzeń i różnic, a nie audyt merytoryczny wszystkich pytań. Zawartości paczek ani wpisów indeksu nie zmieniono w ramach tego porównania. Ustalenie pozostaje otwarte; przed ewentualną konsolidacją trzeba przeprowadzić audyt treści. Nie należy usuwać paczek przed tym audytem.

## Przekrojowe porównanie całego indeksu

Porównano migawkę `HEAD` `e1ac543`: wszystkie 229 wpisów z `databases/list.json` i odpowiadające im pliki. Metoda: w każdym rekordzie wzięto wyłącznie `questions[].question`, zastosowano Unicode NFKC, usunięto skrajne odstępy, zredukowano wielokrotne białe znaki i porównano bez rozróżniania wielkości liter. Dla każdej pary paczek policzono wspólne pytania z uwzględnieniem liczby wystąpień. W tym zbiorze wynik dla surowego, dosłownego tekstu był taki sam jak po normalizacji: nie wykryto dodatkowych trafień wynikających tylko z różnic wielkości liter lub odstępów.

Wykryto 799 różnych tekstów pytań występujących w więcej niż jednej paczce. Każdy występuje w dokładnie dwóch paczkach, co daje 14 par i 1 598 łącznych wystąpień tych tekstów. Liczby w tabeli to liczba identycznych tekstów pytań dla danej pary. Są to sygnały do oceny treści, zakresów i wariantów odpowiedzi; nie są zaleceniem usuwania pytań ani paczek.

| Identyczne pytania | ID paczek |
|---:|---|
| 131 | `astronomy_solar_system_en` — `astronomy_the_solar_system_en` |
| 126 | `astronomia_i_ukad_soneczny_pl` — `astronomia_uklad_sloneczny_pl` |
| 124 | `staroytny_rzym_pl` — `starozytny_rzym_pl` |
| 105 | `medycyna_i_ludzkie_ciao_pl` — `medycyna_ludzkie_cialo_pl` |
| 105 | `medicine_and_human_body_en` — `medicine_human_body_en` |
| 104 | `gry_fabularne_i_rpg_pl` — `gry_rpg_pl` |
| 93 | `swiaty_i_lore_w_grach_pl` — `wiaty_i_lore_w_grach_pl` |
| 2 | `rolnictwo_i_agrokultura_pl` — `zwierzta_domowe_i_hodowlane_pl` |
| 2 | `geografia_pl` — `nauka_pl` |
| 2 | `europa_pl` — `geografia_pl` |
| 2 | `beyond_the_horizon_en` — `great_water_en` |
| 1 | `inspirujce_biografie_pl` — `wielkie_budowle_i_inynieria_pl` |
| 1 | `europa_pl` — `wiedza_oglna_2_pl` |
| 1 | `common_misconceptions_en` — `general_en` |

To porównanie wykrywa identyczne treści pytań; nie wykrywa parafraz, wspólnych faktów pytanych innymi słowami ani nie ocenia, czy powtórzenie między kategoriami jest uzasadnione. Dla par z wieloma powtórzeniami opisano poniżej również różnice opcji i objaśnień. Pary z jednym lub dwoma trafieniami wymagają oceny w kontekście tematyki każdej paczki.

### Bieżące pliki robocze

Migawka `HEAD` została użyta, aby wynik nie zmieniał się w trakcie pracy. W chwili sprawdzania raportu 35 plików paczek różniło się od niej. Liczby w tabeli dotyczą wersji tych plików z `HEAD`; równoległe zmiany w drzewie roboczym nie zostały uwzględnione. Należy ponowić porównanie po zakończeniu edycji, szczególnie dla czterech plików astronomicznych.

`absurd_physics_monster_trucks_mechs_en`, `accidental_inventions_en`, `afrykaska_przygoda_pl`, `ameryka_aciska_pl`, `anatomia_i_ludzkie_ciao_pl`, `anatomia_prawdy_pl`, `anatomy_of_truth_en`, `ancient_rome_en`, `applied_science_and_everyday_tech_en`, `architektura_i_miasta_pl`, `artificial_intelligence_in_gaming_en`, `astronomia_i_ukad_soneczny_pl`, `astronomia_uklad_sloneczny_pl`, `astronomy_solar_system_en`, `astronomy_the_solar_system_en`, `atrakcje_turystyczne_pl`, `automation_simulation_games_en`, `aviation_space_pioneers_en`, `azja_i_pacyfik_pl`, `bad_movie_nights_so_bad_its_good_en`, `fizyka_i_kosmologia_pl`, `geografia_pl`, `geographical_discoveries_en`, `klasyka_literatury_pl`, `kultura_gier_i_ciekawostki_pl`, `matematyka_i_logika_pl`, `mathematics_and_logic_en`, `physics_and_cosmology_en`, `rolnictwo_i_agrokultura_pl`, `skarby_ziemi_polskie_pl`, `smart_materials_composites_en`, `the_elements_of_everything_en`, `the_microscopic_world_en`, `wiat_modych_pl`, `zioolecznictwo_i_medycyna_ludowa_pl`.

## Starożytny Rzym

Pliki `databases/categories/staroytny_rzym_pl.json` (ID `staroytny_rzym_pl`) i `databases/categories/starozytny_rzym_pl.json` (ID `starozytny_rzym_pl`) mają po 125 pytań. Obie paczki mają tę samą nazwę, język i opis. Różnią się ID, ścieżką oraz datą utworzenia; w `databases/list.json` są osobnymi pozycjami.

124 pytania mają identyczny tekst; pozostała para różni się literówką „okulusem”/„okiusem”. Spośród 124 identycznych tekstów 120 ma identyczne warianty odpowiedzi. W pięciu wspólnych pytaniach są różnice treści: #13 używa odpowiedzi „Pretorianie” lub „Pretoryjscy gwardziści”; #24 ma warianty nazwiska Genzeryk/Giserich; #48 jedna wersja zawiera błędny wariant „Saloostiusz”; #92 różnią się objaśnienia; #112 różnią się warianty imienia Tyberiusz/Tiberiusz, objaśnienia i dystraktor. Numery odnoszą się do kolejności w plikach. Różne znaczniki modelu i czasu weryfikacji nie są dowodem na poprawność treści.

## Światy i Lore w Grach

Pliki `databases/categories/swiaty_i_lore_w_grach_pl.json` (ID `swiaty_i_lore_w_grach_pl`) i `databases/categories/wiaty_i_lore_w_grach_pl.json` (ID `wiaty_i_lore_w_grach_pl`) mają po 100 pytań oraz identyczną nazwę. Ich opisy są różne: pierwszy jest opisem autorskim, drugi wymienia przykładowe podkategorie. Indeks traktuje je jako oddzielne paczki.

93 pozycje mają identyczny tekst pytania, opcje, odpowiedź i objaśnienia; różnią się tylko znacznikami weryfikacji. Pozostałe siedem par (#7, #23, #45, #48, #58, #69, #77) to różnie zredagowane pytania o te same wątki, z różnicami w wariantach odpowiedzi lub wyjaśnieniach. Przykłady rozbieżności to #23 „Krudler / Krushak” wobec „Krushak”, #58 „Suweren (Sovereign)” wobec „Suweren” i #77 „Maltael (Malthael)” wobec „Maltael”. Te warianty wymagają osobnej weryfikacji; nie przesądzono, który rekord jest lepszy.

## Astronomia — dwie pary PL/EN

Poniższe liczby pochodzą ze stabilnej migawki `HEAD` o identyfikatorze `e1ac543` (stan repozytorium podczas porównania). Wszystkie cztery pliki astronomiczne są obecnie zmienione w roboczym drzewie przez trwający przegląd. Liczby opisują więc bazowy stan `HEAD`; trzeba je ponownie obliczyć po zakończeniu tych edycji. Nie edytowano paczek ani indeksu w ramach tego porównania.

### Polski

`astronomia_uklad_sloneczny_pl` ma 131 pytań, a `astronomia_i_ukad_soneczny_pl` ma 159. Obie pozycje mają tę samą nazwę i opis. Po normalizacji wielkości liter i odstępów 126 tekstów pytań jest identycznych; w pierwszej paczce pozostało 5 tekstów bez dokładnego odpowiednika, a w drugiej 33. Nie stwierdzono powtórzonych tekstów wewnątrz którejkolwiek z tych paczek.

Spośród 126 wspólnych pytań 118 rekordów ma identyczną treść poza znacznikami modelu i czasu weryfikacji. W 8 rekordach różnią się odpowiedzi lub wyjaśnienia: trzy mają inne zestawy opcji, w jednym różni się też klucz („Cykl protonowy”/„Cykl proton-proton”); pozostałe różnice dotyczą wyjaśnień. Pięć tekstów występujących tylko w mniejszej paczce dotyczy m.in. liczby księżyców Saturna, gwiazd neutronowych, meteorów, Haumei i globul Boka; większa paczka zawiera bliskie warianty tych samych zagadnień, więc 5 tekstów bez ścisłego dopasowania nie oznacza 5 unikalnych faktów.

Metadane różnią się ID, ścieżką, datą utworzenia i deklarowaną liczbą pytań. Starsza pozycja (`astronomia_uklad_sloneczny_pl`) nie ma znaczników `last_verified_at` ani `verifying_model`; nowsza (`astronomia_i_ukad_soneczny_pl`) ma znaczniki z 12 czerwca 2026 r. oraz model `google/gemini-3-flash-preview`.

### English

`astronomy_solar_system_en` ma 131 pytań, a `astronomy_the_solar_system_en` ma 195. Obie pozycje mają tę samą nazwę i opis. Wszystkie 131 tekstów pytań z mniejszej paczki występuje również w większej; nie stwierdzono powtórzonych tekstów wewnątrz tych paczek.

Spośród 131 wspólnych pytań 130 rekordów ma identyczną treść poza znacznikami modelu i czasu weryfikacji. W jednym pytaniu o konstelację satelitarną SpaceX różnią się jeden dystraktor (`Iridium`/`Galileo`) i objaśnienie błędnych odpowiedzi; klucz `Starlink` jest taki sam. Większa paczka zawiera ponadto 64 teksty pytań, których nie ma w mniejszej.

Metadane różnią się ID, ścieżką, datą utworzenia i deklarowaną liczbą pytań. Starsza pozycja (`astronomy_solar_system_en`) nie ma znaczników `last_verified_at` ani `verifying_model`; nowsza (`astronomy_the_solar_system_en`) ma znaczniki z 12 czerwca 2026 r. oraz model `google/gemini-3.1-flash-lite`.

### Wpływ i ograniczenia porównania

W selektorze każda z czterech pozycji pozostaje osobną kartą, mimo identycznych nazw i opisów w obrębie par. Widoczna liczba pytań może ujawnić, że są to różne wpisy, ale karta nie pokazuje ID. Jeśli wybrane zostaną obie wersje polskie, zestaw otrzyma 290 rekordów, w tym co najmniej 126 identycznych tekstów i kilka bliskich parafraz; dla angielskich będzie to 326 rekordów, w tym 131 identycznych tekstów. Ładowanie aplikacji nie deduplikuje pytań między paczkami.

Porównanie tekstów i pól JSON nie rozstrzyga wszystkich parafraz ani poprawności faktów i dystraktorów. W szczególności rekord o cyklu proton-proton ma rozbieżny klucz w polskiej parze i wymaga merytorycznego rozstrzygnięcia w trwającym audycie. Raportuje się tu podobieństwo i ryzyko nakładania, nie rekomendację usunięcia którejkolwiek paczki.

## Skutek w aplikacji i ryzyko

Selektor kategorii pobiera wpisy dynamicznie z `databases/list.json` (`js/trivia/ui-setup.js`, `loadAllCategories`) i wyświetla każdą paczkę jako osobną kartę. Karta pokazuje nazwę, opis i liczbę pytań, ale nie ID. Obie wersje rzymskie mają zatem dla gracza identyczną nazwę i opis; wersje gamingowe można odróżnić po opisie.

`js/trivia/client-adapter.js` znajduje wpis indeksu po ID, pobiera wskazaną ścieżkę i dołącza wszystkie pytania z wybranych paczek. Nie usuwa powtórzeń między paczkami. Wybranie obu paczek z którejkolwiek pary może więc utworzyć dwie kategorie z tą samą widoczną nazwą i powtórzyć pytania w zestawie. Dla pary rzymskiej współdzielonych jest 124/125 tekstów, a dla gamingowej 93/100 dokładnych tekstów oraz siedem bliskich wariantów.

Wybrane ID są zapisywane w `localStorage` pod kluczem `trivia_selected_category_ids`. Przy wczytywaniu selekcji aplikacja odfiltrowuje ID, których nie ma już w indeksie (`js/trivia/ui-setup.js`, `loadAllCategories`). Usunięcie wpisu z indeksu spowodowałoby więc utratę tego wyboru przy następnym wczytaniu, chyba że migracja jawnie przepisze stare ID na zachowane ID. Nie znaleziono statycznych odwołań do tych ID w kodzie aplikacji; indeks i zapis lokalny są istotnymi punktami zależności.

**Status:** ustalenie nierozstrzygnięte. Najpierw należy sprawdzić źródłowo różniące się rekordy oraz jakość obu paczek. Dopiero po tym audycie można rozważyć konsolidację, zachowując historyczne pliki i rozwiązując migrację zapisanych ID. Ten raport nie zaleca usuwania paczek przed audytem.

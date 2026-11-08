# Przegląd merytoryczny: Kino i Film

Data: 2026-11-08. Plik: `databases/categories/kino_i_film_pl.json`. Przejrzano opis oraz wszystkie 100 pytań, cztery opcje i klucz każdego pytania, a także oba wyjaśnienia. Liczba pytań i klucze pozostały bez zmian. Zmienione rekordy nie zachowują wcześniejszych znaczników automatycznej weryfikacji. Opis skrócono i zsynchronizowano z odpowiednim wpisem indeksu.

Poprawki objęły pytania 2, 7, 11, 13, 17, 19, 21, 30, 32, 38, 43, 44, 46, 51, 64, 67–69, 71, 75, 83–86, 88–91, 97 i 98 (numeracja od 1). Doprecyzowano m.in. autorstwo scenariusza i historii *Pulp Fiction*, genezę festiwalu Sundance, wkład współkompozytorów *Gladiatora*, genezę DreamWorks, obu bohaterów *Seksmisji*, miejsce Oscarów w 2024 roku, muzykę *Pianisty*, status Pandory jako księżyca oraz role Dalego i Buñuela. Usunięto nieścisłości dotyczące Ripley, statków z serii *Obcy* i roli Vito Corleone oraz nadmierne uogólnienia o gatunkach i technice.

Wybrane źródła:

- [Academy, 96. ceremonia Oscarów](https://www.oscars.org/oscars/ceremonies/2024) – miejsce ceremonii w 2024 roku.
- [Academy Awards Database, Quentin Tarantino](https://awardsdatabase.oscars.org/Search/GetResults?query=%7B%22Nominee%22%3A%22Quentin+Tarantino%22%2C%22Sort%22%3A%221-Nominee-Alpha%22%2C%22Search%22%3A%22Basic%22%7D) – autorstwo scenariusza i historii *Pulp Fiction*.
- [Sundance Institute, początki instytutu](https://www.sundance.org/blogs/sundance40th-a-look-back-at-the-sundance-institutes-1980s-origins-5/) – powstanie instytutu i przejęcie festiwalu.
- [MoMA, filmografia Dalego](https://www.moma.org/interactives/exhibitions/2008/dali/filmography.pdf) – scenariusz i reżyseria *Psa andaluzyjskiego*.
- [Avatar, Pandorapedia: Pandora](https://www.avatar.com/pandorapedia/pandora) – Pandora jako księżyc.
- [Filmweb, muzyka do *Pianisty*](https://www.filmweb.pl/news/Premiera%2Bp%C5%82yty%2Bz%2Bmuzyk%C4%85%2Bdo%2B%22Pianisty%22-7853) – muzyka Wojciecha Kilara i wykorzystanie utworów Chopina.

Ograniczenia: przegląd dotyczył treści istniejącej paczki, nie pełnej bibliografii do każdego z 100 pytań. Powyższe źródła dokumentują wybrane, szczególnie istotne poprawki, a nie każdą informację w zestawie. Nie przeprowadzono analizy kompletnej filmografii ani badania odbioru przez graczy.

Kontrola: `python3 scripts/audit_questions.py` bez błędów strukturalnych; dodatkowo sprawdzono liczbę pytań, unikalność opcji i przynależność kluczy do opcji.

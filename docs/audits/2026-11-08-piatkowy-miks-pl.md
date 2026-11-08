# Przegląd: Piątkowy Miks

Sprawdzono opis paczki `databases/categories/pitkowy_miks_pl.json` oraz wszystkie 100 pytań, opcje, klucze i oba wyjaśnienia. Poprawiono 52 rekordy, zachowując liczbę pytań i istniejący opis. Przegląd wykonano 8 listopada 2026 r.

Usunięto błędy i wieloznaczności dotyczące m.in. pola Higgsa, neonowego gazu lżejszego od powietrza, kultur kōji w produkcji miso, torbaczy na północ od Meksyku, Walhalli i Fólkvangru, położonych w Londynie stadionów Wembley i Emirates oraz uzasadnienia Nobla dla Sienkiewicza. Doprecyzowano dane o Księżycu, chlorofilach, Olimpusie Mons i stadionie Camp Nou. Część powtórzonych pytań zmieniono na inne fakty z tej samej dziedziny; pozostają pytania tematycznie powiązane.

Wybrane źródła:

- [CERN: bozon i pole Higgsa](https://home.web.cern.ch/science/physics/higgs-boson) — rozróżnienie pola nadającego masę i związanego z nim bozonu.
- [NASA: Księżyc](https://science.nasa.gov/moon/facts/) — jedyne poza Ziemią ciało niebieskie odwiedzone dotąd przez ludzi.
- [National Park Service: dydelf wirginijski](https://www.nps.gov/bith/learn/nature/virginia-opossum.htm) — zasięg torbaczy na północ od Meksyku.
- [Badanie produkcji miso i kōji](https://pmc.ncbi.nlm.nih.gov/articles/PMC8307815/) — udział pleśni *Aspergillus oryzae* w wytwarzaniu kōji.
- [Fundacja Noblowska: nagroda Sienkiewicza](https://www.nobelprize.org/prizes/literature/1905/summary/) — uzasadnienie nagrody literackiej z 1905 r.
- [World Athletics: wyniki Usaina Bolta](https://worldathletics.org/athletes/jamaica/usain-bolt-14201847) — wyniki 100 i 200 m z 2009 r.
- [FC Barcelona: otwieranie Camp Nou po przebudowie](https://www.fcbarcelona.com/en/news/4465846/fc-barcelona-official-statement) — zmienna pojemność stadionu.
- [Nintendo: postacie serii The Legend of Zelda](https://zelda.nintendo.com/about/) oraz [MoMA: René Magritte](https://www.moma.org/explore/inside_out/tag/rene-magritte/) — postacie i autorstwo obrazu.

Walidacja: 100 pytań, po cztery różne odpowiedzi, każdy klucz obecny w opcjach, wymagane pola niepuste, brak identycznych treści pytań. Projektowy `python3 scripts/audit_questions.py --json` zakończył się powodzeniem dla 229 paczek.

Ograniczenia: paczka obejmuje wiele odległych dziedzin, a wykaz źródeł jest wyborem, nie aparatem przypisów do każdego pytania. Dostępna pojemność stadionu i aktualne rekordy mogą się zmieniać; dane historycznych wyników sportowych sformułowano z datą.

Zmienione rekordy według kolejności pliku: 4, 5, 8, 10, 12, 14, 16, 17, 20, 22, 23, 24, 26, 27, 28, 30, 33, 35, 38, 40, 43, 44, 46, 50, 53, 55, 56, 58, 62, 64, 65, 66, 68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 82, 87, 88, 89, 91, 92, 93, 95, 97, 100.

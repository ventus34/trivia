# Przegląd merytoryczny: Kultura gier i ciekawostki

Data: 2026-11-08. Plik `databases/categories/kultura_gier_i_ciekawostki_pl.json`: przejrzano opis i wszystkie 100 pytań, opcje, klucze oraz oba wyjaśnienia. Liczba pytań nie zmieniła się. Opis zsynchronizowano z wpisem paczki w `databases/list.json`; wcześniejsze znaczniki automatycznej weryfikacji usunięto ze zmienionych rekordów.

Poprawiono pozycje 1–4, 6–9, 12–13, 15, 17–19, 21–27, 30, 34–35, 37, 39, 41, 43–47, 51–54, 56–57, 59–61, 63, 67–74, 76, 78–79, 81–82, 86–87, 89–91, 93–100 (numeracja od 1). Wśród zmian są sprostowanie mitu o błędzie agresji Gandhiego i mitu dotyczącego modelu Lary Croft; rzeczywiście wydana gra *Kajko i Kokosz w krainie Borostworów* zastąpiła fałszywą opowieść o nieistniejącej grze. Poprawiono nazwisko Daigo Umehary, szczegóły finałowego ataku w Evo Moment 37 i zasady speedrunów. Wycofano niezweryfikowane lub nadmiernie szczegółowe twierdzenia o Silent Hill 2, karierach zawodników, sprzęcie oraz genezie gier. Część pytań przebudowano, zmieniając odpowiedzi i klucze, przy zachowaniu liczby pozycji.

Wybrane źródła:

- [Video Game History Foundation, rozmowa z Sidem Meierem](https://gamehistory.org/ep-8-sid-meiers-episode-of-the-video-game-history-hour/) – legenda o nuklearnym Gandhim i wątpliwości dotyczące rzekomego błędu.
- [CD-Action, Kajko i Kokosz](https://cdaction.pl/newsy/kajko-i-kokosz-doczekaja-sie-kolejnej-gry-ale-nie-nastawiajcie-sie-na-zbyt-wiele/) – istnienie gry i demonstracja dołączona do pisma.
- [Nintendo, rozmowa z Shigeru Miyamoto](https://www.nintendo.com/de-at/Iwata-fragt/Iwata-fragt-New-Super-Mario-Bros-Wii/Iwata-fragt-New-Super-Mario-Bros-Wii-Teil-1/1-Mario-konnte-zu-Beginn-nicht-springen-210699.html) – początkowa koncepcja Popeye i Donkey Kong; Miyamoto nie pamiętał powodu rezygnacji z postaci.
- [Speedrun.com, poradnik pierwszego speedrunu](https://www.speedrun.com/support/learn/your-first-speedrun) oraz [regulamin Ocarina of Time](https://www.speedrun.com/oot?h=Glitchless-Any&rules=category&x=zd35jnkn-7890o58w.xqk98nd1) – różnice między kategoriami i znaczenie zasad danej społeczności.
- [MIT Media Lab, Rob Pardo](https://www.media.mit.edu/people/rpardo/overview/) – główny projektant *Brood War*.
- [Zapach Papieru, historia Top Secret](https://zapach-papieru.pl/encyklopedia-pism/top-secret/) – Marcin Borkowski i pseudonim Kopalny.
- [Shacknews, korekta anegdoty o Larze Croft](https://www.shacknews.com/article/127285/25-things-you-probably-didnt-know-about-tomb-raider) – zastrzeżenie dotyczące historii o przypadkowej zmianie modelu.

Ograniczenia: wskazane źródła dotyczą wybranych poprawek, a nie każdej informacji ze 100 pozycji. Anegdoty i społecznościowa terminologia bywają sporne, a reguły poszczególnych gier oraz speedrunów różnią się między wersjami. Nie wykonano pełnej rekonstrukcji kodu gier ani testu z graczami.

Walidacja: `python3 scripts/audit_questions.py`, sprawdzenie liczby pytań, unikalności opcji i przynależności kluczy oraz `git diff --check`.

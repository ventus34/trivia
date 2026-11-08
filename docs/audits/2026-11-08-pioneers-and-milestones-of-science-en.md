# Przegląd merytoryczny: Pioneers and Milestones of Science

Data: 2026-11-08. Przejrzano opis pliku `databases/categories/pioneers_and_milestones_of_science_en.json` oraz każde ze 100 pytań, opcji, kluczy i obu wyjaśnień. Zachowano liczbę pytań; opis zsynchronizowano wyłącznie z odpowiednim wpisem w `databases/list.json`. Z poprawionych rekordów usunięto wcześniejsze znaczniki automatycznej weryfikacji.

Poprawiono pozycje 1–4, 7–9, 11–13, 15–24, 26, 29–40, 42–48, 50–55, 57–60, 62, 64–65, 66–68, 70–73, 75, 77–83, 85–86, 90–96 i 99–100 (numeracja od 1). Doprecyzowano wkład Raymonda Goslinga do Photo 51, uzasadnienie chemicznego Nobla Marii Skłodowskiej-Curie, wcześniejsze zasady nagród pośmiertnych, rolę Périera w eksperymencie Pascala i skład mieszaniny Millera–Ureya. Zastąpiono nieuzasadnione twierdzenia o portrecie Hooke’a, słonicy Topsy oraz konflikcie Cope’a i Marsha. Skorygowano nadmierne uogólnienia z fizyki, genetyki i historii nagród oraz wskazano współpracowników przy odkryciach. W części pozycji zmieniono pytania, opcje i klucze, aby usunąć błędne założenia lub niejednoznaczność.

Wybrane źródła:

- [King’s College London, historia Photograph 51](https://www.kcl.ac.uk/the-story-behind-photograph-51?_bhlid=c08ec00f299dbdd706b42222dd6604b410d3c02d) – Franklin, Gosling i dyfrakcja DNA.
- [Nobel Prize, nagroda chemiczna Marii Curie 1911](https://www.nobelprize.org/prizes/chemistry/1911/summary/) oraz [wykład noblowski](https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/lecture/) – odkrycie pierwiastków i izolacja radu.
- [Nobel Prize, historia nagród pośmiertnych](https://www.nobelprize.org/prizes/facts/facts-on-the-nobel-peace-prize/) – zmiana zasad w 1974 roku.
- [Rutgers Edison Papers, Topsy](https://edison.rutgers.edu/life-of-edison/essaying-edison/essay/myth-buster-topsy-the-elephant) – oddzielenie zdarzenia z 1903 roku od wojny prądów.
- [Royal Society, portret Hooke’a](https://royalsociety.org/blog/2010/12/hooke-newton-and-the-missing-portrait/) – ograniczenia dowodów na historię o zniszczonym portrecie.
- [NASA, eksperyment Millera–Ureya](https://www.nasa.gov/centers-and-facilities/goddard/a-stormy-active-sun-may-have-kickstarted-life-on-earth/) – skład użytej mieszaniny i aminokwasy.

Ograniczenia: źródła dokumentują wybrane ważne poprawki, nie każdy fakt we wszystkich 100 pytaniach. Historyczne pierwszeństwo, motywacje uczestników i interpretacje doświadczeń bywają sporne; zestaw nie jest wyczerpującą historią nauki. Nie przeprowadzono testu z graczami.

Walidacja: sprawdzono liczbę pytań, unikalność opcji i zgodność kluczy oraz `git diff --check`. Globalny `python3 scripts/audit_questions.py` w chwili kontroli wskazywał w kolejnych uruchomieniach niespójności kluczy w innych, równolegle edytowanych paczkach; zostały zgłoszone osobie integrującej.

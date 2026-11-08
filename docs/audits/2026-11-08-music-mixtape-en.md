# Przegląd merytoryczny: Music Mixtape

Data: 2026-11-08. Przejrzano opis pliku `databases/categories/music_mixtape_en.json` oraz wszystkie 100 pytań, opcje, klucze i oba wyjaśnienia. Zachowano liczbę pytań; opis zsynchronizowano z wpisem paczki w `databases/list.json`. Usunięto dawne znaczniki automatycznej weryfikacji z poprawionych rekordów.

Zmieniono pozycje 1, 3, 5–6, 8, 12–14, 21, 23, 25–26, 31–33, 37–38, 40, 42–44, 46–47, 49, 53, 57, 61, 65–67, 69, 71, 73, 75, 77, 84–85, 88, 90–94, 96–97, 99–100 (numeracja od 1). Poprawiono odwrócone działanie zabezpieczenia kasety przed nagraniem, rozróżnienie czyszczenia i demagnetyzacji głowic, podłączenie adaptera samochodowego oraz pytania z wieloma poprawnymi odpowiedziami. Doprecyzowano Bunny obu producentów, nazewnictwo złączy, radia, formatu kasety i usterek dźwięku. Pytania z niepełnym lub samonaprowadzającym tropem oraz powtórzone pytanie o maskotkę przeredagowano; w części zmieniono opcje i klucze.

Wybrane źródła:

- [Instrukcja magnetofonu Yamaha KX-330](https://manuals.plus/m/38116a7c490fe0c168b129799693cfee514323f8ae1c1e56aca648254c613594) – wypustki chroniące nagranie i przywracanie możliwości zapisu.
- [Tascam 122MKIII, instrukcja w zbiorach Library of Congress](https://tile.loc.gov/storage-services/master/mbrs/recording_preservation/manuals/Tascam%20TEAC%20122MKIII%20Master%20Cassette%20Deck.pdf) – oddzielne procedury czyszczenia i demagnetyzacji.
- [Sony, historia urządzeń osobistego audio](https://www.sony.com/en/SonyInfo/CorporateInfo/History/sonyhistory-e.html) – model Walkman TPS-L2 i historia marki.
- [Energizer Bunny](https://energizer.com/energizer-bunny/) i [Duracell Bunny](https://www.duracell.co.uk/help/bunny/) – różne maskotki reklamowe.
- [Smithsonian, reklama Memorex](https://www.si.edu/object/archives/components/sova-nmah-ac-0584-ref1707) – hasło reklamowe.
- [Instrukcja serwisowa Aiwa HS-P2/P02](https://www.manualslib.com/manual/4232679/Aiwa-Hs-P2.html) – identyfikacja modelu osobistego odtwarzacza.

Ograniczenia: wymienione źródła dokumentują wybrane poprawki, a nie każdy fakt w 100 pozycjach. Sprzęt i nośniki różnią się zależnie od modelu, materiału i rynku; przegląd nie obejmował fizycznego testu urządzeń ani testu z graczami.

Walidacja: `python3 scripts/audit_questions.py`; osobno sprawdzono liczbę pytań, unikalność opcji, obecność kluczy w opcjach oraz `git diff --check`.

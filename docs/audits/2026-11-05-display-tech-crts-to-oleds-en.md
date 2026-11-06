# Audyt: display_tech_crts_to_oleds_en

Data: 2026-11-05. Przejrzano opis oraz 100 pytań wraz z wariantami, kluczem i wyjaśnieniami. Numeracja dotyczy pozycji w tablicy `questions`, liczonej od 1. Zmieniono 60 pozycji: 1, 3, 5–9, 11, 13, 14, 19, 20, 23, 25–27, 31, 33–38, 40, 43, 44, 48, 49, 52–54, 57–60, 63, 64, 66–68, 70–76, 78–80, 82, 84, 85, 87–90, 94–96. Usunięto stare metadane weryfikacji zmienionych pytań. Opis pozostawiono, indeksu nie edytowano.

Najważniejsze poprawki:

- 7: MicroLED może się starzeć; usunięto nieuzasadnione stwierdzenie o całkowitej odporności na degradację i utrwalanie obrazu.
- 19, 20, 80: DVI może przenosić sygnał analogowy zależnie od wersji; MIPI DSI bywa używane do ekranów laptopów, więc usunięto je jako konkurencyjną poprawną odpowiedź w pytaniu o eDP.
- 25, 31, 34, 49, 68, 72, 88: poprawiono niejednoznaczne odpowiedzi lub relacje między pojęciami. Lampa neonowa też jest wyładowcza; podświetlenie full-array nie musi mieć lokalnego wygaszania; PenTile i Diamond Pixel nie są niezależnymi alternatywami; adresowanie pasywne też pozwala wybierać piksele.
- 44, 54, 82, 84, 85: sprecyzowano działanie CRT, ekranowanie i selekcję wiązek. VFD używa elektronów emitowanych przez rozgrzaną katodę w próżni i luminoforu, a nie wyładowania gazowego.
- 59–60: G-SYNC nie wymaga zawsze osobnego modułu sprzętowego; wyjaśniono znaczenie FreeSync i odpowiednich protokołów zmiennego odświeżania.
- 70–71: rozróżniono częstotliwość pól od klatek i usunięto nieuzasadnione twierdzenie o przewadze rozdzielczości czasowej skanowania progresywnego.
- 94–95: materiał emisyjny OLED może składać się z małych cząsteczek, a nie tylko polimerów; nieskończony kontrast jest wynikiem idealnego pomiaru i zależy od warunków obserwacji.
- W pozostałych pozycjach ograniczono nadmierne uogólnienia i poprawiono opisy fizyki, warstw paneli, charakterystyk kolorów, typów technologii i nazewnictwa.

Źródła przy rozstrzyganiu spornych kwestii:

- [NVIDIA: G-SYNC w zintegrowanych układach scaler, 2026](https://www.nvidia.com/en-au/geforce/news/g-sync-pulsar-gaming-monitors-available-january-7-2026/) oraz [NVIDIA: wymagania i G-SYNC Compatible](https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/Display/Variable_Refresh_Rate.htm) — 59–60.
- [AMD: FreeSync i protokoły](https://www.amd.com/en/products/graphics/technologies/freesync.html) — 60.
- [MIPI Alliance: Display Serial Interface](https://www.mipi.org/specifications/dsi) — 80.
- [Noritake: zasada działania VFD](https://www.noritake-elec.com/technology/general-technical-information/vfd-operation) — 54.
- [US EPA: budowa CRT i ochrona przed promieniowaniem](https://www.epa.gov/sites/default/files/2015-04/documents/ch-1.pdf), [EPA: szkło lejkowe](https://www.epa.gov/hw/cathode-ray-tubes-crts) oraz [Sony: monitor FD Trinitron z aperture grille](https://www.sony.com/ja/SonyInfo/News/Press/199803/98-025/) — 36, 43–44, 82–85.
- [US Department of Energy: podstawy OLED](https://www.energy.gov/cmei/ssl/oled-basics) oraz [DOE: materiały i kierunki badań OLED](https://www.energy.gov/cmei/ssl/articles/solution-processed-oled-lighting-devices-using-supramolecular-aggregates-pigments) — 58, 78, 94.
- [DOE: biała dioda OLED z filtrami i QD-OLED](https://www.energy.gov/sites/default/files/2021/02/f82/ssl-rd21-ma-qd.pdf) oraz [DOE: emisja kropek kwantowych](https://www.energy.gov/sites/default/files/2022-02/ssl-rd22_antoniadis_diffuse.pdf) — 27, 75.

Granice weryfikacji: wszystkie pola oceniono pod kątem merytorycznym i jednoznaczności, lecz nie każdy szczegół pozostałych bez zmian pytań porównano osobno ze źródłem pierwotnym. Źródła producentów dokumentują deklarowaną architekturę i funkcje, które mogą się różnić między modelami i zmieniać w czasie.

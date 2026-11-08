# Przegląd: Militaria, broń i pojazdy wojskowe (PL)

Zakres: opis oraz wszystkie 100 pytań, warianty odpowiedzi, klucze i oba wyjaśnienia paczki `databases/categories/militaria_bro_i_pojazdy_wojskowe_pl.json`. Poprawiono 46 rekordów, zachowując ich liczbę. Opis pozostał bez zmian. Stan przeglądu: 8 listopada 2026 r.

Usunięto niejednoznaczności m.in. przy broni japońskiej, materiałach osłonowych, machinach miotających, wyrzutniach BM-13, kopii i lancy, a także czołgach Churchill i Matilda. Doprecyzowano wkład Colossusa w analizę szyfru Lorenza, projektowy charakter PL-01, historię Jeepa, zróżnicowanie 7TP oraz związek pancerza i wykrywalności B-2. Poprawiono błędne uogólnienia o przetrwalnikach wąglika, nazwie blitzkrieg, sygnaturze magnetycznej, nokto- i termowizji. Pytania zachowano na poziomie historii i identyfikacji sprzętu.

Wybrane źródła:

- [National Museum of the U.S. Air Force: F-22](https://www.nationalmuseum.af.mil/Visit/Museum-Exhibits/Fact-Sheets/Display/Article/196040/AFmuseum/lockheed-martin-f-22a-raptor/) oraz [B-2](https://www.nationalmuseum.af.mil/Visit/Museum-Exhibits/Fact-Sheets/Display/Article/195832/USAFmuseum/northrop-b-2-spirit/) — klasyfikacja samolotów i obniżona wykrywalność.
- [The Tank Museum: Matilda II](https://tankmuseum.org/article/vj-day-2025) — opancerzenie i rola czołgu piechoty.
- [IPN: Marian Rejewski i Enigma](https://ipn.gov.pl/pl/dla-mediow/komunikaty/175923%2C90-lat-temu-Polacy-zlamali-szyfr-Enigmy.html) oraz [Bletchley Park: Colossus i Lorenz](https://bletchleypark.org.uk/wp-content/uploads/2023/10/Bletchley-Park-and-AI.pdf) — różne etapy prac kryptologicznych.
- [CDC: przetrwalniki wąglika](https://www.cdc.gov/mmwr/preview/mmwrhtml/rr5906a1.htm) — możliwość długiego przeżycia przetrwalników w glebie.
- [U.S. Naval Institute: sygnatury okrętów](https://www.usni.org/magazines/proceedings/2017/july/rethink-mine-countermeasures) — ograniczanie sygnatury magnetycznej.

Kontrola lokalna: 100 rekordów, po cztery różne opcje, klucz obecny w opcjach, wymagane pola tekstowe niepuste i brak identycznych treści pytań. Globalny `python3 scripts/audit_questions.py --json` wykazał podczas równoległych prac jeden błąd dopasowania odpowiedzi w innej paczce `pionierzy_i_kroki_milowe_nauki_pl`, pytanie 46; nie zgłosił problemu w tej paczce. Informację przekazano koordynatorowi.

Ograniczenia: klasyfikacje broni i nazewnictwo historyczne bywają płynne, a źródła wymieniono wybiórczo, bez oddzielnego przypisu do każdej pozycji. Opis sprzętu nie jest dokumentacją techniczną ani kompletną historią konstrukcji.

Zmienione rekordy według kolejności w pliku: 1, 6, 9, 11, 12, 15, 17, 20, 21, 25, 26, 28, 31, 34, 37, 41, 43, 45, 47, 48, 49, 50, 52, 54, 55, 58, 63, 64, 66, 67, 69, 71, 73, 75, 76, 77, 79, 85, 89, 90, 91, 92, 94, 98, 99, 100.

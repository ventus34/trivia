# Przegląd merytoryczny: Popkultura

Data: 2026-11-08. Przejrzano opis oraz wszystkie 160 pytań, ich opcje, klucze i oba wyjaśnienia w `databases/categories/popkultura_pl.json`. Opis prawidłowo oddaje zakres paczki i pozostał bez zmian; liczba pozycji także pozostała bez zmian. Z poprawionych rekordów usunięto dawne znaczniki automatycznej weryfikacji.

Poprawiono pozycje 2–3, 5, 10–12, 14–17, 21, 24, 29–32, 36, 39, 41, 43–44, 48–49, 51–52, 54, 63–64, 66, 70, 75, 77, 83, 88, 92, 94, 97–98, 100, 106–107, 109, 112–113, 118–119, 126, 130–132, 135–136, 140, 143, 145, 148–149, 150–153 i 157–158 (numeracja od 1). Doprecyzowano m.in. autorstwo Spider-Mana, wydarzenia z „Seksmisji”, „Chłopaki nie płaczą”, czas trasy The Eras Tour, nagrodę Lombardu w Opolu, historię TikToka, zasady Go oraz sytuację Harry’ego jako niezamierzonego nośnika fragmentu duszy. Usunięto nieuzasadnione rankingi, nieścisłości w grach i pytania oparte na błędnych założeniach. W przebudowanych pytaniach zmieniono niektóre opcje i klucze.

Wybrane źródła:

- [Stowarzyszenie Filmowców Polskich, „Chłopaki nie płaczą”](https://www.sfp.org.pl/film%2C1589%2C1%2CChlopaki-nie-placza.html) – reżyseria i zarys fabuły.
- [Dzieje.pl, Jerzy Stuhr](https://dzieje.pl/postacie/stuhr-jerzy-1947-2024) – Maks i cytat z „Seksmisji”.
- [Miasto Opole, historia festiwalowej nagrody](https://www.opole.pl/de/node/10179) – drugie miejsce „Szklanej pogody” w konkursie Premiery.
- [Marvel, współtwórcy Spider-Mana](https://www.marvel.com/comics/guides/546/stan-leeSteve) – Stan Lee i Steve Ditko.
- [TikTok, połączenie z Musical.ly](https://newsroom.tiktok.com/musical-ly-and/?lang=en) – połączenie ogłoszone w 2018 roku.
- [TVP Szczecin, nagranie „Ale urwał”](https://szczecin.tvp.pl/57865882/ale-urwal-12-lat-pozniej) – okoliczności i data zdarzenia.

Ograniczenia: powyższe źródła dokumentują wybrane istotne poprawki, nie wszystkie 160 pozycji. Fabularne szczegóły mogą różnić się między wersjami dzieł, a popularność i rankingi z czasem się zmieniają. Nie przeprowadzono testu z graczami.

Walidacja: `python3 scripts/audit_questions.py` bez błędów; sprawdzono liczbę 160 pozycji, unikalność opcji i obecność odpowiedzi w opcjach oraz `git diff --check`.

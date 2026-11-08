# Przegląd merytoryczny: Słynne cytaty z hollywoodzkich hitów

Data: 2026-11-08. Przejrzano opis i wszystkie 100 pytań, opcje, klucze oraz oba wyjaśnienia w `databases/categories/synne_cytaty_z_hollywoodzkich_hitw_pl.json`. Liczbę pytań zachowano. Opis uaktualniono i zsynchronizowano z odpowiednim wpisem indeksu; w zmienionych rekordach usunięto dawne znaczniki automatycznej weryfikacji.

Zmieniono pozycje 1–2, 4, 6–7, 9, 11–12, 14, 17, 19, 21–22, 25, 27–30, 33, 35, 38, 41, 43, 45, 47, 50, 53–54, 57–59, 63–66, 70, 74, 79, 81–82, 84, 88, 93, 95–96 i 98 (numeracja od 1). Poprawiono klucz pytania o Paryż w „Casablance”, odkrycie Lili w „Psychozie” i polski głos Shreka. Zastąpiono błędnie przypisane lub niemożliwe do zweryfikowania sceny, w tym powitanie Lectera, opis zawartości walizki z „Pulp Fiction” oraz nieistniejącą dosłowną kwestię o tytule „Aż poleje się krew”. Doprecyzowano różnicę między filmowym a autentycznym meldunkiem Apollo 13. W przebudowanych pytaniach odpowiednio zmieniono opcje i klucze.

Wybrane źródła:

- [American Film Institute, zestawienie cytatów](https://www.afi.com/afis-100-years-100-movie-quotes/) – „Casablanca”, „Przeminęło z wiatrem” i ich kwestie.
- [American Film Institute, katalog „Psychozy”](https://catalog.afi.com/Film/53260-PSYCHO?cp=1&cxt=Filmography1&pos=0&sid=05f0bf97-6bc0-48df-ac67-6ecf9164533c&sr=2.2939005) – odkrycie Lili i przebieg finału.
- [Filmweb, polski dubbing „Shreka”](https://www.filmweb.pl/film/Shrek-2001-9509/cast/dubbing_pl) – Zbigniew Zamachowski jako Shrek i Jerzy Stuhr jako Osioł.
- [NASA, oryginalny meldunek Apollo 13](https://www.nasa.gov/history/houston-weve-had-a-problem/) – komunikat Jacka Swigerta i jego faktyczne brzmienie.
- [StarTrek.com, geneza wolkańskiego gestu](https://www.startrek.com/news/guest-blog-nimoy-revisits-the-creation-of-the-vulcan-salute) – Leonard Nimoy, Spock i pozdrowienie.
- [Academy Awards Database, „Rocky”](https://awardsdatabase.oscars.org/search/getresults?query=%257B%2522FilmTitle%2522%253A%2522Rocky%2522%252C%2522Sort%2522%253A%25222-Film%2520Title-Alpha%2522%252C%2522AwardShowNumberFrom%2522%253A0%252C%2522AwardShowNumberTo%2522%253A0%252C%2522Search%2522%253A30%257D) – Talia Shire jako Adrian.

Ograniczenia: źródła dokumentują wybrane korekty, nie każdą z 100 pozycji. Polskie wersje dialogowe mogą różnić się między dubbingiem, lektorem i napisami, a zbiór zawiera też pytania o postacie i sceny. Nie przeprowadzono testu z graczami.

Walidacja: `python3 scripts/audit_questions.py` bez błędów; dodatkowo sprawdzono liczbę pytań, unikalność opcji, przynależność kluczy i `git diff --check`.

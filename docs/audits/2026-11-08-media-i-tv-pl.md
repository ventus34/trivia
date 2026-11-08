# Przegląd merytoryczny: Media i TV

Data: 2026-11-08. Przejrzano opis pliku `databases/categories/media_i_tv_pl.json` oraz wszystkie 100 pytań, opcje, klucze i oba wyjaśnienia. Zachowano 100 pozycji. Opis uaktualniono i zsynchronizowano w odpowiednim wpisie `databases/list.json`; stare znaczniki automatycznej weryfikacji usunięto ze zmienionych rekordów.

Zmieniono pytania lub wyjaśnienia w pozycjach 1, 4, 6–8, 10, 14–15, 17, 20–21, 23, 25, 30, 34, 41, 45, 47, 49–51, 53–57, 59, 68, 70, 74–75, 78, 83–84, 86–89, 94, 96, 99–100 (numeracja od 1). Skorygowano między innymi nazwisko Pana Lektora w *Hotelu Paradise*, pochodzenie wynalazcy tarczy Nipkowa, wczesne formaty Sony, kodek polskiej telewizji DVB-T, organizatora Złotych Globów, Sandomierz w *Ojcu Mateuszu* i doniesienia o panice po *Wojnie światów*. Doprecyzowano status *Lilyhammer* oraz założenia pytań o Westeros i Netflix. Pytania 49–51, 54–57, 59 i 96 zastąpiono nowymi pytaniami o inne fakty, ponieważ powielały inne pozycje paczki; odpowiednio zmieniono klucze. W pytaniu 17 poprawiono błędny klucz i jedną z opcji.

Wybrane źródła:

- [TVN, Pan Lektor z Hotelu Paradise](https://dziendobry.tvn.pl/gwiazdy/pan-lektor-z-hotel-paradise-nie-mowi-w-programie-swoim-glosem-st8113650) – Bartosz Łabęcki.
- [Netflix, dziesięciolecie Lilyhammer](https://about.netflix.com/news/celebrating-10-years-of-netflix-series-with-lilyhammer) – pozycja serialu w historii Netflixa i wcześniejsza norweska emisja.
- [Sony, historia systemu U-matic](https://www.sony.com/en/SonyInfo/CorporateInfo/History/SonyHistory/1-05.html) oraz [historia Betamax](https://www.sony.com/en/SonyInfo/CorporateInfo/History/SonyHistory/2-06.html) – chronologia formatów wideo.
- [UKE, parametry odbiorników DVB-T](https://archiwum.uke.gov.pl/aktualnosci/biezace-informacje/komunikaty/parametry-techniczne-odbiornikow-tv-cyfrowej%2C1940.html) – stosowany w Polsce MPEG-4 AVC.
- [Golden Globes, odpowiedzi na pytania](https://goldenglobes.com/faqs/) – obecny status HFPA i nagród.
- [Library of Congress, Wojna światów](https://blogs.loc.gov/loc/2016/10/lcm-page-from-the-past-war-of-the-worlds/) – relacje prasowe i przekonanie o masowej panice.

Ograniczenia: zestaw sprawdzono w całości, ale podane źródła dokumentują wybrane istotne poprawki, nie każdy z osobna fakt w 100 pozycjach. Oferta i gospodarze programów mogą się zmieniać; w pytaniach wrażliwych na czas w miarę możliwości wskazano datę. Nie przeprowadzono testów z graczami.

Walidacja: `python3 scripts/audit_questions.py`, sprawdzenie liczby pozycji i poprawności kluczy oraz `git diff --check`.

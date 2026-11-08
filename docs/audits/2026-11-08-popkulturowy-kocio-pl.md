# Przegląd merytoryczny: Popkulturowy kocioł

Data: 2026-11-08. Przejrzano opis i wszystkie 100 pytań, odpowiedzi, klucze oraz oba wyjaśnienia w `databases/categories/popkulturowy_kocio_pl.json`. Liczbę pytań zachowano; opis poprawnie oddaje zakres i nie wymagał synchronizacji indeksu. W zmienionych rekordach usunięto wcześniejsze znaczniki automatycznej weryfikacji.

Poprawiono pozycje 4, 6, 10–11, 13, 15, 22, 24, 29, 31, 33–35, 38, 43–44, 46–47, 49–50, 53, 55–58, 60, 62, 69–70, 73–74, 77, 79–80, 84–86, 92–95 i 97 (numeracja od 1). Poprawki obejmują m.in. współtwórców „Ulicy Sezamkowej”, genezę techniki Ben-Day, księżyc LV-426, literackiego autora Shreka i sprzeczne twierdzenie o kolorze fikcyjnego produktu z „Breaking Bad”. Zmieniono pytania o Monopoly, różne edycje i niejednoznaczne miejsca akcji. Powtarzające się pytania o Poké Ball, Narnię i Jima Hensona zastąpiono innymi faktami, odpowiednio zmieniając opcje i klucze.

Wybrane źródła:

- [Sesame Workshop, historia organizacji i programu](https://sesameworkshop.org/about-us/mission-and-history/) – Joan Ganz Cooney, Lloyd Morrisett oraz udział Muppetów.
- [MoMA, Ben-Day dots](https://www.moma.org/collection/terms/ben-day-dots) i [MoMA, Roy Lichtenstein](https://www.moma.org/artists/3542-roy-lichtenstein) – pochodzenie techniki i jej zastosowanie przez malarza.
- [Library of Congress, Elizabeth Magie](https://blogs.loc.gov/inside_adams/2022/09/elizabeth-j-magie/) – The Landlord’s Game i historia Monopoly.
- [Macmillan, książka „Shrek!” Williama Steiga](https://us.macmillan.com/books/9781466814509/shrek/) – literackie pochodzenie postaci.
- [IPN, gra planszowa „Kolejka”](https://edukacja.ipn.gov.pl/edu/materialy-edukacyjne/gry/gry-planszow/93066%2CKolejka.html) – kontekst gry i zdobywanie towarów.

Ograniczenia: źródła wspierają wybrane poprawki, nie wszystkie fakty w 100 pozycjach. Fabuła i nazewnictwo mogą się różnić między adaptacjami i wydaniami. Nie przeprowadzono testu z graczami.

Walidacja: `python3 scripts/audit_questions.py` bez błędów strukturalnych; sprawdzono liczbę pytań, unikalność opcji i przynależność kluczy oraz `git diff --check`.

# Przegląd: Polskie Ślady na Mapie Europy

Zakres: opis paczki `databases/categories/polskie_lady_na_mapie_europy_pl.json` oraz wszystkie 100 pytań, warianty, klucze i oba wyjaśnienia. Poprawiono lub zastąpiono 68 rekordów; liczba pytań i opis pozostały bez zmian. Stan przeglądu: 8 listopada 2026 r.

Poprawiono m.in. pomnik gen. Maczka w Edynburgu, historię własności Montrésor, położenie i status Muzeum Polskiego w Rapperswilu, niepewne miejsce narodzin Mickiewicza, biografie Paderewskiego, Malinowskiego i Hanny Hirszfeldowej, losy Lelewela w Brukseli oraz błędne przypisanie wyprawy Batorego. Skorygowano nazwę Styrczy i zbędne kategoryczne stwierdzenia o autorstwie, lokalizacji czy narodowości. Niepotwierdzone szczegóły zastąpiono pytaniami o możliwe do udokumentowania wydarzenia lub osoby; tam, gdzie temat źródłowy nie dotyczył polskich śladów, użyto innych udokumentowanych przykładów.

Wybrane źródła:

- [IPN: pomnik gen. Maczka w Edynburgu](https://szlakinadziei.ipn.gov.pl/sn/aktualnosci/112311%2CUpamietnienie-gen-Stanislawa-Maczka-w-Szkocji.html) oraz [IPN: Paderewski zmarł w Nowym Jorku](https://ipn.gov.pl/pl/historia-z-ipn/archiwum/146270%2C80-rocznica-smierci-Ignacego-Jana-Paderewskiego.html).
- [Archiwa Państwowe: Muzeum Polskie w Rapperswilu](https://archiwa.gov.pl/150-lat-muzeum-polskiego-w-rapperswilu/) oraz [Muzeum Polskie: nowy rozdział](https://polenmuseum.ch/en/news/a-new-chapter-in-the-history-of-the-museum) — historia muzeum i zmiana siedziby.
- [Muzeum i Archiwum Polskie na Zachodzie: Montrésor](https://mabpz.org/instytucje/zamek-montresor) — nabycie zamku i rodzina Branickich.
- [Ambasada RP w Peru: Ernest Malinowski](https://www.gov.pl/web/peru/wirtualna-wystawa-poswiecona-ernestowi-malinowskiemu---budowniczemu-kolei-transandyjskiej) — kolej transandyjska i śmierć w Limie.
- [Muzeum POLIN: Hanna Hirszfeldowa](https://sztetl.org.pl/miejscowosci/w/18-warszawa/106-biogramy/197345-hirszfeldowa-hanna) — działalność lekarki i jej praca w szpitalu polowym.
- [Polski słownik biograficzny: Joachim Lelewel](https://www.ipsb.nina.gov.pl/a/biografia/joachim-jozef-benedykt-lelewel-1786-1861-historyk-polityk-etc) — pobyt w Brukseli i odmowa płatnej profesury.
- [Archiwum Państwowe w Łodzi: Stefan Batory](https://www.lodz.ap.gov.pl/co-robimy/stefan-batory) — odzyskanie Połocka w 1579 r.
- [Instytut POLONIKA: Styrcza](https://sec.polonika.pl/programy/programy-grantowe/programy-grantowe-instytutu/styrcza-moldawia) — polska wieś w Mołdawii.
- [UNESCO: Nieśwież](https://whc.unesco.org/en/list/1196/) i [dokumentacja zamku w Mirze](https://whc.unesco.org/document/285) — dwa odrębne obiekty związane z Radziwiłłami.
- [Instytut Polski w Kijowie: Podhorce](https://instytutpolski.pl/kyiv/pl/2019/01/03/zamek-w-podhorcach/) oraz [Muzeum Narodowe w Warszawie](https://cyfrowe.mnw.art.pl/pl/eseje/180) — dzieje zamku; źródła różnią się co do osoby inicjatora, dlatego pytanie dotyczy rodu.
- [Archiwa Państwowe: rzymski pomnik Kopernika](https://www.szukajwarchiwach.gov.pl/en/web/guest/jednostka/-/jednostka/14684832?refererPlid=20136), [Ambasada RP w Portugalii: polonika](https://www.gov.pl/web/portugalia/polonica-w-portugalii) oraz [PAN: Stacja Naukowa w Paryżu](https://paris.pan.pl/lata-1893-1918/) — wybrane ślady i instytucje.

Weryfikacja: struktura JSON, 100 rekordów, po cztery różne opcje, klucz występujący w opcjach, niepuste wymagane pola i brak identycznych pytań. Projektowy `python3 scripts/audit_questions.py --json` zwrócił brak problemów dla 229 paczek.

Ograniczenia: lista źródeł jest wyborem, a nie przypisem do każdego pytania. Część szczegółów biograficznych i historycznych jest dyskusyjna; przy narodzinach Mickiewicza pozostawiono informację o sporze. Pytania o działające instytucje i upamiętnienia mogą wymagać ponownej aktualizacji po zmianach organizacyjnych.

Zmienione rekordy według kolejności pliku: 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 22, 23, 25, 26, 29, 31, 32, 33, 35, 36, 37, 38, 40, 43, 46, 47, 50, 52, 55, 59, 61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 84, 86, 88, 89, 90, 91, 92, 93, 94, 96, 97, 98, 100.

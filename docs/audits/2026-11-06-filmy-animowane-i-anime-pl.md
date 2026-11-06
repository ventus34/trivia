# Audyt paczki „Filmy Animowane i Anime” (PL)

Przegląd 6 listopada 2026 r. Przeczytano opis oraz wszystkie 100 pytań, cztery opcje, klucze i oba wyjaśnienia. Źródłowo sprawdzono wybrane fakty i niejasności, nie każdą informację poboczną w każdym dystraktorze. Zmieniono 20 rekordów: 5, 14, 17–18, 26, 30–31, 34–35, 41, 48, 51, 62–63, 67, 87, 89–90, 94 i 100. Uogólniono opis, by obejmował rozmaite studia animacji oraz anime. Usunięto stare znaczniki `last_verified_at` i `verifying_model` z pakietu i zmienionych rekordów; wskazywały weryfikację sprzed tych poprawek.

Nowy opis zsynchronizowano również z wpisem w `databases/list.json`.

## Najważniejsze poprawki

- 5 i 17: poprawiono mylące wyjaśnienia, odpowiednio o pochodzeniu postaci oraz o nauce Tanjiro. Pytanie 17 rozróżnia jego trening Oddechu Wody u Urokodakiego od przekazywanej w rodzinie Hinokami Kagury.
- 14: usunięto `Iago` jako drugi wariant imienia polskiej wersji Jago; w jego miejsce dodano Dżafara i poprawiono wyjaśnienie dystraktorów.
- 18: pierwotne pytanie błędnie przypisywało imię Hipotolit literackiemu oryginałowi Collodiego. Pytanie dotyczy teraz polskiego dubbingu filmu Disneya z 1940 r., w którym świerszcz nazywa się Hipolit Świerszcz.
- 30, 87 i 94: pytania prosiły o nazwisko, choć odpowiedzi podawały pełne imiona i nazwiska. Zmieniono ich brzmienie; wyjaśnienie przy Kanekim poprawiono także językowo.
- 31: nazwę robota z filmu *WALL·E* zapisano zgodnie z oryginałem jako EVE i doprecyzowano misję poszukiwania życia roślinnego.
- 34: odpowiedź zmieniono na liczbę mnogą „Diabelskie owoce”, zgodnie z treścią pytania.
- 35: osadzono rolę Asha w 25-sezonowej serii, ponieważ późniejsza seria *Pokémon Horizons* ma nowych protagonistów.
- 41: użyto polskiego tytułu „Vaiana” z dopiskiem oryginalnego tytułu „Moana”.
- 48: poprawiono pisownię nazwy systemu z *Psycho-Pass* na „Sibyl System”.
- 51: nieweryfikowane twierdzenie o wzroście i wieku Kevina zastąpiono potwierdzoną rolą lidera głównej trójki Minionków.
- 62: usunięto nieprawdziwe stwierdzenie, że Yukio nie jest synem Szatana; jest bratem bliźniakiem Rina. Wyjaśnienie rozróżnia teraz jego, Shiro i Mephisto.
- 63: Anchor i Chum również należą do grupy rekinów próbujących nie jeść ryb. Pytanie dotyczy teraz Bruce’a jako lidera tej grupy.
- 67: poprawiono pisownię nazwy Stitch.
- 89–90: doprecyzowano, że Gojo jest najsilniejszym współczesnym czarownikiem, oraz oddzielono miasto Duloc od zamku Farquaada.
- 100: poprzednie pytanie dopuszczało też Claude’a Fausta jako demon-kamerdynera. Teraz pyta o demona związanego kontraktem z Cielem; wyjaśnienie wskazuje, że Claude służy Aloisowi.

## Źródła

- [Disney Polska: Hipolit Świerszcz w polskiej wersji filmu „Pinokio” z 1940 r.](https://press.disney.pl/aktualnosci/justyna-steczkowska-zaspiewala-hymn-disneya-milion-gwiazd-na-niebie-lsni-do-filmu-pinokio-juz-dostepnego-na-disney).
- [Disney: EVE jako robot poszukujący na Ziemi roślinności](https://movies.disney.com/wall-e).
- [Polski pressbook filmu „Aladyn”: papuga Jago](https://www.kinoinfo.pl/pressbook/15937_Aladyn_PRESSBOOK.pdf).
- [Oficjalna strona „Psycho-Pass: The Movie” we Fuji TV: zapis „Sibyl System”](https://www.fujitv.com/movie/psycho-pass-the-movie/).
- [Illumination: Kevin jako lider grupy w filmie „Minionki”](https://stage.illumination.com/movie/minions/).
- [Pixar: Bruce przewodzi grupie rekinów; Anchor i Chum są jej członkami](https://www.pixar.com/finding-nemo).
- [Crunchyroll: Rin i Yukio jako synowie Szatana](https://www.crunchyroll.com/news/features/2024/1/13/what-is-blue-exorcist-kyoto-saga-manga-canon-season-explained).
- [Crunchyroll: Gojo jako najsilniejszy czarownik współczesnej ery](https://www.crunchyroll.com/id/news/deep-dives/2024/1/3/jujutsu-kaisen-season-2-ending-explained).
- [Disney Polska: polski tytuł „Vaiana”](https://press.disney.pl/csr/vaiana-film-premiera-disney%2B).
- [Oficjalna strona „One Piece”: opis Diabelskich Owoców](https://one-piece.com/devilfruit/).
- [Pokémon: podsumowanie 25-sezonowej podróży Asha i nowa seria „Pokémon Horizons”](https://press.pokemon.com/en-AU/POKEMON-REVEALS-NEW-ANIMATED-SERIES-AND-STORYLINE).
- [Oficjalna strona „The Rising of the Shield Hero”: Raphtalia jako raccoon demi-human](https://shieldhero-anime.jp/en/3rd/).
- [Pixar: Carl Fredricksen jako emerytowany sprzedawca balonów](https://www.pixar.com/upfilm).
- [VIZ: Ken Kaneki jako pół-ghoul](https://www.viz.com/tokyo-ghoul).
- [Oficjalna strona „Black Butler”: Sebastian jako kamerdyner Ciela](https://blackbutler-anime.com/introduction/).
- [BFI: Shotaro Kaneda jako lider gangu w *Akirze*](https://www.bfi.org.uk/features/30-years-akira-teenage-kicks-anime-style).

## Kontrola i ograniczenia

Liczba pytań wynosi nadal 100; w zmienionych rekordach odpowiedź jest obecna wśród czterech różnych opcji. `python3 scripts/audit_questions.py --json` nie zgłosił problemów strukturalnych (229 paczek, 24 285 pytań). Po zmianie opisu `/root` zsynchronizował wpis w `databases/list.json`; indeksu nie edytowałem. `git diff --check` nie wykazał problemów formatowania. Walidacja strukturalna i wskazane źródła nie potwierdzają niezależnie wszystkich pozostałych twierdzeń i wszystkich dystraktorów w 100 rekordach.

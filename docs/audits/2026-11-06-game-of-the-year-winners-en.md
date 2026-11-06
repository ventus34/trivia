# Audyt paczki Game of the Year Winners (EN)

Data: 6 listopada 2026 r. Poprzedni agent przejrzał paczkę i rozpoczął korekty, ale nie ukończył raportu. Przekazał, że sprawdzał lata ceremonii i kategorie w oficjalnych archiwach BAFTA, D.I.C.E., The Game Awards, Steam i Japan Game Awards; szczegółowego wykazu jego indywidualnych sprawdzeń nie zachowano. W obecnym pliku 76 z 98 rekordów różni się od HEAD. Nie oznacza to, że 76 faktów albo wszystkie 98 rekordów zostało niezależnie zweryfikowane przez autora tego raportu.

Przy przejęciu przejrzano zmienione pytania, opcje i wyjaśnienia oraz poniższą próbkę sprawdzono samodzielnie w oficjalnych źródłach. Opis odpowiada reprezentowanym nagrodom; opis i liczba 98 zgadzają się z indeksem, którego nie edytowano. Poprzednie metadane weryfikacji na poziomie paczki usunięto po zmianach. Numery w raporcie są jednobazowe.

## Dodatkowe poprawki po przejęciu

- 70 zastąpiono powtórzenie pytania 40: What Remains of Edith Finch otrzymało BAFTA Best Game w 2018. [BAFTA: wyniki 2018](https://www.bafta.org/media-centre/press-releases/winners-announced-for-the-british-academy-games-awards-in-2018/).
- 81 zastąpiono powtórzenie pytania 13: The Legend of Zelda: Tears of the Kingdom otrzymało Grand Award Japan Game Awards 2024. [Organizator CESA](https://awards.cesa.or.jp/2024/en/year/prize/01.html).
- 91 zastąpiono powtórzenie pytania 66: Hades II zdobyło Action Game of the Year na D.I.C.E. 2026. [AIAS: wyniki 2026](https://www.interactive.org/awards/2026_dice_awards_winners.asp).
- 57: ranking Giant Bomb określono po prostu jako ranking Game of the Year, a nie pojedynczą listę redakcyjną: [wyniki z podziałem na ogólny ranking i indywidualne wybory](https://giantbomb.com/articles/heres-what-won-goty-2023).
- 72: Hades i Doom Eternal nie były nominowane do głównej nagrody NAVGTR; zamiast tego wskazano ich nominacje w innych kategoriach. [NAVGTR: laureaci i nominowani za 2020](https://navgtr.org/2020-winners/).
- 74: Celeste nie było nominowane do D.I.C.E. Game of the Year 2019, choć wygrało Action Game of the Year. [AIAS: wyniki i nominacje](https://www.interactive.org/awards/2019_22nd_annual_dice_awards.asp).

## Samodzielnie sprawdzona próbka dalszych faktów

- 20: BioShock Infinite – D.I.C.E. Action Game of the Year 2014; The Last of Us – nagroda główna. [Komunikat AIAS](https://www.interactive.org/images/press_release/17th-Annual-DICE-Awards-Winners-FINAL-2-6-14.pdf).
- 21, 25, 73: LittleBigPlanet wygrało ogółem, a Fallout 3 w kategorii RPG w 2009. [Archiwum AIAS](https://www.interactive.org/awards/2009_12th_awards.asp).
- 24: Super Mario Galaxy otrzymało BAFTA Best Game w 2009. [Sprawozdanie BAFTA](https://static.bafta.org/files/annual-report-2009-597.pdf).
- 29: Clair Obscur: Expedition 33 wygrało TGA Game of the Year 2025. [The Game Awards](https://origin-stage.thegameawards.com/news/the-game-awards-2025-breaks-record-171-million-livestreams).
- 30: Diablo IV – D.I.C.E. Online Game of the Year 2024. [AIAS](https://www.interactive.org/awards/award_category_details.asp?idAward=2024&idGameAwardType=79).
- 41: PUBG wygrało Steam Awards 2018; wyniki ogłoszono w następnym roku. [Steam: 2018 Steam Awards](https://store.steampowered.com/steamawards/2018).
- 44: Grand Award Japan Game Awards 2021 przyznano wspólnie Monster Hunter Rise i Ghost of Tsushima; tylko pierwsza z tych gier figuruje w odpowiedziach. [CESA](https://awards.cesa.or.jp/2021/en/prize/).
- 55, 58, 66, 67, 78, 82, 86 i 98: sprawdzono zwycięzców w archiwum BAFTA; w 2023 Vampire Survivors otrzymało Best Game, a God of War Ragnarök głosowaną publicznie EE Game of the Year. [BAFTA: Best Game](https://www.bafta.org/awards/games/best-game/) i [2023 wyniki](https://www.bafta.org/media-centre/press-releases/bafta-announces-the-winners-of-the-2023-bafta-games-awards/).
- 6 i 96: Animal Crossing: New Horizons – Grand Award Japan Game Awards 2020. [CESA](https://awards.cesa.or.jp/2020/en/prize/year/01.html).

## Ograniczenia i walidacja

Próbka nie obejmuje niezależnej ponownej weryfikacji każdego z 98 pytań ani każdego komentarza o nominacjach. Pozostają semantyczne powtórzenia tego samego wyniku mimo różnic w brzmieniu i opcjach, m.in. 6/96, 7/39/94, 9/77, 11/46, 16/62/83, 18/84, 21/73, 22/86, 32/92, 34/97, 52/71 oraz 58/66. Nie usuwano ich w ramach ograniczonego przejęcia poza trzema wskazanymi pozycjami 70, 81, 91. Przy pytaniach o różne nagrody zdobyte przez tę samą grę odrębność kategorii lub organizatora ma znaczenie i nie jest sama w sobie powtórzeniem.

`python3 scripts/audit_questions.py` nie wykrył problemów strukturalnych; `git diff --check` jest czysty. Weryfikacja struktury nie potwierdza prawdziwości każdego wyniku.

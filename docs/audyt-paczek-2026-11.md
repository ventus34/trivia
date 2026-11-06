# Audyt zaindeksowanych paczek — listopad 2026

Audyt trwa. Zakres wyznacza `databases/list.json`: na początku przeglądu 229 paczek i 24 285 pytań. Kontrola `python3 scripts/audit_questions.py` nie wykazała błędów strukturalnych; nie jest ona weryfikacją faktów, jakości dystraktorów ani jednoznaczności pytań. Wyniki przeglądów merytorycznych i ich faktyczny zakres należy dokumentować osobno, bez oznaczania niesprawdzonych paczek jako zweryfikowanych.

Sprawdzono opisy wszystkich wpisów pod kątem oczywistych literówek, języka i zgodności z plikami; nie jest to ocena zgodności każdego opisu z pełną zawartością paczki. Przeglądy pytań oraz ich ograniczenia opisują raporty w `docs/audits/` i `docs/question-audits/`. Paczki bez raportu merytorycznego pozostają do sprawdzenia; sam raport też nie oznacza, że wszystkie tezy potwierdzono źródłowo.

Na koniec tej partii zmian zmodyfikowano 411 rekordów pytań w 19 paczkach (w tym redakcyjne zmiany nazw podkategorii), zachowując 24 285 pytań. Kontrola strukturalna i 46 testów aplikacji przeszły. Do wykonania pozostaje przegląd merytoryczny paczek bez raportu oraz dalsza kontrola źródłowa tam, gdzie raport wskazuje niezweryfikowane tezy.

Aktualizacja 2026-11-06: względem `HEAD` zmieniono rekordy pytań w 55 paczkach (2231 rekordów, licząc również zmiany redakcyjne i metadane), a indeks nadal obejmuje 229 paczek i 24 285 pytań. To liczba edycji, nie liczba pytań zatwierdzonych źródłowo. W chwili tej kontroli zmiany znajdowały się w lokalnym katalogu roboczym i nie były jeszcze commitem; później opublikowano je w commicie `9f4d7d6`. Po ponownej synchronizacji opisów wynik kontroli strukturalnej jest czysty. Część prac subagentów była przerywana limitem i wznawiana; ich dokładny zakres i pozostające wątpliwości zawierają osobne raporty.

Kolejna partia 2026-11-06: poprawiono 288 rekordów pytań w siedmiu paczkach dotyczących Europy, urządzeń wejściowych, cytatów filmowych, fantasy, kina, animacji i filozofii. Dla każdej paczki zapisano raport zakresu i źródeł, a wybrane nowe pytania sprawdzono niezależnie. Kontrola strukturalna objęła cały indeks; 46 testów aplikacji przeszło. Nie wszystkie twierdzenia z tych paczek potwierdzono niezależnie.

Kolejna partia 2026-11-06: zmieniono 327 rekordów w siedmiu paczkach o fizyce, zjawiskach natury, fotografii, nagrodach i kulturze gier, światach gier oraz gatunkach muzycznych. Poprawki obejmują również redakcję i metadane; nie oznaczają potwierdzenia źródłowego każdego twierdzenia. Szczegóły, wybrane źródła oraz granice kontroli zapisano w osobnych raportach, w tym informację o pracach przerwanych limitem. Dalszy przegląd pozostałych paczek trwa.

Kolejna partia 2026-11-06: zmieniono 287 rekordów w siedmiu plikach, w tym sześciu kolejnych paczkach o odkryciach, wodzie, grach i gwarach oraz trzech rekordach w wcześniej opublikowanej paczce o nagrodach gier. Liczba obejmuje także poprawki redakcyjne i metadane. Raporty opisują zakres przeglądów, wybrane źródła i ograniczenia; przegląd pytań nie jest dowodem niezależnej weryfikacji każdego twierdzenia.

Następnie przejrzano paczkę gier planszowych: zmieniono 40 z 97 rekordów i zsynchronizowano opis z indeksem. Niezależna kontrola wskazała kolejne niejednoznaczności; poprawki, źródła i ograniczenia opisano w osobnym raporcie.

Kolejna partia 2026-11-06: poprawiono 313 rekordów w sześciu paczkach o historii gier, elektronarzędziach, średniowieczu, starożytności, historii współczesnej i przebojach radiowych. Dwóm paczkom zsynchronizowano opisy z indeksem. Niektóre przeglądy przerwał limit subagentów; dla elektronarzędzi zapisano częściowy zakres i potrzebę dalszej kontroli. Liczba edycji obejmuje również redakcję i metadane i nie oznacza źródłowego potwierdzenia wszystkich faktów.

Kolejna partia 2026-11-06: przejrzano paczkę o historii po 1945 roku i zmieniono 41 rekordów. Zakres zmian, źródła i ograniczenia opisano w osobnym raporcie; niezależnej kontroli subagenta nie wykonano z powodu limitu.

Kolejna partia 2026-11-06: przejrzano paczkę o hobby, rzemiośle i DIY, zmieniając 47 rekordów; źródła i ograniczenia przedstawiono w osobnym raporcie. Kontrola niezależna była niedostępna z powodu limitu subagentów.

Kolejna partia 2026-11-06: przejrzano paczkę o pojazdach popkultury i zmieniono 32 rekordy. Raport zawiera źródła wybranych poprawek oraz ograniczenia; niezależny przegląd subagenta nie był dostępny z powodu limitu.

Kolejna partia 2026-11-06: przejrzano paczkę o grach niezależnych i zmieniono 34 rekordy. Szczegóły i ograniczenia, w tym brak niezależnej kontroli subagenta z powodu limitu, podano w raporcie.

Kolejna partia 2026-11-06: przejrzano paczkę biograficzną i zmieniono 50 rekordów. Raport podaje źródła oraz ograniczenia; niezależna kontrola subagenta była niedostępna z powodu limitu.

Kolejna partia 2026-11-06: przejrzano paczkę o instrumentach muzycznych i zmieniono 52 rekordy. Źródła wybranych korekt oraz ograniczenia kontroli zapisano w osobnym raporcie; z powodu limitu zabrakło niezależnego przeglądu subagenta.

Kolejna partia 2026-11-06: przejrzano paczkę o memach i historii internetu, zmieniając 41 rekordów. Źródła wybranych poprawek i ograniczenia opisano w raporcie; niezależna kontrola subagenta była niedostępna z powodu limitu.

## Zmiany redakcyjne

- `atrakcje_turystyczne_pl`: poprawiono pisownię dystraktora „Kościoły Artykularne” oraz przetłumaczono nazwę podkategorii „Wonders of the World” na „Cuda świata”; opis w indeksie zsynchronizowano z opisem paczki.
- `wiat_modych_pl`: poprawiono literówkę „Komixt” w podkategorii i w opisach paczki oraz indeksu.

## Przeglądy częściowe

- `zioolecznictwo_i_medycyna_ludowa_pl`: wstępnie przejrzano 100 pytań i objaśnień; poprawiono pozycje 7, 9, 16, 18, 21, 23, 34, 43, 44, 46, 52, 60, 63, 64, 69, 70, 72, 73 i 75. Usunięto dwuznaczności, poprawiono błędny klucz „ziele św. Jana”, nazwę johimby i literówki oraz ograniczono niepoparte twierdzenia medyczne. Pozostałe pytania wymagają dalszej weryfikacji merytorycznej i medycznej; wstępny odczyt nie oznacza ich zatwierdzenia. Źródła: [EMA — glistnik](https://www.ema.europa.eu/en/documents/herbal-report/final-assessment-report-chelidonium-majus-l-herba_en.pdf), [MedlinePlus — bieluń](https://medlineplus.gov/ency/article/002881.htm), [NCCIH — ostropest](https://www.nccih.nih.gov/health/milk-thistle), [NCCIH — żurawina](https://www.nccih.nih.gov/health/cranberry?nav=tw), [NCI — jemioła](https://www.cancer.gov/about-cancer/treatment/cam/hp/mistletoe-pdq), [NCCIH — kurkumina](https://www.nccih.nih.gov/health/cancer-and-complementary-health-approaches-what-you-need-to-know), [EMA — pokrzywa](https://www.ema.europa.eu/en/medicines/herbal/urticae-folium), [EMA — skrzyp](https://www.ema.europa.eu/en/medicines/herbal/equiseti-herba), [NCCIH — detoks](https://www.nccih.nih.gov/health/detoxes-and-cleanses-what-you-need-to-know), [GIS — johimba](https://www.gov.pl/web/gis/komunikat-nie-dla-johimby-lekarskiej-i-przesli-w-zywnosci), [NCCIH — miłorząb](https://www.nccih.nih.gov/health/ginkgo/index.html).

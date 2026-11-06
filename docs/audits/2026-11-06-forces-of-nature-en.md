# Audyt paczki Forces of Nature (EN)

Data: 6 listopada 2026 r. Przejrzano opis oraz wszystkie 100 pytań z opcjami, kluczami i wyjaśnieniami. Skorygowano 47 pozycji: 1, 4, 7–9, 12–13, 17, 22, 30, 32–35, 37–38, 43–44, 46, 49–51, 56, 60, 63–66, 69, 72–73, 75, 78–79, 81, 83, 86–87, 90, 93–100. Nie zmieniono liczby pytań ani opisu, który odpowiada szerokiemu zakresowi paczki. Usunięto wcześniejsze metadane weryfikacji zmienionych pytań i paczki; indeks pozostał bez zmian.

## Najważniejsze poprawki

- 1: określono kształt czerwonych duszków, gdyż inne zjawiska świetlne także występują nad burzami na podobnych wysokościach. 4: kwazar opisano jako aktywne jądro galaktyki, które zawiera supermasywną czarną dziurę.
- 8: entropia nie jest po prostu ilością energii niedostępnej do pracy; pytanie dotyczy równania zmiany entropii dla odwracalnego procesu izotermicznego. 9 i 97: magma występuje także wewnątrz skorupy, a nie wyłącznie pod nią.
- 13, 17, 35: usunięto konkurencyjne lub mylące warianty; uskok to *fault*, podczas gdy *fault line* to jego ślad na powierzchni. 22: sejsmograf rejestruje ruch gruntu, z którego dopiero wyznacza się parametry trzęsienia.
- 30, 32, 34, 37–38, 43–44: skorygowano opis pola elektrycznego, przewodzenia ciepła, siły nośnej, załamania, parowania, zorzy i rozszczepienia. 33: ozon pochłania większość UV-B i praktycznie całe UV-C, nie całe promieniowanie UV.
- 46: praca przy stałej sile jest iloczynem skalarnym siły i przemieszczenia, nie zawsze iloczynem ich wartości. 49–50: odróżniono przepływ ustalony i usunięto adwekcję jako konkurencyjną odpowiedź przy transporcie ciepła ruchem płynu.
- 60: skala Saffira–Simpsona używa maksymalnej trwałej prędkości wiatru; nie klasyfikuje bezpośrednio fali sztormowej i opadów. 63: użyto liczby pojedynczej *quantum* i usunięto błędną sugestię o uniwersalnej minimalnej porcji dowolnej wielkości. 64: La Niña dotyczy anomalii temperatury równikowego Pacyfiku.
- 65–66, 69, 72–73, 75, 78–79, 81, 83, 86–87: doprecyzowano m.in. wypór także w płynącym płynie, maksymalne naprężenie inżynierskie, warunki punktu rosy, energię reakcji fuzji, równowagę i przemianę Curie.
- 90: gujot jest rodzajem góry podmorskiej i stanowił drugą poprawną odpowiedź; zastąpiono dystraktor. 93: superpozycja nie oznacza jednoczesnego zajmowania „wszystkich poprawnych stanów”; podano kombinację stanów w wybranej bazie. 94: kondensat Bosego–Einsteina dotyczy bozonów.
- 95: stała kosmologiczna i energia próżni są możliwymi modelami ciemnej energii, a nie pewnymi błędnymi odpowiedziami; zastąpiono te dwa dystraktory i usunięto stwierdzenie, że natura ciemnej energii jest znaną siłą. 96: akrecja może zachodzić podczas powstawania gwiazdy. 98: zasada Archimedesa obejmuje również gazy. 99: napięcie i tarcie mogą dostarczać siły dośrodkowej. 100: siła odśrodkowa w obracającym się układzie jest skierowana od osi obrotu.

## Źródła

- [NASA: duszki, halo i ELVE](https://science.nasa.gov/science-research/heliophysics/a-gigantic-jet-caught-on-camera-a-spritacular-moment-for-nasa-astronaut-nicole-ayers/) oraz [przegląd wysokości TLE](https://ntrs.nasa.gov/api/citations/20080046148/downloads/20080046148.pdf).
- [USGS: uskoki](https://www.usgs.gov/faqs/what-a-fault-and-what-are-different-types), [słownik pojęć sejsmologicznych](https://www.usgs.gov/glossary/earthquake-hazards-program), [definicja magmy](https://pubs.usgs.gov/gip/99/pdf/gip99.pdf).
- [NOAA: góry podmorskie i gujoty](https://prod-01-alb-www-oe.woc.noaa.gov/ocean-fact/seamounts/); [NOAA: absorpcja UV przez ozon](https://www.csl.noaa.gov/assessments/ozone/2018/twentyquestions/).
- [OpenStax: praca i iloczyn skalarny](https://openstax.org/books/college-physics-ap-courses/pages/7-1-work-the-scientific-definition), [entropia](https://openstax.org/books/college-physics-2e/pages/15-6-entropy-and-the-second-law-of-thermodynamics-disorder-and-the-unavailability-of-energy).
- [National Hurricane Center: skala huraganowa](https://www.nhc.noaa.gov/news/20120910_pa_surgeScale.pdf), [National Weather Service: punkt rosy](https://marine.weather.gov/glossary.php?word=DEW), [NOAA: La Niña](https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ensofaq.shtml).
- [NIST: superpozycja w wybranej bazie](https://www.nist.gov/pml/productsservices/quantum-networks-nist/quantum-networks-nist-glossary) i [kondensacja bozonów](https://nvlpubs.nist.gov/nistpubs/jres/101/4/j4cornel.pdf).
- [NASA: modele ciemnej energii](https://science.nasa.gov/dark-energy/), [nova i akrecja](https://science.nasa.gov/universe/whats-a-nova-inside-the-chaos-of-erupting-and-exploding-stars/), [wiatr słoneczny](https://www.jpl.nasa.gov/nmp/st5/SCIENCE/solarwind.html).

## Ograniczenia i walidacja

Przegląd wszystkich zapisów nie oznacza niezależnej kwerendy każdego szczegółu w 100 pytaniach. Część złożonych zagadnień przedstawiono na poziomie podstawowym, bez pełnych wyjątków i konwencji. Pozostają bliskie tematycznie pytania m.in. 9/97 (magma i lawa), 11/98 (wypór i zasada Archimedesa), 22/78 (sejsmologia), 32/50/70 (sposoby przekazu ciepła) oraz 34/83 (siły działające na samolot). `python3 scripts/audit_questions.py` nie wykrył problemów strukturalnych; `git diff --check` jest czysty.

## Niezależna kontrola: dodatkowe doprecyzowania

- 44: zastąpiono ogólne „decay” i „transmutation” dystraktorami niewłączającymi rozszczepienia; spontaniczne rozszczepienie jest rodzajem rozpadu promieniotwórczego. [OpenStax: fission](https://openstax.org/books/college-physics-ap-courses-2e/pages/32-6-fission).
- 65: wypór może działać także w płynącym płynie, dlatego nie stanowił bezpiecznego dystraktora w poprzednim pytaniu. Zastąpiono je pytaniem o ciśnienie dynamiczne ½ρv². [NASA: dynamic pressure](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/dynamic-pressure-2/).
- 81: punkt Curie jest także punktem krytycznym; ogólną odpowiedź „critical point” zastąpiono temperaturą wrzenia.
- 86: usunięto sugestię, że wszelki opad musi powstać wskutek kondensacji ciekłej wody; kryształy lodu mogą rosnąć kosztem pary wodnej. [USGS: precipitation](https://www.usgs.gov/water-science-school/science/precipitation-and-water-cycle).
- 96: określono, że fuzja wodoru zaczyna się w jądrze odpowiednio masywnej i gorącej protogwiazdy, a nie całego obłoku. [NASA: stars](https://science.nasa.gov/exoplanets/stars/).

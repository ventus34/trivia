# Przegląd: Anatomy of Truth (EN)

Paczka `databases/categories/anatomy_of_truth_en.json`, indeks 7: przeczytano 100 pytań, odpowiedzi, kluczy i wyjaśnień oraz oceniono opis. Opis podaje wybrane tematy i sygnalizuje dalszy zakres wielokropkiem; pozostawiono go bez zmian. Nie wszystkie twierdzenia historyczne, religioznawcze i filozoficzne zostały niezależnie potwierdzone w źródłach: raport dokumentuje przegląd i wybrane sprawdzenia, nie pełną ekspertyzę każdej tezy.

Poprawiono 33 pozycje (numery w tablicy `questions`, od 1):

- 15, 29, 40, 53, 68, 86: rozróżniono zeznania złożone poza sądem i oświadczenia pisemne, ograniczono twierdzenia o przysiędze, znamionach krzywoprzysięstwa i konsekwencjach ukrywania dowodów do właściwego kontekstu.
- 16, 17, 19, 20, 24, 31, 32, 36, 37, 49, 63, 70, 74, 82, 91, 96, 100: usunięto niejednoznaczne wskazówki i dystraktory lub mylące definicje. W szczególności Awerroes rozważał zgodność filozofii z prawidłowo interpretowanym objawieniem; przypisywanie mu doktryny dwóch prawd jest sporne. Zeno był eleatą, Tarski również omawiał korespondencyjne interpretacje prawdy, a Ramsey był deflacjonistą. Pytanie o wartościowanie dotyczy teraz zmiennych zdaniowych; pytanie o nośnik prawdy nie wyklucza fałszywie przekonań.
- 27, 42, 45, 53, 59, 80, 87, 98: wyjaśniono pojęcia i usunięto techniczne odwołania do blueprintu; zawężono deepfake oraz wyjaśniono, że uczciwa osoba może się pomylić.
- 47, 79, 93: zastąpiono powtórzenia odpowiednio pytaniami o postać przemawiającą w alegorii jaskini, autora *Outlines of Pyrrhonism* i właściwy sposób zarobkowania w Ośmiorakiej Ścieżce.

Z edytowanych pytań usunięto stare znaczniki `last_verified_at` i `verifying_model`, ponieważ dotyczyły poprzednich treści. Zachowano liczbę 100 pytań.

Źródła dla wybranych korekt: [SEP: Awerroes i spór o dwie prawdy](https://plato.stanford.edu/archives/sum2024/entries/albalag/), [SEP: teorie pragmatyczne](https://plato.stanford.edu/entries/truth-pragmatic/), [SEP: prawda i Tarski](https://plato.stanford.edu/entries/truth/), [SEP: Anzelm i prawda jako rectitude](https://plato.stanford.edu/archives/spr2003/entries/anselm/), [SEP: Sekstus Empiryk](https://plato.stanford.edu/entries/sextus-empiricus/), [SEP: Ibn Sina i Księga Uzdrowienia](https://plato.stanford.edu/archives/win2023/entries/ibn-sina-natural/), [Platon, Państwo VII](https://classics.mit.edu/Plato/republic.8.vii.html), [Noble Eightfold Path](https://accesstoinsight.org/lib/study/truths), Cornell LII: [deposition](https://www.law.cornell.edu/wex/deposition), [affidavit](https://www.law.cornell.edu/wex/affidavit), [perjury](https://www.law.cornell.edu/wex/perjury).

Kontrola `python3 scripts/audit_questions.py`: 229 paczek, 24 285 pytań, bez wykrytych problemów strukturalnych. Skrypt nie weryfikuje prawdziwości treści.

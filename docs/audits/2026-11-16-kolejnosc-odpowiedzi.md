# Kolejność odpowiedzi w zaindeksowanych paczkach

Przegląd 229 paczek i 24 285 pytań wykazał, że w 134 paczkach poprawna odpowiedź zajmowała pierwszą pozycję w co najmniej 80% rekordów; w 87 paczkach dotyczyło to co najmniej 95%. Łącznie poprawna odpowiedź była pierwsza w 17 707 pytaniach. Dane opisują stan plików w dniu kontroli, a nie wynik losowych rozgrywek.

Gra wyświetlała warianty w kolejności z bazy. W trybie wyboru odpowiedzi dodano tasowanie kopii opcji przy tworzeniu przycisków; sprawdzanie nadal porównuje wybrany tekst z kluczem. Nie zmieniono pytań, kluczy ani plików paczek. Teksty przycisków i karty czytania używają tej samej przetasowanej kolejności.

Przeszukano pola pytań, odpowiedzi i wyjaśnień pod kątem typowych polskich i angielskich odwołań do odpowiedzi powyżej, poniżej lub par oznaczonych literami; nie znaleziono dopasowań. To kontrola oparta na wzorcach, więc nie dowodzi braku wszystkich możliwych odwołań do kolejności.

Weryfikacja: testy `tests/answer-options.test.js` i `tests/game-flow.test.js`, ESLint (bez błędów; istniejące ostrzeżenia w innych plikach), `scripts/audit_questions.py` oraz `git diff --check`.

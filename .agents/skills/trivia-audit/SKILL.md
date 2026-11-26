---
name: trivia-audit
description: Audytuj bazę pytań ventus34/trivia za pomocą lokalnego CLI. Użyj do globalnej diagnostyki, przyrostowego przeglądu jakości, wznowienia przerwanego audytu i nanoszenia zaakceptowanych poprawek.
---

# Audyt pytań Trivia

Użyj `./trivia` z katalogu repozytorium. Polecenia i schematy są w [dokumentacji CLI](../../../docs/trivia-cli.md).

1. Odśwież indeks. Zacznij od `stats`, `lint`, dokładnych duplikatów i nakładania paczek. Ogranicz liczbę rekordów w kontekście. Wspólna odpowiedź jest wskazówką do porównania faktów.
2. Wybierz typ kontroli i przydziel 25–50 pytań przez `audit next`. Kontynuuj po ID zadania. Wykonawcy zapisują osobne pliki JSONL, a integrator importuje jawny wynik dla każdego sprawdzonego ID. Pytania bez wyniku pozostają do dokończenia.
3. Pierwszy przebieg wykonaj offline. Użyj reguł i wiedzy modelu. Weryfikuj źródłowo w osobnym przebiegu tylko kwestie, które tego wymagają. Domyślny budżet to 20 wyszukiwań na sesję i dwa na problem. Po wyczerpaniu budżetu zapisz wynik `uncertain`.
4. Rozdziel problemy od zmian w treści. Użyj patcha z oczekiwanym hashem, sprawdź podgląd i zastosuj tylko zatwierdzone poprawki. Duplikaty między paczkami i językami wymagają decyzji o ich roli w grze.
5. Zakończ uzgodniony, ograniczony przebieg raportem, metrykami i kolejką dalszych kontroli. Domyślnie pracuj samodzielnie. Jeśli delegacja ma wymierną korzyść, użyj najwyżej czterech jednoczesnych wykonawców i ośmiu uruchomień na przebieg.

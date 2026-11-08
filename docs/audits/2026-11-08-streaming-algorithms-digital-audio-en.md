# Streaming Algorithms & Digital Audio — przegląd 2026-11-08

Przejrzano wszystkie 100 pytań, warianty odpowiedzi, klucze, wyjaśnienia i opis paczki. Liczba pytań i opis pozostały bez zmian. Zmieniono 82 pozycje: 1–13, 15–21, 23–29, 31–33, 35, 37–45, 47–48, 50–53, 55–58, 60–61, 63, 65–66, 68–70, 72–75, 77–78, 81–89, 90, 92 i 94–100. Usunięto nieaktualne metadane weryfikacji ze zmienionych rekordów oraz paczki.

- Ujednoznaczniono pytania z wieloma możliwymi odpowiedziami dotyczące m.in. kodeków Bluetooth, przepływności, DRM, dźwięku przestrzennego, kompresora, filtrów oraz formatów Dolby Atmos i DTS:X. Wcześniejsza para odpowiedzi w obu formatach przestrzennych była poprawna.
- Poprawiono informacje o ALAC, źródłach kodeka FLAC i Opus, serwerach PulseAudio/PipeWire, interfejsie ASIO i pochodzeniu RTMP. HLS jest publicznie opisany w RFC, a nie wyłącznie zamkniętym standardem.
- Wyjaśniono różnicę między bps a B/s, dBFS a LUFS, kontenerem a kodekiem oraz operacją transkodowania a pakowaniem. Poprawiono opis VBR, ograniczeń limitera, jitter buffer i odbioru adaptacyjnego bez obiecywania idealnego efektu.
- Doprecyzowano warunki twierdzenia o próbkowaniu, odpowiedź filtru FIR/IIR, działanie delta-sigma, maskowanie oraz szum kwantyzacji. Usunięto twierdzenie, że materiał usuwany przez stratny kodek jest zawsze niesłyszalny lub że wyższa rozdzielczość gwarantuje lepszy dźwięk.

## Wybrane źródła

- [IETF RFC 6716: kodek Opus](https://www.rfc-editor.org/rfc/rfc6716) — 88; [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216) — 87 i 98.
- [W3C: Web Audio API](https://www.w3.org/TR/webaudio-1.0/) — 64; [dokumentacja PipeWire: serwer zgodny z PulseAudio](https://docs.pipewire.org/page_man_pipewire-pulse_1.html) — 17.
- [Apple: kod Apple Lossless](https://github.com/macosforge/alac) — 26; [Xiph.Org: dołączenie FLAC do projektu](https://xiph.org/press/2003/flac/) — 81.
- [ITU: twierdzenie o próbkowaniu](https://www.itu.int/dms_pub/itu-r/opb/rep/R-REP-BT.2140-5-2012-PDF-E.pdf) — 89; [ITU-R BS.1770: pomiar głośności i true peak](https://www.itu.int/rec/R-REC-BS.1770/en) — 57.
- [Steinberg: podręcznik WaveLab, ASIO](https://download.steinberg.net/downloads_software/WaveLab_Cast_2/WaveLab_Cast_2_Operation_Manual_en.pdf) — 65; [Icecast: oprogramowanie serwera](https://icecast.org/download/) — 44.

## Ograniczenia

Odczyt wszystkich pytań nie stanowi niezależnego źródłowego potwierdzenia każdego twierdzenia. Standardy, implementacje, kodeki i wsparcie przeglądarek mogą się zmieniać; przywołane źródła weryfikują wybrane pozycje. W paczce pozostają niektóre proste dystraktory i pokrewne tematy.

Niezależna kontrola doprecyzowała zastosowanie UDP w części systemów niskolatencyjnych (35) i opisała Dante jako system audio-over-IP zamiast pojedynczego protokołu (74). Źródła: [IETF RFC 768](https://www.rfc-editor.org/rfc/rfc768.html), [Audinate: Dante](https://dev.audinate.com/GA/ddm/userguide/1.1/webhelp/content/front_matter/about_dante.htm).

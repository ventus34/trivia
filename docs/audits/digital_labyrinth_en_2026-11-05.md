# Digital Labyrinth: content audit

Date: 2026-11-05. Scope: all 100 questions in `databases/categories/digital_labyrinth_en.json`, including answers, distractors and explanations, plus the pack description and metadata. The description matches the broad subject mix. This was an editorial and factual review, with targeted source checks of disputed or specialized claims; it is not a comprehensive source-by-source certification of every elementary statement. Question numbers below are one-based positions in the file. No index was modified.

## Changes

- 2, 47: distinguished the German Enigma machine from the Lorenz teleprinter cipher; both served German wartime communications.
- 6, 9, 11, 13, 14, 16, 17, 18, 26, 31, 33, 36, 50, 63, 69, 75, 81, 82, 83, 85, 87, 91: clarified clues or options that previously admitted multiple answers or lacked enough identifying context. Examples include Prim and Kruskal for maze generation, I2P and Tor for anonymity and hidden services, Tails and Whonix for Tor-routed operating systems, left and right wall following, and Colossal Cave being part of the Mammoth Cave system. In 87 the larger cave system was also removed as a distractor.
- 32, 77: specified the machine associated with each historical inventor, and removed the unsupported claim that Koch held an earlier patent than the early Enigma-related 1918 application; the attribution history is not reduced to one uncontested inventor.
- 38: corrected the implication that Gibson introduced cyberspace in *Neuromancer*, rather than using the term earlier in *Burning Chrome*.
- 48, 56, 72, 84: qualified all-pairs paths in the presence of negative cycles, shell home-directory behavior, Tor privacy guarantees, and IDA* cost thresholds respectively.
- 55: replaced the unsupported term “maze manifold” with a standard topology question about a torus.
- 57: corrected the platform: *Super Maze Wars* is a Macintosh update, not an arcade sequel.
- 62: identified Purple by its Japanese diplomatic role and stepping switches, rather than the vague “rotor machine alternative”.
- 64, 67: removed internal blueprint language from player-visible explanations.
- 78: replaced the misleading shortest-path clue with Tarjan's depth-first algorithm for strongly connected components.
- 92: corrected the reversed roles assigned to the Playfair and Hill ciphers and avoided incorrectly identifying their namesakes as inventors.

Changed questions no longer retain previous model-verification metadata; the pack-level verification metadata was also removed because the earlier verification did not cover this revision. The question count remains 100.

## Sources consulted

- NSA, [Securitas rotor-machine patent history](https://www.nsa.gov/Portals/75/documents/news-features/declassified-documents/friedman-documents/patent-equipment/FOLDER_116/41763139080227.pdf), and [Koch patent record](https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/friedman-documents/patent-equipment/FOLDER_116/41763119080225.pdf): early rotor patents and disputed attribution; [Jade and Purple](https://www.nsa.gov/History/National-Cryptologic-Museum/Exhibits-Artifacts/Exhibit-View/Article/2719172/jade-and-purple/): Purple's switches and diplomatic use.
- Bletchley Park, [Enigma and Lorenz in wartime intelligence](https://bletchleypark.org.uk/wp-content/uploads/2024/10/FINAL-Bletchley-Parks-once-secret-D-Day-role-to-be-highlighted-on-D-Day-80.pdf).
- Tor Project, [onion services](https://support.torproject.org/about-tor/onion-services/what-is-a-dot-onion/) and [service protocol overview](https://community.torproject.org/onion-services/overview/); I2P, [technical introduction](https://geti2p.net/mg/docs/how/tech-intro); Whonix, [technical architecture](https://www.whonix.org/wiki/Dev/Technical_Introduction); Tails, [software network connections](https://translate.tails.net/projects/tails/wikisrcdocpersistent_storageadditional_software-po/en/).
- University of Washington, [maze generation with minimum-spanning-tree algorithms](https://courses.cs.washington.edu/courses/cse373/20au/projects/mazes/kruskal/); Princeton, [Tarjan's original strongly connected components work](https://www.cs.princeton.edu/~wayne/kleinberg-tardos/pdf/03Graphs.pdf).
- Dennis Jerz, [research on the original *Adventure* and Colossal Cave](https://dhq-static.digitalhumanities.org/pdf/000009.pdf); [Super Maze Wars, Macintosh](https://www.mobygames.com/game/151495/super-maze-wars/).
- Wolfram MathWorld, [torus](https://mathworld.wolfram.com/Torus.html); PBS, [Playfair cipher and Wheatstone](https://www.pbs.org/wgbh/nova/decoding/playfair.html); University of Alberta, [classical ciphers including the Hill cipher](https://theswissbay.ch/pdf/Gentoomen%20Library/Cryptography/Handbook%20of%20Applied%20Cryptography%20-%20Alfred%20J.%20Menezes.pdf).
- U.S. Space Force, [GPS definition](https://gwcc-ws.cce.af.mil/About/Acronyms).

Some original questions are closely related or repeat concepts (e.g. 22/27, 35/28, 10/100); this audit preserves the existing 100-question scope rather than redesigning the pack. Source checks were concentrated on potentially incorrect, disputed, niche, or ambiguous content, and other routine descriptions were evaluated editorially.

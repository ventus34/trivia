# Przerwane przeglądy: AI w grach i astronomia — 2026-11-05

Prace subagentów przerwał limit wykorzystania przed ukończeniem raportów. Poniżej znajduje się historyczna migawka różnic względem HEAD z chwili wznowienia pracy, a nie aktualny stan plików ani potwierdzenie poprawności. Po wznowieniu powstały osobne raporty dla wszystkich czterech paczek; ich bieżący zakres, źródła i ograniczenia mają pierwszeństwo przed tą migawką. Numery odnoszą się do pozycji w `questions`; metadanych weryfikacji nie wymieniono.

- [AI in Gaming](2026-11-05-artificial-intelligence-in-gaming-en.md)
- [Astronomia PL — większa paczka](2026-11-05-astronomia-i-uklad-sloneczny-pl.md)
- [Astronomia PL — druga paczka](2026-11-05-astronomia-uklad-sloneczny-pl.md)
- [Astronomy EN](2026-11-05-astronomy-solar-system-en.md)

Dodatkowo sprawdzono i poprawiono pytanie 41 w obu paczkach PL (skład białego karła) i pytanie 8 w angielskiej paczce (cele misji Europa Clipper). Źródła: [NASA — białe karły](https://science.nasa.gov/missions/hubble/nasas-hubble-uncovers-rare-white-dwarf-merger-remnant/), [NASA — Europa Clipper](https://science.nasa.gov/mission/europa-clipper/mission-faq/). Dla pozycji 1 porównano dane [IAU z marca 2026](https://www.iau.org/Iau/News/Ann2026/MPC-New-Moons-Saturn-Jupiter.aspx) oraz [NASA z sierpnia 2026](https://science.nasa.gov/saturn/moons/).

## artificial_intelligence_in_gaming_en

Liczba pytań: 100. Zmienione rekordy: 50. Zakres merytorycznego przeglądu niepotwierdzony.

### 3. Which heuristic graph-search algorithm combines the cost so far with an estimated remaining cost to guide pathfinding?
- **question — przed:** Which heuristic pathfinding algorithm is most frequently utilized in game development to find the shortest path between two points?
- **question — po:** Which heuristic graph-search algorithm combines the cost so far with an estimated remaining cost to guide pathfinding?
- **explanation_correct — przed:** A* uses a heuristic function to efficiently estimate the cost to the goal, making it highly optimized for real-time applications.
- **explanation_correct — po:** A* prioritizes nodes using the cost so far plus a heuristic estimate of the remaining cost. Its shortest-path guarantee requires appropriate assumptions on costs and the heuristic.
- **explanation_incorrect — przed:** Breadth-First, Depth-First, and Uniform Cost searches are foundational algorithms that lack the heuristic efficiency of A* for complex game maps.
- **explanation_incorrect — po:** Breadth-first, depth-first, and uniform-cost search do not use the same cost-plus-heuristic priority rule.

### 5. Which Google DeepMind program became the first to defeat a professional human player at the game of Go?
- **explanation_incorrect — przed:** While AlphaZero, MuZero, and AlphaStar are sophisticated DeepMind projects, they were applied to different game domains like chess or real-time strategy.
- **explanation_incorrect — po:** AlphaZero later played Go, chess and shogi; MuZero learned several games using a learned model, and AlphaStar was developed for StarCraft II.

### 6. Which Japanese board game lets players return captured pieces to the board under their control?
- **question — przed:** Which traditional Japanese strategy game serves as a core challenge for many specialized artificial intelligence research projects?
- **question — po:** Which Japanese board game lets players return captured pieces to the board under their control?
- **explanation_correct — przed:** Shogi is a Japanese strategy game that presents unique complexity for AI due to recursive piece capture mechanics.
- **explanation_correct — po:** In shogi, captured pieces change allegiance and may later be dropped back onto the board, subject to rules.
- **explanation_incorrect — przed:** Go, Chess, and Renju are common board game AI targets but are distinct in their rules and cultural origin from the Japanese game specified.
- **explanation_incorrect — po:** Go, chess, and renju do not use shogi’s captured-piece drop rule.

### 7. Which single-source shortest-path algorithm repeatedly settles the unsettled vertex with the smallest known distance when all edge weights are non-negative?
- **question — przed:** What is the primary algorithm used for calculating the shortest path on a weighted graph with non-negative edge weights?
- **question — po:** Which single-source shortest-path algorithm repeatedly settles the unsettled vertex with the smallest known distance when all edge weights are non-negative?
- **explanation_incorrect — przed:** Bellman-Ford, Floyd-Warshall, and Johnson’s are alternative graph algorithms used for different specific edge weight constraints or all-pairs scenarios.
- **explanation_incorrect — po:** Bellman–Ford supports negative edges, while Floyd–Warshall and Johnson’s algorithm are commonly used for all-pairs shortest paths. Several algorithms can solve non-negative graphs; the greedy settling rule identifies Dijkstra’s.

### 10. Which architecture employs mathematical functions to weight and score various actions based on current situational inputs?
- **explanation_incorrect — przed:** FSM, rule-based systems, and fuzzy logic utilize different methodologies—typically conditional branches—rather than a scoring utility function.
- **explanation_incorrect — po:** Finite-state machines organize states and transitions; rule-based systems and fuzzy logic can be combined with utility scores but do not themselves require choosing the highest-scored action.

### 14. Which game AI architecture stores shared information in a common workspace that multiple behaviors can read and update?
- **question — przed:** What was the name of the central AI manager in the Halo series tasked with coordinating squad encounters and combat pacing?
- **question — po:** Which game AI architecture stores shared information in a common workspace that multiple behaviors can read and update?
- **options — przed:** ["The Director", "Bungie Mind", "Combat Logic Controller", "Encounter Manager"]
- **options — po:** ["Blackboard system", "Navigation mesh", "Texture atlas", "Audio bus"]
- **answer — przed:** The Director
- **answer — po:** Blackboard system
- **explanation_correct — przed:** The Director in the Halo series manages the overall intensity and behavior of AI squads during engagements.
- **explanation_correct — po:** A blackboard supplies shared data that separate decision-making components or behaviors can consult and update.
- **explanation_incorrect — przed:** Bungie Mind, Combat Logic Controller, and Encounter Manager are plausible descriptions but are not the official terminology used by the game developers.
- **explanation_incorrect — po:** A navigation mesh represents traversable space, a texture atlas groups images, and an audio bus routes sound.

### 18. Which real-time strategy game did DeepMind’s AlphaStar reach Grandmaster level in?
- **question — przed:** Which real-time strategy game was officially mastered by DeepMind’s AlphaStar intelligence?
- **question — po:** Which real-time strategy game did DeepMind’s AlphaStar reach Grandmaster level in?
- **explanation_correct — przed:** AlphaStar achieved Grandmaster level rating in StarCraft II through deep reinforcement learning.
- **explanation_correct — po:** AlphaStar achieved Grandmaster level in StarCraft II under the evaluation conditions reported by DeepMind.

### 21. Which checkers program was developed by Jonathan Schaeffer’s team and played a key role in solving English draughts?
- **question — przed:** Which software was the first to solve the game of Checkers at a grandmaster level?
- **question — po:** Which checkers program was developed by Jonathan Schaeffer’s team and played a key role in solving English draughts?
- **explanation_correct — przed:** Chinook was developed by Jonathan Schaeffer and was the first program to achieve a perfect record in a board game.
- **explanation_correct — po:** The Chinook project showed in 2007 that English draughts is a draw with perfect play by both sides from the standard starting position.
- **explanation_incorrect — przed:** The other options are either chess-focused engines or modern general-purpose game AIs.
- **explanation_incorrect — po:** Deep Blue and Stockfish are associated with chess; AlphaZero was trained on chess, shogi and Go.

### 22. What is the official character designation for the red ghost in the original Pac-Man?
- **explanation_correct — przed:** Blinky, the red ghost, is referred to as 'Shadow' because he aggressively chases the player directly.
- **explanation_correct — po:** In the original English arcade character list, Blinky, the red ghost, has the nickname Shadow.
- **explanation_incorrect — przed:** These alternative names correspond to the defined behavioral patterns of the other three ghost characters.
- **explanation_incorrect — po:** The other nicknames belong to the remaining ghosts; the names do not by themselves establish the details of the targeting algorithms.

### 23. What is the official character designation for the pink ghost in the original Pac-Man?
- **explanation_correct — przed:** Pinky, the pink ghost, is officially known as 'Speedy' due to its tendency to ambush the player.
- **explanation_correct — po:** In the original English arcade character list, Pinky, the pink ghost, has the nickname Speedy.
- **explanation_incorrect — przed:** These other labels describe the distinct AI behaviors programmed for the red, blue, and orange ghosts.
- **explanation_incorrect — po:** The other nicknames belong to the remaining ghosts; the names do not by themselves establish the details of the targeting algorithms.

### 24. Which personality designation is given to Inky, the blue ghost, in the original arcade version of Pac-Man?
- **explanation_correct — przed:** Inky's behavior is tied to both Pac-Man and Blinky's positions, earning him the designation 'Bashful'.
- **explanation_correct — po:** In the original English arcade character list, Inky, the blue ghost, has the nickname Bashful.
- **explanation_incorrect — przed:** Shadow, Speedy, and Pokey refer to the behaviors of the red, pink, and orange ghosts respectively.
- **explanation_incorrect — po:** The other nicknames belong to the remaining ghosts; the names do not by themselves establish the details of the targeting algorithms.

### 25. What is the official character designation for the orange ghost in the original Pac-Man?
- **explanation_correct — przed:** Clyde, the orange ghost, is named 'Pokey' because its behavior oscillates between following the player and retreating.
- **explanation_correct — po:** In the original English arcade character list, Clyde, the orange ghost, has the nickname Pokey.
- **explanation_incorrect — przed:** These options correlate to the specific programming logic for the primary red, pink, and blue entities.
- **explanation_incorrect — po:** The other nicknames belong to the remaining ghosts; the names do not by themselves establish the details of the targeting algorithms.

### 26. Which coherent gradient-noise function is often used to generate terrain height maps?
- **question — przed:** Which algorithm is most commonly utilized to generate natural infinite terrain height maps?
- **question — po:** Which coherent gradient-noise function is often used to generate terrain height maps?
- **explanation_incorrect — przed:** The other methods focus on shape manipulation, Voronoi partitioning, or mathematical curves rather than terrain elevation.
- **explanation_incorrect — po:** Simplex noise can also generate terrain; Voronoi diagrams partition space and Bézier curves describe smooth paths or shapes.

### 30. What is the branding of the cloud-based AI technology used in Killer Instinct to model player behavior?
- **explanation_correct — przed:** Shadow Lab is the specific feature in Killer Instinct that captures human input to build a deep learning Shadow model.
- **explanation_correct — po:** Shadow Lab in Killer Instinct lets players train a Shadow to imitate aspects of their fighting style; the feature is cloud-connected.
- **explanation_incorrect — przed:** The other options are generic industry terms for AI technologies rather than product-specific trademarks.
- **explanation_incorrect — po:** The other options are generic terms rather than the name of Killer Instinct’s Shadow Lab feature.

### 31. Which term describes the artificial biological programming used in the 1996 creature-sim game, Creatures?
- **explanation_correct — przed:** Creatures utilized a Digital DNA system that defined the biological traits and learning capabilities of the Alines.
- **explanation_correct — po:** In Creatures, digital genetics help specify traits of the simulated Norns, including aspects of their biology and development.

### 32. What type of optimization strategy uses biological processes like mutation and selection to train AI?
- **explanation_incorrect — przed:** Backpropagation and reinforcement learning follow different mathematical approaches centered on error correction rather than biological selection.
- **explanation_incorrect — po:** Backpropagation computes gradients; reinforcement learning and supervised learning are learning approaches and do not inherently require selection and mutation.

### 38. In The Sims, what term describes objects presenting possible need-satisfying interactions to autonomous Sims?
- **question — przed:** What is the name of the internal system that dictates NPC motivation and urgency in The Sims?
- **question — po:** In The Sims, what term describes objects presenting possible need-satisfying interactions to autonomous Sims?
- **explanation_correct — przed:** In The Sims, objects 'advertise' their ability to satisfy needs, and the AI chooses based on the highest utility score.
- **explanation_correct — po:** Objects advertise interactions and their effects on motives, which helps an autonomous Sim select what to do.
- **explanation_incorrect — przed:** These terms refer to player character building or game balancing rather than the specific AI interaction subsystem.
- **explanation_incorrect — po:** Trait mapping, need prioritization and autonomy weighting are related descriptions but do not name the object advertisement mechanism.

### 39. What general learning principle describes a Black & White creature changing behavior in response to player rewards and punishments?
- **question — przed:** Which learning method allowed the creature in Black & White to associate actions with player-delivered consequences?
- **question — po:** What general learning principle describes a Black & White creature changing behavior in response to player rewards and punishments?
- **options — przed:** ["Decision Reinforcement", "Associative Triggering", "Outcome Mapping", "Heuristic Adjustment"]
- **options — po:** ["Reinforcement", "Ray tracing", "Path smoothing", "Frustum culling"]
- **answer — przed:** Decision Reinforcement
- **answer — po:** Reinforcement
- **explanation_correct — przed:** Decision Reinforcement allows the Creature's AI to learn specific behaviors based on positive or negative player interventions.
- **explanation_correct — po:** In Black & White a player can reward or punish actions, giving feedback that affects a creature’s future behavior.
- **explanation_incorrect — przed:** These terms sound plausible but do not reflect the specific technical name of the game's reward-based AI system.
- **explanation_incorrect — po:** The other options concern rendering, navigation or visibility rather than learning from feedback.

### 40. Which machine-learning model was used in Black & White for a creature to learn to predict a player’s reaction to actions?
- **question — przed:** What specific type of neural structure was the Creature in Black & White's learning model based upon?
- **question — po:** Which machine-learning model was used in Black & White for a creature to learn to predict a player’s reaction to actions?
- **options — przed:** ["Perceptron", "Recursive Net", "Hopfield Net", "Convolutional Layer"]
- **options — po:** ["Decision tree", "Convolutional layer", "Navigation mesh", "Hash table"]
- **answer — przed:** Perceptron
- **answer — po:** Decision tree
- **explanation_correct — przed:** The game employed a Perceptron-based system to map creature inputs to behavioral outputs via weights.
- **explanation_correct — po:** Black & White used decision-tree learning among several AI techniques to predict the player’s response based on prior feedback.
- **explanation_incorrect — przed:** Modern deep learning architectures like CNNs or recurrent networks are much more advanced than the system used in that era.
- **explanation_incorrect — po:** A navigation mesh represents walkable space, a hash table stores data, and a convolutional layer is a different neural-network component.

### 41. Which AI developed at Carnegie Mellon defeated four poker professionals in the 2017 Brains vs. Artificial Intelligence competition?
- **question — przed:** Which specific AI program gained prominence in 2017 for defeating professional poker players in heads-up No-Limit Texas Hold'em?
- **question — po:** Which AI developed at Carnegie Mellon defeated four poker professionals in the 2017 Brains vs. Artificial Intelligence competition?
- **explanation_incorrect — przed:** DeepStack is another notable poker AI but Libratus is the specific agent recognized for the 2017 Brains vs. AI challenge victory.
- **explanation_incorrect — po:** DeepStack also achieved notable results against professional players, but Libratus was the CMU system in this specific competition.

### 43. Which training technique serves as the core mechanism for AlphaZero to achieve superhuman performance without relying on human-provided game data?
- **explanation_correct — przed:** AlphaZero learns by playing against itself million of times, constantly refining its strategy based on the results.
- **explanation_correct — po:** AlphaZero improved through millions of self-play games with search, starting from the game rules rather than human game records.
- **explanation_incorrect — przed:** Supervised learning relies on human grandmaster databases, whereas AlphaZero starts from random knowledge and purely self-improves.
- **explanation_incorrect — po:** Imitation learning uses demonstrations. Supervised learning is a general training method and need not always use human labels; the distinguishing data-generation method here is self-play.

### 45. What common pathfinding technique is used to simplify a raw navigation mesh path into a smoother, more efficient trajectory for game entities?
- **explanation_correct — przed:** String pulling creates the shortest path between nodes by checking for line-of-sight obstructions along a computed path.
- **explanation_correct — po:** String pulling, often implemented by the funnel algorithm, finds a short path through a sequence of navigation-mesh portals. It does not guarantee the globally shortest path across every possible corridor.

### 47. Which basic algorithm is often used by grid-based AI to determine connected navigable areas or define map boundaries?
- **options — przed:** ["Flood Fill", "Dijkstra's", "Breadth-First Search", "Ray Casting"]
- **options — po:** ["Flood Fill", "Dijkstra's", "Minimax", "Ray Casting"]
- **explanation_incorrect — przed:** Dijkstra's finds the shortest distance, while flood fill is primarily for determining membership within an area.
- **explanation_incorrect — po:** Dijkstra’s algorithm computes shortest paths, minimax searches adversarial game trees, and ray casting traces rays. A flood fill itself may be implemented with breadth-first or depth-first traversal.

### 50. In reinforcement learning, what function specifies the numerical feedback associated with a transition or action?
- **question — przed:** In reinforcement learning, what is the mathematical formula that calculates the feedback to an agent based on its actions?
- **question — po:** In reinforcement learning, what function specifies the numerical feedback associated with a transition or action?
- **explanation_correct — przed:** The reward function maps the state-action pair to a scalar value that guides the agent toward optimal behavior.
- **explanation_correct — po:** A reward function specifies a scalar feedback signal, often depending on state, action and resulting state. An agent learns a policy to maximize cumulative reward.

### 53. Which chatbot won the Loebner Prize in 2013 and again in 2016, 2017, 2018 and 2019?
- **question — przed:** Which chatbot was specifically recognized for winning the annual Loebner Prize multiple times using a unique knowledge base?
- **question — po:** Which chatbot won the Loebner Prize in 2013 and again in 2016, 2017, 2018 and 2019?
- **explanation_correct — przed:** Mitsuku (now known as Kuki) won the Loebner prize several times due to its high level of conversational fluency.
- **explanation_correct — po:** Mitsuku, later branded Kuki, won the Loebner Prize multiple times.
- **explanation_incorrect — przed:** Eugene Goostman and Cleverbot rely on different architectures and did not win the Loebner Prize with the same consistency.
- **explanation_incorrect — po:** Jabberwacky also won Loebner Prizes, but not the five editions specified; the other bots did not win this sequence.

### 55. Which OpenAI model powered the early AI Dungeon 2 released in 2019?
- **question — przed:** Which large language model originally powered the narrative generation in the game AI Dungeon?
- **question — po:** Which OpenAI model powered the early AI Dungeon 2 released in 2019?
- **options — przed:** ["GPT-3", "BERT", "T5", "BLOOM"]
- **options — po:** ["GPT-2", "BERT", "T5", "BLOOM"]
- **answer — przed:** GPT-3
- **answer — po:** GPT-2
- **explanation_correct — przed:** AI Dungeon utilized OpenAI's GPT-3 to create expansive and context-aware narrative responses.
- **explanation_correct — po:** Developer Nick Walton built AI Dungeon 2 on GPT-2 in 2019. Later versions also used GPT-3.
- **explanation_incorrect — przed:** BERT is an encoder-style model unsuitable for text generation, while T5 and BLOOM were not the initial primary engine.
- **explanation_incorrect — po:** BERT, T5 and BLOOM were not the GPT-2 model used for the specified early release.

### 56. In the original Thief: The Dark Project, which AI sensory system was revolutionary for enabling guards to track players based on material-specific noise?
- **explanation_correct — przed:** Thief famously modeled different floor surfaces that generated distinct noise frequencies that the AI could 'hear'.
- **explanation_correct — po:** Thief modeled sound propagation through the environment and produced different footstep noises depending on surfaces; guards could react to sound.
- **explanation_incorrect — przed:** These options relate to general sound, but Sound Propagation is the technical term for how the game simulated the travel of these noises.
- **explanation_incorrect — po:** The remaining phrases are generic alternatives, not the established name used here for sound moving through the environment.

### 58. What is the name of the neural architecture in which a generator and discriminator are trained in opposition?
- **question — przed:** What training methodology employs two neural networks competing against one another to refine the performance of the involved agents?
- **question — po:** What is the name of the neural architecture in which a generator and discriminator are trained in opposition?
- **options — przed:** ["Adversarial Training", "Competitive Synthesis", "Co-Evolutionary Modeling", "Opponent Iteration"]
- **options — po:** ["Generative adversarial network", "Finite state machine", "Navigation mesh", "Decision tree"]
- **answer — przed:** Adversarial Training
- **answer — po:** Generative adversarial network
- **explanation_correct — przed:** Adversarial training involves agents learning through competition, common in GANs and competitive game AI training.
- **explanation_correct — po:** In a GAN, a generator produces samples while a discriminator learns to distinguish generated from real examples.
- **explanation_incorrect — przed:** Co-evolutionary modeling is related but distinct, while Adversarial Training is the standard term for the winner-take-all feedback loop.
- **explanation_incorrect — po:** Finite state machines, navigation meshes and decision trees do not specify this generator–discriminator setup.

### 59. What metric is commonly used in StarCraft II to count a player’s actions per minute?
- **question — przed:** What numeric metric is frequently used in StarCraft II to measure the raw input speed and technical efficiency of both elite players and AI bots?
- **question — po:** What metric is commonly used in StarCraft II to count a player’s actions per minute?
- **explanation_correct — przed:** APM stands for the quantity of user commands per minute and serves as a classic benchmark for RTS execution speed.
- **explanation_correct — po:** APM measures an action rate. A high value alone does not prove that those actions are strategically effective.
- **explanation_incorrect — przed:** FPS measures graphical smoothness, whereas APM is specifically a measure of the agent's interaction intensity.
- **explanation_incorrect — po:** FPS measures frames per second; the other abbreviations do not denote the standard actions-per-minute metric.

### 61. What does UCI stand for in the context of communication between a chess engine and a graphical interface?
- **question — przed:** What is the primary communication protocol used for connecting chess engines to graphical user interfaces?
- **question — po:** What does UCI stand for in the context of communication between a chess engine and a graphical interface?
- **options — przed:** ["UCI", "XBoard", "ChessBase", "PGN"]
- **options — po:** ["Universal Chess Interface", "Unified Checkers Interpreter", "User Chess Index", "Universal Computer Input"]
- **answer — przed:** UCI
- **answer — po:** Universal Chess Interface
- **explanation_correct — przed:** The Universal Chess Interface (UCI) is the standard open communication protocol between a chess engine and a GUI.
- **explanation_correct — po:** UCI is an open text protocol used by chess engines and graphical interfaces.
- **explanation_incorrect — przed:** XBoard is an older legacy protocol, while PGN is a file format for recording games, and ChessBase is a commercial software suite.
- **explanation_incorrect — po:** XBoard/WinBoard is another chess-engine protocol; the other listed expansions are not the expansion of UCI.

### 62. Which open-source chess engine is widely used for analysis and is available from an official GitHub repository?
- **question — przed:** Which engine is currently considered the strongest open-source AI program used for professional chess analysis?
- **question — po:** Which open-source chess engine is widely used for analysis and is available from an official GitHub repository?
- **explanation_correct — przed:** Stockfish consistently dominates independent engine rankings as the premier open-source chess program.
- **explanation_correct — po:** Stockfish is an open-source chess engine used for analysis and engine competitions.
- **explanation_incorrect — przed:** Komodo and Houdini are historically strong proprietary engines, while Fritz is a commercial GUI that can run various engines.
- **explanation_incorrect — po:** Komodo and Houdini are proprietary engines; Fritz is a commercial chess product.

### 65. Which algorithm is utilized in grid-based pathfinding to explore all neighbor nodes layer by layer, guaranteeing the shortest path in unweighted graphs?
- **options — przed:** ["Breadth-First Search", "Depth-First Search", "Dijkstra's Algorithm", "A*"]
- **options — po:** ["Breadth-First Search", "Depth-First Search", "Minimax", "Alpha-beta pruning"]
- **explanation_incorrect — przed:** Depth-First Search explores paths completely, while Dijkstra and A* are optimized for weighted, cost-based paths.
- **explanation_incorrect — po:** Depth-first search explores along branches, while minimax and alpha-beta pruning are adversarial game-tree methods. Dijkstra’s algorithm can also find shortest paths in an unweighted graph.

### 66. What CRYENGINE AI subsystem is designed to query possible tactical locations, such as places to take cover?
- **question — przed:** What specific tactical system did Crysis employ to manage the coordinated group behavior and communication of enemy squads?
- **question — po:** What CRYENGINE AI subsystem is designed to query possible tactical locations, such as places to take cover?
- **options — przed:** ["Signal Map", "Influence Map", "Blackboard System", "Goal-Oriented Action Planning"]
- **options — po:** ["Tactical Point System", "Audio mixer", "Texture atlas", "Particle renderer"]
- **answer — przed:** Signal Map
- **answer — po:** Tactical Point System
- **explanation_correct — przed:** The Signal Map allowed NPCs to broadcast local state changes and tactical interests to nearby units.
- **explanation_correct — po:** CRYENGINE documents a Tactical Point System for spatial queries used by game AI.
- **explanation_incorrect — przed:** Influence maps calculate spatial dominance, blackboard systems are global memory repositories, and GOAP is a planning architecture.
- **explanation_incorrect — po:** The other components handle sound or graphics rather than tactical position queries.

### 68. In The Last of Us, what is the ordinary term for AI-controlled characters who accompany and assist the player?
- **question — przed:** What system enables AI partners in The Last of Us to mimic human-like positioning and spatial behavior during stealth sequences?
- **question — po:** In The Last of Us, what is the ordinary term for AI-controlled characters who accompany and assist the player?
- **options — przed:** ["Buddy AI", "Companion Manager", "Follower Logic", "Sidekick Protocol"]
- **options — po:** ["Companions", "Level textures", "Particle emitters", "Skyboxes"]
- **answer — przed:** Buddy AI
- **answer — po:** Companions
- **explanation_correct — przed:** Buddy AI is designed to calculate optimal paths that stay out of the player's way while maintaining visual presence.
- **explanation_correct — po:** Companion characters use AI to follow, assist and respond to the player and environment.
- **explanation_incorrect — przed:** The other options are logical descriptions, not the formal internal technical name for the coordinate-based stealth system.
- **explanation_incorrect — po:** Textures, particle emitters and skyboxes are graphical resources, not companion characters.

### 70. In Dwarf Fortress, which system describes dwarves’ psychological motivations, including needs for social or creative activities?
- **question — przed:** In Dwarf Fortress, what primary internal state engine drives unit behavior by managing requirements like hunger, rest, and social interaction?
- **question — po:** In Dwarf Fortress, which system describes dwarves’ psychological motivations, including needs for social or creative activities?
- **explanation_correct — przed:** The 'Needs' system tracks a character's physical and psychological deficits to prioritize daily AI task scheduling.
- **explanation_correct — po:** Dwarf Fortress models psychological needs and unmet needs can affect focus and mood. Hunger, thirst and tiredness are separate bodily conditions.
- **explanation_incorrect — przed:** Desires, Urges, and Instincts are human terminology that overlaps concepts but do not match the specific game code implementation.
- **explanation_incorrect — po:** Desires, urges and instincts are related general words rather than the named psychological needs system.

### 71. What is the term for the computational process of analyzing geometry to generate a navigable surface for AI characters?
- **explanation_incorrect — przed:** Voxeling is a volumetric measurement, tessellation is for detail, and rasterization is for screen pixels.
- **explanation_incorrect — po:** Voxelization converts geometry to a voxel representation and may be a step in navmesh generation; tessellation subdivides geometry and rasterization maps primitives to samples.

### 73. What feedback can F.E.A.R. enemies give players by shouting that they are flanking or reloading?
- **question — przed:** How did F.E.A.R.'s AI communicate its intentions to the player, giving the impression of complex tactical planning?
- **question — po:** What feedback can F.E.A.R. enemies give players by shouting that they are flanking or reloading?
- **options — przed:** ["Contextual Dialog", "Tactical Barks", "Intent Tags", "Combat Chatter"]
- **options — po:** ["Spoken tactical cues", "A revised skybox", "A loading screen", "An inventory icon"]
- **answer — przed:** Contextual Dialog
- **answer — po:** Spoken tactical cues
- **explanation_correct — przed:** Contextual Dialog allows enemies to describe their maneuvers, such as flanking or reloading, to the player dynamically.
- **explanation_correct — po:** Context-sensitive combat dialogue can announce an enemy’s actions and make its tactical behavior legible to players.
- **explanation_incorrect — przed:** Combat chatter and tactical barks are common industry jargon, but not the specific terminology for F.E.A.R.'s system.
- **explanation_incorrect — po:** Skyboxes, loading screens and inventory icons are not the spoken cues described.

### 75. What search technique is used by strong engines at the end of tactical variations to ensure the evaluation is stable and not captured by temporary blunders?
- **explanation_correct — przed:** Quiescence search continues searching captures and checks until a 'quiet' position is reached to evaluate reliably.
- **explanation_correct — po:** Quiescence search extends evaluation beyond a normal depth limit for selected forcing moves, often including captures, to reduce evaluation of unstable positions. The exact move set varies by engine.

### 76. In the AlphaGo architecture, which component outputs the probability distribution of potential next moves?
- **explanation_correct — przed:** The policy network behaves as the actor, predicting which move a professional player would most likely choose.
- **explanation_correct — po:** A policy network assigns move probabilities. AlphaGo versions used different combinations of supervised and reinforcement learning, so the network need not always predict a human move.

### 79. Which kind of query can a game AI use to score candidate locations for cover or line of sight?
- **question — przed:** What geometry-based representation helps an AI identify height cover, exposure, and sniper lanes in a 3D environment?
- **question — po:** Which kind of query can a game AI use to score candidate locations for cover or line of sight?
- **options — przed:** ["Tactical Mesh", "Strategic Map", "Vantage Points", "Cover Grid"]
- **options — po:** ["Spatial query", "Audio equalization", "Texture compression", "Frame interpolation"]
- **answer — przed:** Tactical Mesh
- **answer — po:** Spatial query
- **explanation_correct — przed:** The tactical mesh assigns metadata to level surfaces, allowing AI to query for specific positional advantages.
- **explanation_correct — po:** Spatial queries can generate and evaluate candidate locations using tests such as distance, visibility and cover.
- **explanation_incorrect — przed:** Strategic maps and cover grids describe high-level data, while Vantage Points refer to singular locations.
- **explanation_incorrect — po:** The other options address audio or graphics rather than tactical position selection.

### 80. Which DeepMind agent learns a model of game dynamics and combines it with tree search, without being given the game rules?
- **question — przed:** Which generalist machine learning agent developed by DeepMind is capable of learning games from scratch without using search trees as a component?
- **question — po:** Which DeepMind agent learns a model of game dynamics and combines it with tree search, without being given the game rules?
- **explanation_correct — przed:** MuZero learns by internally building a model of the environment's dynamics, effectively playing without needing the rules provided.
- **explanation_correct — po:** MuZero learns a model for planning and uses Monte Carlo tree search with that model; it was evaluated on Go, chess, shogi and Atari.
- **explanation_incorrect — przed:** AlphaZero utilizes Monte Carlo Tree Search, and the other names are fictional or unrelated to specialized models.
- **explanation_incorrect — po:** AlphaZero uses game rules and tree search; the other options are not the named DeepMind system.

### 82. Which distance metric calculates movement on a grid where only vertical and horizontal steps are permitted?
- **options — przed:** ["Manhattan Distance", "Chebyshev Distance", "Minkowski Distance", "Hamming Distance"]
- **options — po:** ["Manhattan Distance", "Chebyshev Distance", "Euclidean Distance", "Cosine Similarity"]
- **explanation_incorrect — przed:** These are alternative mathematical distance metrics that calculate space difference differently, such as diagonal or multi-dimensional paths.
- **explanation_incorrect — po:** Chebyshev and Euclidean distance use different formulas; cosine similarity compares direction. Manhattan distance is a special case of Minkowski distance, so the latter is not a distinct competing answer here.

### 84. Which algorithm is commonly used in game AI to navigate high branching factor environments (like Go) via statistical sampling?
- **explanation_correct — przed:** Monte Carlo Tree Search (MCTS) uses random simulations to evaluate the potential of moves, making it ideal for games with vast search spaces.
- **explanation_correct — po:** Monte Carlo Tree Search evaluates moves through repeated simulations or estimated outcomes while allocating more search to promising branches.
- **explanation_incorrect — przed:** Alpha-Beta Pruning is a Minimax optimization, while BFS and Iterative Deepening are exhaustive searches unsuitable for high branching factors.
- **explanation_incorrect — po:** Alpha-beta pruning improves minimax; breadth-first search and iterative deepening explore game trees using different strategies.

### 87. What technique did the original Elite use to generate star systems reproducibly from compact data?
- **question — przed:** Which mathematical technique was famously used in the original 1984 Elite game to fit an entire universe of star systems into 22 kilobytes of memory?
- **question — po:** What technique did the original Elite use to generate star systems reproducibly from compact data?
- **explanation_correct — przed:** Elite used a fixed seed and a sequence of pseudo-random numbers to generate planet names and positions consistently across all play sessions.
- **explanation_correct — po:** Elite used deterministic pseudo-random generation from seeds to produce systems and names reproducibly.
- **explanation_incorrect — przed:** L-Systems and Wave Function Collapse are modern procedural techniques, while Voronoi diagrams are used for partitioning space, not generating data from seeds.
- **explanation_incorrect — po:** L-systems, wave function collapse, and Voronoi diagrams are different generation techniques; L-systems predate Elite.

### 90. In the Splinter Cell series, which UI component is primarily used to convey how visible the player is to AI enemies based on lighting?
- **explanation_correct — przed:** The Light Meter (or Light Gem) indicates the player's level of concealment within shadows to help them avoid AI detection.
- **explanation_correct — po:** A light meter indicates the player’s visibility based on illumination. Similar mechanics in other games may use different names.

### 94. Which Civilization-related meme describes a supposedly nuclear-armed Gandhi?
- **question — przed:** Which famous AI quirk involved a specific political leader in Civilization becoming unexpectedly aggressive when switching to democracy?
- **question — po:** Which Civilization-related meme describes a supposedly nuclear-armed Gandhi?
- **explanation_correct — przed:** Nuclear Gandhi refers to the long-standing bug where Gandhi's aggression stats would wrap around to an extreme value.
- **explanation_correct — po:** “Nuclear Gandhi” is a famous meme. Creator Sid Meier rejected the claim that an integer-underflow bug caused the behavior in the original game.
- **explanation_incorrect — przed:** The other options reference historical figures in Civilization but are not associated with the specific famous programming bug.
- **explanation_incorrect — po:** The other options are invented alternatives rather than the established meme name.

### 95. What can happen when subtracting one from zero in an unsigned fixed-width integer type with modular arithmetic?
- **question — przed:** What underlying programming limitation caused the aggressive AI behavior in early Civilization games?
- **question — po:** What can happen when subtracting one from zero in an unsigned fixed-width integer type with modular arithmetic?
- **options — przed:** ["Integer overflow", "Floating point error", "Pointer corruption", "Stack overflow"]
- **options — po:** ["The result wraps to the maximum representable value", "The result becomes negative one", "The variable changes to text", "The program must always terminate"]
- **answer — przed:** Integer overflow
- **answer — po:** The result wraps to the maximum representable value
- **explanation_correct — przed:** Integer overflow occurred because subtracting from an already low aggression value caused the number to wrap to the maximum unsigned value.
- **explanation_correct — po:** Unsigned arithmetic wraps modulo a power of two in languages such as C. This is a general example, not proof of the alleged Nuclear Gandhi bug.
- **explanation_incorrect — przed:** These are common programming errors, but they were not the specific cause of the behavior in this context.
- **explanation_incorrect — po:** A negative value is not representable in an unsigned type; conversion to text and mandatory termination are not inherent consequences.

### 98. What is the name of the open-source upscaling technology developed by AMD as a competitor to hardware-locked solutions?
- **explanation_incorrect — przed:** RSR is a driver-based scaler, while VSR and XSR are not standard industry terms for modern super-resolution upscalers.
- **explanation_incorrect — po:** RSR is a driver-level upscaler and VSR is a real AMD feature for rendering at a higher virtual resolution; neither is the name FidelityFX Super Resolution.

### 99. Which upscaling technology utilizes AI-enhanced XMX cores within modern Intel Arc graphics cards?
- **explanation_correct — przed:** XeSS, or Xe Super Sampling, is Intel's AI-enhanced upscaling technology designed for their GPU architecture.
- **explanation_correct — po:** Intel XeSS uses AI-based upscaling and can run using XMX acceleration on supported Intel GPUs; implementations also support other hardware paths.

### 100. Which type of neural network is specifically structured to handle sequential data, such as timing-based AI inputs in a game?
- **explanation_incorrect — przed:** CNNs are primarily for spatial data (images), and GANs are for data creation, not sequential modeling.
- **explanation_incorrect — po:** CNNs can also be adapted for sequences; GAN is an adversarial training framework. Recurrent networks are characterized by state passed across sequence steps.

## astronomia_i_ukad_soneczny_pl

Liczba pytań: 159. Zmienione rekordy: 47. Zakres merytorycznego przeglądu niepotwierdzony.

### 1. Która planeta Układu Słonecznego miała najwięcej znanych księżyców według ogłoszenia Międzynarodowej Unii Astronomicznej z marca 2026 roku?
- **question — przed:** Która planeta Układu Słonecznego posiada obecnie rekordową liczbę ponad 140 potwierdzonych księżyców?
- **question — po:** Która planeta Układu Słonecznego miała najwięcej znanych księżyców według ogłoszenia Międzynarodowej Unii Astronomicznej z marca 2026 roku?
- **explanation_correct — przed:** Saturn posiada obecnie więcej potwierdzonych księżyców niż Jowisz, co zostało ogłoszone po odkryciu nowej grupy małych satelitów w 2023 roku.
- **explanation_correct — po:** Według ogłoszenia MUA z 26 marca 2026 r. znano 285 księżyców Saturna i 101 księżyców Jowisza. Liczby te mogą się zmieniać wraz z nowymi odkryciami.

### 6. Która planeta Układu Słonecznego wykonuje jeden obrót względem gwiazd w około 243 ziemskie doby?
- **question — przed:** Która planeta Układu Słonecznego ma najdłuższy dzień, trwający około 243 ziemskie doby?
- **question — po:** Która planeta Układu Słonecznego wykonuje jeden obrót względem gwiazd w około 243 ziemskie doby?
- **explanation_correct — przed:** Obrót Wenus wokół własnej osi trwa dłużej niż jej obieg wokół Słońca (rok wenusjański trwa 225 dni ziemskich).
- **explanation_correct — po:** Wenus wykonuje obrót względem gwiazd w około 243 ziemskie doby, dłużej niż trwa jej obieg wokół Słońca. Jej doba słoneczna trwa około 117 ziemskich dób.

### 8. Który lodowy księżyc Jowisza jest celem misji Europa Clipper badającej warunki sprzyjające życiu?
- **question — przed:** Który z księżyców Jowisza jest celem misji poszukujących życia z powodu oceanu ciekłej wody pod lodową skorupą?
- **question — po:** Który lodowy księżyc Jowisza jest celem misji Europa Clipper badającej warunki sprzyjające życiu?
- **explanation_correct — przed:** Europa pod swoją kilkunastokilometrową pokrywą lodową skrywa ocean zawierający więcej wody niż wszystkie oceany Ziemi razem wzięte.
- **explanation_correct — po:** Pod lodową skorupą Europy prawdopodobnie znajduje się globalny ocean. Europa Clipper bada możliwość występowania warunków do życia, ale nie jest misją bezpośrednio wykrywającą życie.
- **explanation_incorrect — przed:** Io jest wulkaniczna i sucha, Ganimedes ma lód i skały, a Kallisto jest geologicznie mało aktywna.
- **explanation_incorrect — po:** Io jest aktywna wulkanicznie; Ganimedes i Kallisto także mogą kryć podlodowe oceany, ale celem misji Europa Clipper jest Europa.

### 10. Jak nazywa się pobliska duża galaktyka spiralna znana również jako M31?
- **question — przed:** Jak nazywa się najbliższa naszej Drodze Mlecznej duża galaktyka spiralna, z którą zderzymy się za około 4,5 miliarda lat?
- **question — po:** Jak nazywa się pobliska duża galaktyka spiralna znana również jako M31?
- **explanation_correct — przed:** Galaktyka Andromedy (M31) znajduje się około 2,5 miliona lat świetlnych od Ziemi i zbliża się do nas z prędkością 110 km/s.
- **explanation_correct — po:** Andromeda znajduje się około 2,5 miliona lat świetlnych od Ziemi i zbliża się do Drogi Mlecznej. Badanie z 2025 r. wskazuje, że jej przyszłe połączenie z naszą galaktyką pozostaje niepewne.

### 11. Jak nazywa się obiekt, którego horyzont zdarzeń uniemożliwia ucieczkę światła do odległego obserwatora?
- **question — przed:** Czym staje się masywna gwiazda pod koniec swojego życia, gdy zapada się grawitacyjnie do punktu o nieskończonej gęstości?
- **question — po:** Jak nazywa się obiekt, którego horyzont zdarzeń uniemożliwia ucieczkę światła do odległego obserwatora?
- **explanation_incorrect — przed:** Biały karzeł to pozostałość po mało masywnych gwiazdach, gwiazda neutronowa powstaje przy mniejszej masie, a czerwony olbrzym to przedostatnie stadium życia gwiazdy.
- **explanation_incorrect — po:** Biały karzeł i gwiazda neutronowa są zwartymi pozostałościami gwiazd, ale nie mają horyzontu zdarzeń. Czerwony olbrzym jest stadium ewolucji gwiazdy.

### 12. Jak nazywa się bardzo gęsta pozostałość po supernowej, zbudowana głównie z neutronów?
- **options — przed:** ["Gwiazda neutronowa", "Biały karzeł", "Czarna dziura", "Magnetar"]
- **options — po:** ["Gwiazda neutronowa", "Biały karzeł", "Czarna dziura", "Czerwony olbrzym"]
- **explanation_incorrect — przed:** Biały karzeł to pozostałość po gwiazdach podobnych do Słońca, czarna dziura ma horyzont zdarzeń, a magnetar jest szczególnym typem gwiazdy neutronowej.
- **explanation_incorrect — po:** Biały karzeł jest pozostałością po mniej masywnej gwieździe, czarna dziura ma horyzont zdarzeń, a czerwony olbrzym jest stadium ewolucji gwiazd. Magnetar, nieobecny w odpowiedziach, jest typem gwiazdy neutronowej.

### 13. Która gwiazda jest najjaśniejsza na nocnym niebie Ziemi, położona w gwiazdozbiorze Wielkiego Psa?
- **explanation_incorrect — przed:** Kanopus jest drugi pod względem jasności, Arktur trzeci, a Wega piąta.
- **explanation_incorrect — po:** Kanopus, Arktur i Wega należą do najjaśniejszych gwiazd nocnego nieba; ich pozycja w rankingu zależy m.in. od tego, czy układ Alfa Centauri liczony jest łącznie.

### 15. Który niemiecki astronom sformułował trzy prawa opisujące ruch planet po orbitach eliptycznych?
- **explanation_incorrect — przed:** Brahe nie potrafił stworzyć poprawnego modelu matematycznego, Galileusz używał teleskopu do obserwacji księżyców, a Herschel odkrył Urana.
- **explanation_incorrect — po:** Brahe stworzył własny model geoheliocentryczny i dostarczył danych obserwacyjnych; Galileusz używał teleskopu, a Herschel odkrył Urana.

### 16. Który uczony opublikował w 1610 roku teleskopowe obserwacje Księżyca i odkrył cztery największe księżyce Jowisza?
- **question — przed:** Który uczony jako pierwszy skierował teleskop w niebo w 1609 roku, odkrywając kratery na Księżycu i fazy Wenus?
- **question — po:** Który uczony opublikował w 1610 roku teleskopowe obserwacje Księżyca i odkrył cztery największe księżyce Jowisza?
- **explanation_correct — przed:** Galileo Galilei odkrył również cztery największe księżyce Jowisza, co ostatecznie pogrzebało teorię geocentryczną.
- **explanation_correct — po:** Galileusz opublikował obserwacje Księżyca i księżyców Jowisza w „Sidereus Nuncius”. W 1609 r. Księżyc przez teleskop obserwował wcześniej także Thomas Harriot.
- **explanation_incorrect — przed:** Kopernik prowadził obserwacje gołym okiem, Bruno głosił nieskończoność wszechświata, a Newton skonstruował teleskop zwierciadlany.
- **explanation_incorrect — po:** Kopernik obserwował gołym okiem, Bruno nie prowadził tych obserwacji teleskopowych, a Newton skonstruował później reflektor.

### 17. Który angielski fizyk i astronom skonstruował pierwszy działający teleskop zwierciadlany (reflektor) w 1668 roku?
- **explanation_incorrect — przed:** Hooke badał mikroskopy, Huygens odkrył Tytana i pierścienie Saturna, a Halley obliczył orbitę komety.
- **explanation_incorrect — po:** Hooke badał m.in. mikroskopy, Huygens wyjaśnił pierścieniową naturę struktury Saturna i odkrył Tytana, a Halley obliczył orbitę komety.

### 22. Które dwie sondy kosmiczne, wystrzelone w 1977 roku, opuściły heliosferę i badają przestrzeń międzygwiazdową?
- **explanation_correct — przed:** Sondy Voyager przesłały pierwsze zdjęcia z bliska planet olbrzymów i niosą Złotą Płytę dla cywilizacji pozaziemskich.
- **explanation_correct — po:** Obie sondy przekroczyły heliopauzę i badają ośrodek międzygwiazdowy. Niosą też Złote Płyty. Pierwszych przelotów koło Jowisza i Saturna dokonały wcześniej sondy Pioneer.

### 23. Jak nazywa się wielki teleskop kosmiczny wystrzelony w grudniu 2021 roku, który bada kosmos głównie w podczerwieni i jest następcą naukowym Teleskopu Hubble'a?
- **explanation_incorrect — przed:** Kepler służył głównie do poszukiwania planet pozasłonecznych, Nancy Grace Roman jest planowana, a Spitzer był wcześniejszym teleskopem podczerwonym.
- **explanation_incorrect — po:** Kepler szukał planet pozasłonecznych, Roman to kolejny teleskop planowany przez NASA, a Spitzer był wcześniejszym teleskopem podczerwonym. Hubble nadal prowadzi obserwacje.

### 26. Jak nazywa się granica czarnej dziury oddzielająca obszar, z którego sygnały mogą dotrzeć do odległego obserwatora, od obszaru, z którego nie mogą?
- **question — przed:** Jak nazywa się granica wokół czarnej dziury, po przekroczeniu której prędkość ucieczki przewyższa prędkość światła?
- **question — po:** Jak nazywa się granica czarnej dziury oddzielająca obszar, z którego sygnały mogą dotrzeć do odległego obserwatora, od obszaru, z którego nie mogą?
- **explanation_correct — przed:** Wszystko, co przekroczy horyzont zdarzeń, zostaje nieuchronnie wciągnięte do osobliwości w centrum czarnej dziury.
- **explanation_correct — po:** Horyzont zdarzeń jest granicą obszaru, z którego sygnały świetlne nie docierają do odległego obserwatora.
- **explanation_incorrect — przed:** Ergosfera leży na zewnątrz rotującej czarnej dziury, osobliwość to punkt w centrum, a sfera fotonowa to obszar, gdzie światło krąży po orbitach kołowych.
- **explanation_incorrect — po:** Ergosfera występuje na zewnątrz horyzontu wirującej czarnej dziury; osobliwość wskazuje granicę stosowalności klasycznej teorii, a sfera fotonowa wiąże się z orbitami światła.

### 27. Która planeta skalista ma gęstą atmosferę złożoną głównie z dwutlenku węgla i bardzo silny efekt cieplarniany?
- **question — przed:** Która planeta Układu Słonecznego ma najgęstszą atmosferę, złożoną głównie z dwutlenku węgla, powodującą ekstremalny efekt cieplarniany?
- **question — po:** Która planeta skalista ma gęstą atmosferę złożoną głównie z dwutlenku węgla i bardzo silny efekt cieplarniany?

### 35. Jak nazywa się olbrzymi antycyklon w atmosferze Jowisza, obserwowany od XIX wieku?
- **question — przed:** Jak nazywa się ogromny, wirujący antycyklon na Jowiszu, szalejący od co najmniej 300 lat?
- **question — po:** Jak nazywa się olbrzymi antycyklon w atmosferze Jowisza, obserwowany od XIX wieku?
- **explanation_correct — przed:** Wielka Czerwona Plama jest większa od średnicy Ziemi, a wiatry na jej obrzeżach wieją z prędkościami przekraczającymi 400 km/h.
- **explanation_correct — po:** Wielka Czerwona Plama to długotrwała burza większa od Ziemi. Nie ma pewności, czy XVII-wieczne obserwacje dotyczyły tej samej plamy.

### 37. Jak nazywają się dwa małe, nieregularne księżyce Marsa?
- **question — przed:** Które dwa małe, nieregularne księżyce Marsa zostały prawdopodobnie przechwycone z pasa planetoid?
- **question — po:** Jak nazywają się dwa małe, nieregularne księżyce Marsa?
- **explanation_correct — przed:** Fobos (Strach) i Deimos (Trwoga) krążą bardzo blisko Marsa i mają skład przypominający asteroidy typu C.
- **explanation_correct — po:** Fobos i Deimos to dwa znane księżyce Marsa. Ich pochodzenie pozostaje przedmiotem badań; rozważane są m.in. przechwycenie i powstanie po wielkim zderzeniu.

### 38. Która planeta znajduje się najbliżej Słońca i ma bardzo rozrzedzoną egzosferę oraz duże wahania temperatury?
- **question — przed:** Która planeta jest najbliżej Słońca, charakteryzując się brakiem atmosfery i ogromnymi dobowymi wahaniami temperatury?
- **question — po:** Która planeta znajduje się najbliżej Słońca i ma bardzo rozrzedzoną egzosferę oraz duże wahania temperatury?
- **explanation_correct — przed:** Na Merkurym temperatura w dzień rośnie do 430°C, a w nocy spada do -180°C z powodu braku gazów zatrzymujących ciepło.
- **explanation_correct — po:** Na Merkurym temperatura może osiągać około 430°C w dzień i spadać do około −180°C nocą. Jego bardzo rzadka egzosfera nie zatrzymuje efektywnie ciepła.

### 41. Jak nazywa się pozostałość po gwieździe o masie zbliżonej do Słońca, która odrzuciła zewnętrzne warstwy i odsłoniła gorące, gęste jądro?
- **question — przed:** Jak nazywa się faza ewolucji gwiazdy o masie zbliżonej do Słońca, gdy odrzuci ona zewnętrzne warstwy, pozostawiając gorące, węglowe jądro?
- **question — po:** Jak nazywa się pozostałość po gwieździe o masie zbliżonej do Słońca, która odrzuciła zewnętrzne warstwy i odsłoniła gorące, gęste jądro?
- **explanation_correct — przed:** Biały karzeł świeci wyłącznie dzięki zgromadzonemu wcześniej ciepłu i powoli stygnie przez biliony lat.
- **explanation_correct — po:** Biały karzeł to odsłonięte, gorące jądro po ewolucji gwiazdy o małej lub średniej masie. Typowy biały karzeł po gwieździe podobnej do Słońca składa się głównie z węgla i tlenu i stopniowo stygnie.

### 42. Jak nazywa się obiekt podgwiazdowy o zbyt małej masie, by przez długi czas podtrzymywać syntezę zwykłego wodoru w jądrze?
- **question — przed:** Jak nazywa się obiekt podgwiazdowy o masie zbyt małej do rozpoczęcia syntezy wodoru, zwany potocznie 'nieudaną gwiazdą'?
- **question — po:** Jak nazywa się obiekt podgwiazdowy o zbyt małej masie, by przez długi czas podtrzymywać syntezę zwykłego wodoru w jądrze?
- **explanation_correct — przed:** Brązowe karły mają masę od 13 do 80 mas Jowisza i są w stanie spalać jedynie deuter lub lit w swoich jądrach.
- **explanation_correct — po:** Brązowe karły nie podtrzymują długotrwałej syntezy wodoru. Dostatecznie masywne mogą przez pewien czas spalać deuter, a niektóre także lit.
- **explanation_incorrect — przed:** Czerwony karzeł spala wodór, biały karzeł to martwa gwiazda, a planeta jowiszowa nie ma fuzji jądrowej.
- **explanation_incorrect — po:** Czerwony karzeł jest gwiazdą spalającą wodór, biały karzeł pozostałością gwiazdową, a planeta jowiszowa ma odmienną klasyfikację.

### 48. Która astronomka dostarczyła ważnych obserwacyjnych dowodów na obecność ciemnej materii, badając krzywe rotacji galaktyk spiralnych?
- **question — przed:** Która amerykańska astronomka udowodniła w latach 70. istnienie ciemnej materii, badając krzywe rotacji galaktyk spiralnych?
- **question — po:** Która astronomka dostarczyła ważnych obserwacyjnych dowodów na obecność ciemnej materii, badając krzywe rotacji galaktyk spiralnych?
- **explanation_correct — przed:** Rubin wykazała, że zewnętrzne gwiazdy w galaktykach poruszają się tak samo szybko jak te w centrum, co wymagało istnienia niewidocznej masy.
- **explanation_correct — po:** Vera Rubin i jej współpracownicy wykazali, że prędkości orbitalne gwiazd na obrzeżach galaktyk pozostają wysokie, co wskazuje na obecność dodatkowej niewidocznej masy.

### 60. Która planeta ma szczególnie rozbudowany system pierścieni, którego pierścieniową naturę wyjaśnił Christiaan Huygens?
- **question — przed:** Które z ciał Układu Słonecznego ma najbardziej wyrazisty i rozbudowany system pierścieni, odkryty przez Galileusza?
- **question — po:** Która planeta ma szczególnie rozbudowany system pierścieni, którego pierścieniową naturę wyjaśnił Christiaan Huygens?
- **explanation_correct — przed:** Pierścienie Saturna składają się w 99% z lodu wodnego z domieszką pyłu krzemionkowego i rozciągają się na tysiące kilometrów przy grubości zaledwie ok. 10 metrów.
- **explanation_correct — po:** Galileusz dostrzegł dziwny kształt Saturna, natomiast Huygens rozpoznał, że otacza go pierścień. System składa się przede wszystkim z cząstek lodu wodnego.

### 63. Jak nazywa się największa planeta karłowata w pasie planetoid między Marsem a Jowiszem, będąca pierwszym odkrytym takim obiektem w 1801 roku?
- **explanation_correct — przed:** Ceres skupia w sobie około 1/3 masy całego pasa planetoid i jako jedyna w tym pasie posiada kulisty kształt dzięki własnej grawitacji.
- **explanation_correct — po:** Ceres skupia około jednej trzeciej masy pasa planetoid i jest jedyną oficjalnie uznaną w nim planetą karłowatą. Kształt innych obiektów, takich jak Hygiea, jest przedmiotem badań.

### 94. Jak nazywa się klasa gwiazd zmiennych pulsujących, których zależność okres-jasność służy do pomiaru odległości we Wszechświecie?
- **options — przed:** ["Cefeidy", "T Tauri", "Nowe powrotne", "Zmienne typu RR Lyrae"]
- **options — po:** ["Cefeidy", "T Tauri", "Nowe powrotne", "Mgławice planetarne"]
- **explanation_incorrect — przed:** T Tauri to młode gwiazdy przed ciągiem głównym, nowe powrotne wybuchają cyklicznie, a RR Lyrae mają zwykle krótsze okresy i służą do pomiarów bliższych obiektów.
- **explanation_incorrect — po:** T Tauri to młode gwiazdy, nowe powrotne są obiektami wybuchowymi, a mgławice planetarne są otoczkami gazu. Także gwiazdy RR Lyrae wykazują zależności okres–jasność w odpowiednich pasmach.

### 95. Jak nazywa się klasa aktywnych galaktyk, których rozległe obszary radiowe są zasilane przez dżety z otoczenia supermasywnej czarnej dziury?
- **question — przed:** Jak nazywają się aktywne galaktyki, które emitują silne promieniowanie radiowe z symetrycznych dżetów, zasilanych przez supermasywne czarne dziury?
- **question — po:** Jak nazywa się klasa aktywnych galaktyk, których rozległe obszary radiowe są zasilane przez dżety z otoczenia supermasywnej czarnej dziury?
- **explanation_incorrect — przed:** Galaktyki Seyferta mają bardzo jasne jądra w świetle widzialnym, blazary to aktywne jądra z dżetem skierowanym prosto w Ziemię, a gwiazdotwórcze przechodzą gwałtowny etap formowania gwiazd.
- **explanation_incorrect — po:** Blazary mają dżet skierowany blisko kierunku obserwatora, Seyferty stanowią inną klasę aktywnych jąder, a galaktyki gwiazdotwórcze wyróżnia intensywne powstawanie gwiazd. Klasy aktywnych jąder mogą się nakładać.

### 96. Jak nazywa się aktywna galaktyka o wysokiej jasności jądra, której dżet relatywistyczny jest skierowany bezpośrednio w stronę Ziemi?
- **explanation_incorrect — przed:** Kwazar emituje energię we wszystkich kierunkach, radiogalaktyka ma dżety widoczne z boku, a galaktyka Seyferta to słabsze jądro aktywne.
- **explanation_incorrect — po:** Blazar ma dżet skierowany blisko linii widzenia. Kwazary i radiogalakaktyki są innymi opisowymi klasami aktywnych jąder; ich właściwości i klasyfikacje mogą się nakładać.

### 97. Jak nazywa się przybliżona granica maksymalnej masy stabilnego nierotującego białego karła, wynosząca około 1,4 masy Słońca?
- **question — przed:** Jak nazywa się granica maksymalnej masy stabilnego białego karła, wynosząca około 1,44 masy Słońca, po przekroczeniu której zapada się on w gwiazdę neutronową?
- **question — po:** Jak nazywa się przybliżona granica maksymalnej masy stabilnego nierotującego białego karła, wynosząca około 1,4 masy Słońca?
- **explanation_correct — przed:** Granica Chandrasekhara wynika z ciśnienia zdegenerowanego gazu elektronowego, które nie jest w stanie zrównoważyć grawitacji powyżej 1,44 masy Słońca.
- **explanation_correct — po:** Granica Chandrasekhara wynika z ograniczeń podparcia grawitacji przez zdegenerowane elektrony. Los białego karła zależy od jego składu i okoliczności; nie każdy zapada się w gwiazdę neutronową.
- **explanation_incorrect — przed:** Granica TOV dotyczy gwiazd neutronowych (ok. 2,17 mas Słońca), Roche'a to granica rozrywania pływowego, a horyzont to cecha czarnej dziury.
- **explanation_incorrect — po:** Granica TOV dotyczy nierotujących gwiazd neutronowych, granica Roche’a oddziaływań pływowych, a horyzont zdarzeń jest granicą czarnej dziury.

### 98. Jak nazywa się granica maksymalnej masy stabilnej nierotującej gwiazdy neutronowej?
- **question — przed:** Jak nazywa się granica maksymalnej masy gwiazdy neutronowej, powyżej której zapada się ona nieuchronnie w czarną dziurę?
- **question — po:** Jak nazywa się granica maksymalnej masy stabilnej nierotującej gwiazdy neutronowej?
- **explanation_correct — przed:** Granica TOV wynosi około 2,17 masy Słońca i określa kres ciśnienia zdegenerowanego gazu neutronowego.
- **explanation_correct — po:** Granica Tolmana–Oppenheimera–Volkoffa zależy od równania stanu materii przy ogromnych gęstościach; nie ma jednej dokładnie ustalonej wartości.
- **explanation_incorrect — przed:** Granica Chandrasekhara dotyczy białych karłów, Roche'a ciał rozrywanych pływowo, a promień Schwarzschilda określa rozmiar czarnej dziury.
- **explanation_incorrect — po:** Granica Chandrasekhara dotyczy białych karłów, Roche’a rozrywania pływowego, a promień Schwarzschilda opisuje horyzont nierotującej czarnej dziury.

### 99. Jak nazywa się gwałtowna eksplozja termojądrowa na powierzchni białego karła w ciasnym układzie podwójnym, wywołana akrecją wodoru z sąsiedniej gwiazdy?
- **explanation_incorrect — przed:** Supernowa całkowicie niszczy gwiazdę lub jej jądro, rozbłysk gamma to najsilniejszy impuls energii we wszechświecie, a kilonowa powstaje ze zderzenia gwiazd neutronowych.
- **explanation_incorrect — po:** Niektóre supernowe pozostawiają gwiazdy neutronowe lub czarne dziury. Rozbłysk gamma to krótki silny błysk wysokoenergetycznego promieniowania, a kilonowa może towarzyszyć połączeniu zwartych obiektów.

### 100. Jak nazywa się kataklizmiczna eksplozja powstająca w wyniku zderzenia dwóch gwiazd neutronowych lub gwiazdy neutronowej i czarnej dziury?
- **explanation_correct — przed:** Podczas kilonowej zachodzi gwałtowna fuzja jądrowa (proces r), tworząca ogromne ilości najcięższych pierwiastków, jak złoto i platyna.
- **explanation_correct — po:** W materii wyrzuconej podczas połączenia zwartych obiektów szybki wychwyt neutronów (proces r) może tworzyć ciężkie pierwiastki, m.in. złoto i platynę.

### 101. Jak nazywa się typ supernowej związany z termojądrową eksplozją białego karła w układzie podwójnym?
- **question — przed:** Jak nazywa się typ supernowej powstający w wyniku całkowitej eksplozji termojądrowej białego karła, który przekroczył granicę Chandrasekhara?
- **question — po:** Jak nazywa się typ supernowej związany z termojądrową eksplozją białego karła w układzie podwójnym?
- **explanation_correct — przed:** Supernowe typu Ia mają niemal identyczną jasność absolutną, przez co są używane jako świece standardowe do mierzenia tempa ekspansji wszechświata.
- **explanation_correct — po:** Supernowe typu Ia powstają w układach zawierających białego karła, m.in. w wyniku akrecji lub połączenia białych karłów. Ich jasności standaryzuje się przy pomocy właściwości krzywych blasku.
- **explanation_incorrect — przed:** Typ II i Ib powstają z zapadnięcia jąder masywnych pojedynczych gwiazd, a kilonowa ze zderzenia gwiazd neutronowych.
- **explanation_incorrect — po:** Supernowe typu II i wiele typu Ib wiąże się z zapadaniem jąder masywnych gwiazd, a kilonowa z połączeniem zwartych obiektów.

### 104. Który astronom w 1933 roku badał brakującą masę gromady galaktyk Warkocza Bereniki?
- **question — przed:** Który szwajcarsko-amerykański astronom w 1933 roku po raz pierwszy postulował istnienie ciemnej materii w gromadach galaktyk, nazywając ją 'dunkle Materie'?
- **question — po:** Który astronom w 1933 roku badał brakującą masę gromady galaktyk Warkocza Bereniki?
- **explanation_incorrect — przed:** Oort badał rotację Drogi Mlecznej i obłok komet, Hubble badał ekspansję, a Baade podzielił gwiazdy na dwie populacje.
- **explanation_incorrect — po:** Oort wcześniej badał dynamikę gwiazd i brakującą masę w Drodze Mlecznej, Hubble badał ekspansję, a Baade populacje gwiazd.

### 110. Jak nazywał się pierwszy radziecki pies wysłany na orbitę okołoziemską na pokładzie Sputnika 2 w listopadzie 1957 roku?
- **explanation_correct — przed:** Łajka była pierwszym żywym stworzeniem na orbicie, jednak zginęła po kilku godzinach z powodu przegrzania kapsuły.
- **explanation_correct — po:** Łajka była pierwszym psem i pierwszym zwierzęciem na orbicie okołoziemskiej. Zginęła podczas lotu wskutek przegrzania.

### 112. Jak nazywa się pierwsza bezzałogowa misja programu NASA, która w listopadzie 2022 roku okrążyła Księżyc testując statek Orion?
- **explanation_incorrect — przed:** Apollo 17 to ostatnie lądowanie na Księżycu w 1972 roku, Constellation to anulowany program, a SLS-1 to nazwa rakiety.
- **explanation_incorrect — po:** Apollo 17 było załogową misją księżycową z 1972 r., Constellation anulowanym programem, a SLS jest nazwą rakiety nośnej.

### 114. Jak nazywa się zjawisko ugięcia światła odległej galaktyki pod wpływem grawitacji bliższego obiektu, tworzące obrazy zwane 'pierścieniami Einsteina'?
- **explanation_incorrect — przed:** Przesunięcie ku czerwieni to efekt rozszerzania wszechświata, aberracja to błąd optyczny, a mikrosoczewkowanie to podtyp zjawiska wywołany przez gwiazdy.
- **explanation_incorrect — po:** Mikrosoczewkowanie jest odmianą soczewkowania, lecz zwykle jego obrazy nie są rozdzielane. Przesunięcie ku czerwieni i aberracja to inne zjawiska.

### 115. Jak nazywa się pozorne kołysanie się Księżyca, dzięki któremu z Ziemi można z czasem zobaczyć około 59% jego powierzchni?
- **question — przed:** Jak nazywa się efekt powolnego zbliżania się i oddalania tarczy Księżyca w trakcie jego orbity, pozwalający dostrzec 59% jego powierzchni z Ziemi?
- **question — po:** Jak nazywa się pozorne kołysanie się Księżyca, dzięki któremu z Ziemi można z czasem zobaczyć około 59% jego powierzchni?
- **explanation_correct — przed:** Libracja wynika z nachylenia orbity Księżyca i jego zmiennej prędkości orbitalnej przy stałej prędkości rotacji.
- **explanation_correct — po:** Libracja wynika m.in. z nachylenia osi i orbity Księżyca oraz zmiennej prędkości orbitalnej przy niemal stałej prędkości obrotu.

### 120. Jak nazywa się obiekt transneptunowy o bardzo wydłużonej orbicie i okresie obiegu rzędu 11 tysięcy lat?
- **question — przed:** Jak nazywa się najbardziej oddalony obiekt transneptunowy o okresie orbitalnym trwającym około 11 400 lat, poruszający się po ekstremalnie wydłużonej orbicie?
- **question — po:** Jak nazywa się obiekt transneptunowy o bardzo wydłużonej orbicie i okresie obiegu rzędu 11 tysięcy lat?
- **explanation_correct — przed:** Sedna zbliża się do Słońca na odległość 76 j.a., a jej aphelium leży w rekordowej odległości blisko 937 j.a.
- **explanation_correct — po:** Sedna porusza się po bardzo wydłużonej orbicie, której peryhelium leży około 76 jednostek astronomicznych od Słońca. Nie należy nazywać jej bezwarunkowo najdalszym obiektem transneptunowym.
- **explanation_incorrect — przed:** Eris krąży znacznie bliżej (ok. 97 j.a. w aphelium), Gonggong to mniejsza planeta karłowata, a Orcus to plutonek krążący w rezonansie z Neptunem.
- **explanation_incorrect — po:** Eris, Gonggong i Orcus również są obiektami transneptunowymi, lecz nie odpowiadają opisowi orbity Sedny.

### 123. Jak nazywa się klasa bardzo starych gwiazd zmiennych o małej masie, należących do II populacji, używana do mierzenia odległości w gromadach kulistych?
- **explanation_incorrect — przed:** Cefeidy to młode, masywne gwiazdy, zmienne typu Mira to czerwone olbrzymy o długim okresie, a Delta Scuti pulsują nieregularnie.
- **explanation_incorrect — po:** Klasyczne cefeidy są na ogół młodsze i masywniejsze, lecz istnieją też cefeidy typu II. Mirydy to czerwone olbrzymy, a gwiazdy Delta Scuti pulsują w różnych modach.

### 128. Jak nazywa się jasna gwiazda w konstelacji Orła, najniższy wierzchołek Trójkąta Letniego, znana z bardzo szybkiej rotacji spłaszczającej jej bieguny?
- **explanation_incorrect — przed:** Deneb i Wega rotują znacznie wolniej, a Fomalhaut leży w Rybie Południowej.
- **explanation_incorrect — po:** Deneb jest nadolbrzymem w Łabędziu, Wega leży w Lutni i sama szybko rotuje, a Fomalhaut leży w Rybie Południowej.

### 132. Jak nazywa się największy księżyc Jowisza i zarazem największy księżyc Układu Słonecznego?
- **question — przed:** Która planeta Układu Słonecznego ma najwięcej znanych księżyców, wyprzedzając pod tym względem Jowisza?
- **question — po:** Jak nazywa się największy księżyc Jowisza i zarazem największy księżyc Układu Słonecznego?
- **options — przed:** ["Saturn", "Jowisz", "Uran", "Neptun"]
- **options — po:** ["Ganimedes", "Europa", "Io", "Kallisto"]
- **answer — przed:** Saturn
- **answer — po:** Ganimedes
- **explanation_correct — przed:** Saturn ma obecnie ponad 140 potwierdzonych księżyców, co czyni go rekordzistą w Układzie Słonecznym.
- **explanation_correct — po:** Ganimedes jest największym księżycem Układu Słonecznego i ma własne pole magnetyczne.
- **explanation_incorrect — przed:** Jowisz zajmuje drugie miejsce z liczbą 95 księżyców, podczas gdy lodowe olbrzymy mają ich znacznie mniej.
- **explanation_incorrect — po:** Europa, Io i Kallisto także należą do księżyców galileuszowych Jowisza, ale są mniejsze.

### 134. Jak nazywa się gęsta pozostałość po supernowej, zbudowana niemal wyłącznie z neutronów utrzymywanych przez ciśnienie zdegenerowanego gazu?
- **explanation_incorrect — przed:** Biały karzeł składa się ze zdegenerowanej materii elektronowej, czarna dziura to obiekt o nieskończonej gęstości, a czerwony karzeł to żyjąca gwiazda.
- **explanation_incorrect — po:** Biały karzeł jest podtrzymywany głównie przez ciśnienie zdegenerowanych elektronów, czarna dziura ma horyzont zdarzeń, a czerwony karzeł jest gwiazdą ciągu głównego.

### 135. Który wystrzelony w 2003 roku teleskop kosmiczny badał Wszechświat w podczerwieni, zanim zakończył misję w 2020 roku?
- **question — przed:** Jak nazywa się wielki teleskop kosmiczny wystrzelony w grudniu 2021 roku, który bada kosmos w podczerwieni i zastąpił Teleskop Hubble'a?
- **question — po:** Który wystrzelony w 2003 roku teleskop kosmiczny badał Wszechświat w podczerwieni, zanim zakończył misję w 2020 roku?
- **options — przed:** ["Kosmiczny Teleskop Jamesa Webba", "Kosmiczny Teleskop Keplera", "Kosmiczny Teleskop Nancy Grace Roman", "Teleskop Kosmiczny Spitzer"]
- **options — po:** ["Teleskop Kosmiczny Spitzer", "Kosmiczny Teleskop Jamesa Webba", "Kosmiczny Teleskop Keplera", "Kosmiczny Teleskop Hubble’a"]
- **answer — przed:** Kosmiczny Teleskop Jamesa Webba
- **answer — po:** Teleskop Kosmiczny Spitzer
- **explanation_correct — przed:** JWST posiada zwierciadło o średnicy 6,5 metra pokryte złotem i stacjonuje w punkcie libracyjnym L2.
- **explanation_correct — po:** Spitzer obserwował w podczerwieni w latach 2003–2020. Teleskop Jamesa Webba kontynuuje badania podczerwone nowymi instrumentami.
- **explanation_incorrect — przed:** Kepler szukał planet pozasłonecznych, Nancy Roman jest w budowie, a Spitzer to starszy teleskop podczerwony.
- **explanation_incorrect — po:** Webb wystartował w 2021 r.; Kepler służył przede wszystkim do poszukiwania egzoplanet, a Hubble obserwuje głównie w świetle widzialnym i ultrafiolecie.

### 136. Jak nazywa się obszar położony na zewnątrz horyzontu zdarzeń wirującej czarnej dziury, w którym czasoprzestrzeń jest wleczona przez jej obrót?
- **question — przed:** Jak nazywa się granica wokół czarnej dziury, po przekroczeniu której prędkość ucieczki jest wyższa od prędkości światła?
- **question — po:** Jak nazywa się obszar położony na zewnątrz horyzontu zdarzeń wirującej czarnej dziury, w którym czasoprzestrzeń jest wleczona przez jej obrót?
- **options — przed:** ["Horyzont zdarzeń", "Ergosfera", "Osobliwość", "Sfera fotonowa"]
- **options — po:** ["Ergosfera", "Osobliwość", "Dysk protoplanetarny", "Pas Kuipera"]
- **answer — przed:** Horyzont zdarzeń
- **answer — po:** Ergosfera
- **explanation_correct — przed:** Horyzont zdarzeń wyznacza sferę, z której żadna informacja ani materia nie jest w stanie wydostać się na zewnątrz.
- **explanation_correct — po:** Ergosfera otacza zewnętrzny horyzont wirującej czarnej dziury. Obiekt może z niej uciec, jeśli nie przekroczył horyzontu.
- **explanation_incorrect — przed:** Ergosfera to obszar rotacji czasoprzestrzeni, osobliwość to centrum, a sfera fotonowa to region, w którym światło krąży po orbitach kołowych.
- **explanation_incorrect — po:** Osobliwość nie jest obszarem poza horyzontem, dysk protoplanetarny otacza młodą gwiazdę, a Pas Kuipera jest obszarem Układu Słonecznego.

### 139. Jak nazywa się zjawisko świetlne, które powstaje w atmosferze, gdy drobina materii kosmicznej ulega spaleniu?
- **options — przed:** ["Meteor", "Meteoroid", "Meteoryt", "Bolid"]
- **options — po:** ["Meteor", "Meteoroid", "Meteoryt", "Kometa"]
- **explanation_correct — przed:** Meteor to wyłącznie zjawisko optyczne; obiektem w przestrzeni jest meteoroid, a na powierzchni ziemi – meteoryt.
- **explanation_correct — po:** Meteor jest zjawiskiem świetlnym towarzyszącym wejściu meteoroidu w atmosferę. Bolid to bardzo jasny meteor.
- **explanation_incorrect — przed:** Meteoroid to ciało w kosmosie, meteoryt to to, co spadło na Ziemię, a bolid to wyjątkowo jasny meteor.
- **explanation_incorrect — po:** Meteoroid to ciało w przestrzeni, meteoryt to fragment, który dotarł do powierzchni, a kometa jest obiektem krążącym wokół Słońca.

### 140. Jak nazywa się zależność między odległością galaktyki a jej prędkością oddalania, nazwana na cześć astronomów badających rozszerzanie Wszechświata?
- **question — przed:** Który amerykański astronom w 1929 roku odkrył, że wszechświat się rozszerza, obserwując przesunięcie ku czerwieni widm odległych galaktyk?
- **question — po:** Jak nazywa się zależność między odległością galaktyki a jej prędkością oddalania, nazwana na cześć astronomów badających rozszerzanie Wszechświata?
- **options — przed:** ["Edwin Hubble", "Albert Einstein", "Georges Lemaître", "Harlow Shapley"]
- **options — po:** ["Prawo Hubble’a–Lemaître’a", "Prawo Keplera", "Prawo Archimedesa", "Prawo Snelliusa"]
- **answer — przed:** Edwin Hubble
- **answer — po:** Prawo Hubble’a–Lemaître’a
- **explanation_correct — przed:** Odkrycie Hubble'a dostarczyło kluczowego dowodu na poparcie teorii Wielkiego Wybuchu, a prawo rozszerzania nazwano jego imieniem.
- **explanation_correct — po:** Prawo Hubble’a–Lemaître’a łączy odległości odległych galaktyk z ich prędkościami ucieczki. Lemaître wyprowadził zależność wcześniej, a Hubble opublikował wpływowe obserwacje w 1929 r.
- **explanation_incorrect — przed:** Einstein stworzył teorię względności, Lemaître zaproponował koncepcję pierwotnego atomu, a Shapley mierzył rozmiary Drogi Mlecznej.
- **explanation_incorrect — po:** Prawa Keplera opisują orbity, prawo Archimedesa wypór, a prawo Snelliusa załamanie światła.

### 144. Jak oznaczana jest gromada otwarta Plejady, widoczna w gwiazdozbiorze Byka?
- **question — przed:** Jak nazywa się najbliższa Ziemi gromada otwarta gwiazd, położona w gwiazdozbiorze Byka, znana jako Plejady?
- **question — po:** Jak oznaczana jest gromada otwarta Plejady, widoczna w gwiazdozbiorze Byka?
- **explanation_correct — przed:** Plejady (M45) są widoczne gołym okiem jako mały wózek z 6-7 jasnych gwiazd, otoczonych błękitną mgławicą refleksyjną.
- **explanation_correct — po:** Plejady mają oznaczenie M45. Nie są najbliższą gromadą otwartą Ziemi: Hiady znajdują się bliżej.

### 150. Który francuski astronom opracował katalog obiektów mgławicowych, aby nie mylić ich z kometami?
- **question — przed:** Który francuski astronom opublikował w 1781 roku katalog 110 obiektów głębokiego nieba, aby nie mylić ich z kometami?
- **question — po:** Który francuski astronom opracował katalog obiektów mgławicowych, aby nie mylić ich z kometami?
- **explanation_correct — przed:** Katalog Messiera zawiera najsłynniejsze mgławice, gromady i galaktyki oznaczone literą M (np. M31, M42).
- **explanation_correct — po:** Charles Messier opublikował kolejne wersje katalogu. Dzisiejsza lista 110 obiektów obejmuje późniejsze uzupełnienia; pierwotne wydanie z 1781 r. nie zawierało wszystkich 110.

### 157. Jak nazywa się klasa gwiazd zmiennych pulsujących, których zależność między okresem pulsacji a jasnością absolutną pozwala mierzyć odległości we wszechświecie?
- **options — przed:** ["Cefeidy", "T Tauri", "Nowe powrotne", "Zmienne typu RR Lyrae"]
- **options — po:** ["Cefeidy", "T Tauri", "Nowe powrotne", "Mgławice planetarne"]
- **explanation_incorrect — przed:** T Tauri to młode gwiazdy przed ciągiem głównym, nowe powrotne wybuchają cyklicznie, a RR Lyrae to starsze gwiazdy o krótszych okresach.
- **explanation_incorrect — po:** T Tauri to młode gwiazdy, nowe powrotne są obiektami wybuchowymi, a mgławice planetarne są otoczkami gazu. Również gwiazdy RR Lyrae wykazują zależność okres–jasność w odpowiednich pasmach.

## astronomia_uklad_sloneczny_pl

Liczba pytań: 131. Zmienione rekordy: 67. Zakres merytorycznego przeglądu niepotwierdzony.

### 1. Która planeta miała najwięcej potwierdzonych księżyców według zestawienia NASA z marca 2025 roku?
- **question — przed:** Która planeta Układu Słonecznego ma najwięcej znanych księżyców, wyprzedzając Jowisza?
- **question — po:** Która planeta miała najwięcej potwierdzonych księżyców według zestawienia NASA z marca 2025 roku?
- **explanation_correct — przed:** Saturn ma obecnie ponad 140 potwierdzonych księżyców, co plasuje go na pierwszym miejscu w Układzie Słonecznym.
- **explanation_correct — po:** W marcu 2025 r. NASA podawała 274 potwierdzone księżyce Saturna. Liczby znanych księżyców mogą się zmieniać po kolejnych odkryciach i potwierdzeniach.
- **explanation_incorrect — przed:** Jowisz ma 95 księżyców, Uran 28, a Neptun 16. Saturn ma ich znacznie więcej.
- **explanation_incorrect — po:** Jowisz, Uran i Neptun mają liczne księżyce, ale według zestawienia NASA z marca 2025 r. ustępowały Saturnowi.

### 3. Która planeta Układu Słonecznego najszybciej obraca się wokół własnej osi, wykonując obrót względem gwiazd w niecałe 10 godzin?
- **question — przed:** Która planeta Układu Słonecznego ma najkrótszy dzień, obracając się wokół własnej osi w niecałe 10 godzin?
- **question — po:** Która planeta Układu Słonecznego najszybciej obraca się wokół własnej osi, wykonując obrót względem gwiazd w niecałe 10 godzin?
- **explanation_incorrect — przed:** Saturn potrzebuje około 10,7 godziny, Neptun około 16 godzin, a Ziemia 24 godzin.
- **explanation_incorrect — po:** Okres obrotu Saturna to około 10,7 godziny, Neptuna około 16 godzin, a Ziemi względem gwiazd około 23 godzin i 56 minut.

### 6. Która planeta Układu Słonecznego obraca się wokół własnej osi względem gwiazd w około 243 ziemskie doby?
- **question — przed:** Która planeta Układu Słonecznego ma najdłuższy dzień, trwający około 243 ziemskie doby?
- **question — po:** Która planeta Układu Słonecznego obraca się wokół własnej osi względem gwiazd w około 243 ziemskie doby?
- **explanation_correct — przed:** Obrót Wenus wokół własnej osi trwa dłużej niż jej obieg wokół Słońca (rok wenusjański trwa 225 dni ziemskich).
- **explanation_correct — po:** Obrót Wenus względem gwiazd trwa około 243 dni ziemskich, dłużej niż jej obieg wokół Słońca. Doba słoneczna Wenus wynosi natomiast około 117 dni ziemskich.

### 7. Jak nazywa się największy księżyc Neptuna, poruszający się po orbicie wstecznej, który prawdopodobnie został przechwycony z Pasa Kuipera?
- **explanation_correct — przed:** Tryton to jedyny duży księżyc w Układzie Słonecznym o orbicie wstecznej, wykazujący aktywność kriowulkaniczną.
- **explanation_correct — po:** Tryton porusza się po orbicie wstecznej. Obserwowane na nim pióropusze wskazują na aktywność powierzchniową, a przechwycenie z zewnętrznej części Układu Słonecznego jest jednym z modeli jego pochodzenia.

### 8. Który księżyc Jowisza bada misja NASA Europa Clipper pod kątem warunków sprzyjających życiu?
- **question — przed:** Który z księżyców Jowisza jest celem misji poszukujących życia z powodu oceanu ciekłej wody pod lodową skorupą?
- **question — po:** Który księżyc Jowisza bada misja NASA Europa Clipper pod kątem warunków sprzyjających życiu?
- **explanation_correct — przed:** Europa pod swoją kilkunastokilometrową pokrywą lodową skrywa ocean zawierający więcej wody niż wszystkie oceany Ziemi razem wzięte.
- **explanation_correct — po:** Europa Clipper ma zbadać m.in. lodową skorupę i podpowierzchniowy ocean Europy oraz ocenić potencjalną przydatność tego środowiska do życia; nie jest misją bezpośrednio wykrywającą życie.
- **explanation_incorrect — przed:** Io jest wulkaniczna i sucha, Ganimedes ma lód i skały, a Kallisto jest geologicznie mało aktywna.
- **explanation_incorrect — po:** Io jest silnie aktywna wulkanicznie. Ganimedes i Kallisto także mogą skrywać oceany, lecz celem Europy Clipper jest Europa.

### 10. Która duża galaktyka spiralna jest najbliższą sąsiadką Drogi Mlecznej?
- **question — przed:** Jak nazywa się najbliższa naszej Drodze Mlecznej duża galaktyka spiralna, z którą zderzymy się za około 4,5 miliarda lat?
- **question — po:** Która duża galaktyka spiralna jest najbliższą sąsiadką Drogi Mlecznej?
- **explanation_correct — przed:** Galaktyka Andromedy (M31) znajduje się około 2,5 miliona lat świetlnych od Ziemi i zbliża się do nas z prędkością 110 km/s.
- **explanation_correct — po:** Galaktyka Andromedy znajduje się około 2,5 miliona lat świetlnych od nas. Wynik przyszłego spotkania nie jest pewny: badania opublikowane w 2025 r. wskazują, że zderzenie w ciągu 10 miliardów lat jest tylko jednym z możliwych scenariuszy.

### 11. Jak nazywa się obiekt, który może powstać po zapadnięciu się jądra bardzo masywnej gwiazdy i z którego wnętrza nie mogą wydostać się nawet sygnały świetlne?
- **question — przed:** Czym staje się masywna gwiazda pod koniec swojego życia, gdy zapada się grawitacyjnie do punktu o nieskończonej gęstości?
- **question — po:** Jak nazywa się obiekt, który może powstać po zapadnięciu się jądra bardzo masywnej gwiazdy i z którego wnętrza nie mogą wydostać się nawet sygnały świetlne?
- **explanation_incorrect — przed:** Biały karzeł to pozostałość po mało masywnych gwiazdach, gwiazda neutronowa powstaje przy mniejszej masie, a czerwony olbrzym to przedostatnie stadium życia gwiazdy.
- **explanation_incorrect — po:** Biały karzeł jest pozostałością po mniej masywnej gwieździe, gwiazda neutronowa jest innym możliwym pozostałym obiektem, a czerwony olbrzym to etap ewolucji gwiazdy.

### 12. Jak nazywa się bardzo gęsta pozostałość po zapadnięciu jądra niektórych masywnych gwiazd, złożona w dużej części z neutronów?
- **question — przed:** Jak nazywa się gęsta pozostałość po supernowej, zbudowana niemal wyłącznie z cząstek elementarnych bez ładunku elektrycznego?
- **question — po:** Jak nazywa się bardzo gęsta pozostałość po zapadnięciu jądra niektórych masywnych gwiazd, złożona w dużej części z neutronów?
- **options — przed:** ["Gwiazda neutronowa", "Biały karzeł", "Czarna dziura", "Magnetar"]
- **options — po:** ["Gwiazda neutronowa", "Biały karzeł", "Czarna dziura", "Mgławica planetarna"]
- **explanation_correct — przed:** Gwiazdy neutronowe mają średnicę zaledwie około 20 kilometrów, lecz ich łyżeczka materii waży miliardy ton.
- **explanation_correct — po:** Gwiazda neutronowa jest pozostałością po zapadnięciu jądra masywnej gwiazdy. Neutrony nie są cząstkami elementarnymi: składają się z kwarków.
- **explanation_incorrect — przed:** Biały karzeł składa się ze zdegenerowanej materii elektronowej, czarna dziura nie ma powierzchni, a magnetar to specyficzny typ gwiazdy neutronowej o silnym polu magnetycznym.
- **explanation_incorrect — po:** Biały karzeł jest inną zwartą pozostałością, czarna dziura ma horyzont zdarzeń, a mgławica planetarna jest gazową otoczką. Magnetar jest rodzajem gwiazdy neutronowej.

### 15. Który niemiecki astronom sformułował trzy prawa opisujące ruch planet po orbitach eliptycznych?
- **explanation_incorrect — przed:** Brahe nie potrafił stworzyć poprawnego modelu matematycznego, Galileusz używał teleskopu do obserwacji księżyców, a Herschel odkrył Urana.
- **explanation_incorrect — po:** Brahe opracował własny model geoheliocentryczny i dostarczył dokładnych danych obserwacyjnych. Galileusz obserwował księżyce Jowisza, a Herschel odkrył Urana.

### 16. Który uczony prowadził na początku XVII wieku obserwacje teleskopowe Księżyca, faz Wenus oraz czterech dużych księżyców Jowisza?
- **question — przed:** Który uczony jako pierwszy skierował teleskop w niebo w 1609 roku, odkrywając kratery na Księżycu i fazy Wenus?
- **question — po:** Który uczony prowadził na początku XVII wieku obserwacje teleskopowe Księżyca, faz Wenus oraz czterech dużych księżyców Jowisza?
- **explanation_correct — przed:** Galileo Galilei odkrył również cztery największe księżyce Jowisza, co ostatecznie pogrzebało teorię geocentryczną.
- **explanation_correct — po:** Galileusz obserwował m.in. ukształtowanie Księżyca, fazy Wenus i cztery duże księżyce Jowisza. Nie był jedynym pionierem teleskopowych obserwacji nieba; wyniki podważały część ówczesnych modeli geocentrycznych.

### 17. Który angielski fizyk i astronom skonstruował pierwszy działający teleskop zwierciadlany (reflektor) w 1668 roku?
- **explanation_incorrect — przed:** Hooke badał mikroskopy, Huygens odkrył Tytana i pierścienie Saturna, a Halley obliczył orbitę komety.
- **explanation_incorrect — po:** Hooke badał m.in. optykę, Huygens odkrył Tytana i wyjaśnił naturę pierścieni Saturna, które wcześniej obserwował Galileusz, a Halley obliczył orbitę komety.

### 22. Które dwie sondy kosmiczne, wystrzelone w 1977 roku, opuściły heliosferę i badają przestrzeń międzygwiazdową?
- **explanation_correct — przed:** Sondy Voyager przesłały pierwsze zdjęcia z bliska planet olbrzymów i niosą Złotą Płytę dla cywilizacji pozaziemskich.
- **explanation_correct — po:** Sondy Voyager zbadały z bliska planety olbrzymy i zabrały Złote Płyty. Wcześniej Pioneer 10 i 11 fotografowały z bliska Jowisza, a Pioneer 11 także Saturna.

### 23. Jak nazywa się kosmiczny teleskop wystrzelony w grudniu 2021 roku, który obserwuje wszechświat głównie w podczerwieni?
- **question — przed:** Jak nazywa się wielki teleskop kosmiczny wystrzelony w grudniu 2021 roku, który bada kosmos w podczerwieni i zastąpił Teleskop Hubble'a?
- **question — po:** Jak nazywa się kosmiczny teleskop wystrzelony w grudniu 2021 roku, który obserwuje wszechświat głównie w podczerwieni?
- **explanation_correct — przed:** JWST posiada zwierciadło o średnicy 6,5 metra pokryte złotem i stacjonuje w punkcie libracyjnym L2.
- **explanation_correct — po:** Teleskop Jamesa Webba ma segmentowe zwierciadło o średnicy 6,5 m i krąży wokół Słońca w pobliżu punktu L2 układu Słońce–Ziemia. Jego obserwacje uzupełniają badania Hubble’a.
- **explanation_incorrect — przed:** Kepler szukał planet pozasłonecznych, Nancy Roman jest w budowie, a Spitzer to starszy teleskop podczerwony.
- **explanation_incorrect — po:** Kepler szukał egzoplanet, Spitzer był wcześniejszym teleskopem podczerwonym, a teleskop Nancy Grace Roman to osobna misja NASA.

### 24. Jak nazywa się zjawisko przejścia jednej planety przed tarczą Słońca obserwowane z Ziemi?
- **explanation_incorrect — przed:** Zaćmienie dotyczy ciał o podobnym rozmiarze kątowym (np. Księżyca), okultacja to zakrycie gwiazdy przez planetę, a koniunkcja to pozorne zbliżenie ciał na niebie.
- **explanation_incorrect — po:** Okultacja oznacza zakrycie dalszego obiektu przez pozornie większy obiekt. Zaćmienie może polegać na zasłonięciu źródła światła lub wejściu w cień, a koniunkcja to zbliżenie kątowe na niebie.

### 26. Jak nazywa się granica czarnej dziury, zza której sygnały nie mogą dotrzeć do dalekiego obserwatora?
- **question — przed:** Jak nazywa się granica wokół czarnej dziury, po przekroczeniu której prędkość ucieczki przewyższa prędkość światła?
- **question — po:** Jak nazywa się granica czarnej dziury, zza której sygnały nie mogą dotrzeć do dalekiego obserwatora?
- **explanation_correct — przed:** Wszystko, co przekroczy horyzont zdarzeń, zostaje nieuchronnie wciągnięte do osobliwości w centrum czarnej dziury.
- **explanation_correct — po:** Horyzont zdarzeń oddziela obszar, z którego sygnały mogą dotrzeć do dalekiego obserwatora, od obszaru, z którego nie mogą.
- **explanation_incorrect — przed:** Ergosfera leży na zewnątrz rotującej czarnej dziury, osobliwość to punkt w centrum, a promień Schwarzschilda określa fizyczny rozmiar horyzontu.
- **explanation_incorrect — po:** Ergosfera leży na zewnątrz horyzontu rotującej czarnej dziury, osobliwość oznacza granicę stosowalności klasycznej teorii, a promień Schwarzschilda opisuje rozmiar horyzontu nierotującego, nienaładowanego modelu.

### 27. Która planeta skalista ma bardzo gęstą atmosferę złożoną głównie z dwutlenku węgla i bardzo silny efekt cieplarniany?
- **question — przed:** Która planeta Układu Słonecznego ma najgęstszą atmosferę, złożoną głównie z dwutlenku węgla, powodującą ekstremalny efekt cieplarniany?
- **question — po:** Która planeta skalista ma bardzo gęstą atmosferę złożoną głównie z dwutlenku węgla i bardzo silny efekt cieplarniany?

### 30. Jak nazywa się jasny, odległy obiekt zasilany przez supermasywną czarną dziurę, emitujący gigantyczne ilości energii z jądra galaktyki?
- **explanation_correct — przed:** Kwazary to najjaśniejsze obiekty we wszechświecie, widoczne z odległości wielu miliardów lat świetlnych.
- **explanation_correct — po:** Kwazary to wyjątkowo jasne aktywne jądra galaktyk, zasilane akrecją materii wokół supermasywnych czarnych dziur. Można je obserwować z odległości miliardów lat świetlnych.

### 31. Jak nazywa się świecący ślad, który powstaje w atmosferze, gdy drobina materii kosmicznej spala się w niej z dużą prędkością?
- **options — przed:** ["Meteor", "Meteoroid", "Meteoryt", "Bolid"]
- **options — po:** ["Meteor", "Meteoroid", "Meteoryt", "Zorza polarna"]
- **explanation_correct — przed:** Meteor to potocznie spadająca gwiazda, czyli zjawisko świetlne towarzyszące spalaniu meteoroidu w mezosferze.
- **explanation_correct — po:** Meteor to zjawisko świetlne powstające, gdy meteoroid wpada w atmosferę i rozgrzewa otaczający gaz. Bardzo jasny meteor nazywa się bolidem.
- **explanation_incorrect — przed:** Meteoroid to obiekt w kosmosie, meteoryt to fragment, który spadł na ziemię, a bolid to bardzo jasny meteor.
- **explanation_incorrect — po:** Meteoroid jest niewielkim ciałem w przestrzeni, meteoryt to materiał, który dociera do powierzchni, a zorza polarna jest innym zjawiskiem atmosferycznym.

### 35. Jak nazywa się ogromny, wirujący antycyklon obserwowany na Jowiszu od XIX wieku?
- **question — przed:** Jak nazywa się ogromny, wirujący antycyklon na Jowiszu, szalejący od co najmniej 300 lat?
- **question — po:** Jak nazywa się ogromny, wirujący antycyklon obserwowany na Jowiszu od XIX wieku?
- **explanation_correct — przed:** Wielka Czerwona Plama jest większa od średnicy Ziemi, a wiatry na jej obrzeżach wieją z prędkościami przekraczającymi 400 km/h.
- **explanation_correct — po:** Wielka Czerwona Plama jest wielkim antycyklonem na Jowiszu. Nie ma pewności, czy plama opisana w XVII wieku była tą samą burzą.

### 37. Jak nazywają się dwa niewielkie, nieregularne księżyce Marsa?
- **question — przed:** Które dwa małe, nieregularne księżyce Marsa zostały prawdopodobnie przechwycone z pasa planetoid?
- **question — po:** Jak nazywają się dwa niewielkie, nieregularne księżyce Marsa?
- **explanation_correct — przed:** Fobos (Strach) i Deimos (Trwoga) krążą bardzo blisko Marsa i mają skład przypominający asteroidy typu C.
- **explanation_correct — po:** Fobos i Deimos krążą blisko Marsa. Ich pochodzenie pozostaje badane: rozważa się zarówno przechwycenie, jak i powstanie z materii po wielkim zderzeniu.

### 38. Która planeta jest najbliżej Słońca i ma bardzo rzadką egzosferę oraz ogromne dobowe wahania temperatury?
- **question — przed:** Która planeta jest najbliżej Słońca, charakteryzując się brakiem atmosfery i ogromnymi dobowymi wahaniami temperatury?
- **question — po:** Która planeta jest najbliżej Słońca i ma bardzo rzadką egzosferę oraz ogromne dobowe wahania temperatury?
- **explanation_correct — przed:** Na Merkurym temperatura w dzień rośnie do 430°C, a w nocy spada do -180°C z powodu braku gazów zatrzymujących ciepło.
- **explanation_correct — po:** Na Merkurym temperatura powierzchni może w dzień osiągać około 430°C, a w nocy spadać do około −180°C. Jego bardzo rzadka egzosfera nie zatrzymuje ciepła jak gęsta atmosfera.

### 41. Jak nazywa się pozostałość po gwieździe o masie zbliżonej do Słońca, która odrzuciła zewnętrzne warstwy i odsłoniła gorące, gęste jądro?
- **question — przed:** Jak nazywa się faza ewolucji gwiazdy o masie zbliżonej do Słońca, gdy odrzuci ona zewnętrzne warstwy, pozostawiając gorące, węglowe jądro?
- **question — po:** Jak nazywa się pozostałość po gwieździe o masie zbliżonej do Słońca, która odrzuciła zewnętrzne warstwy i odsłoniła gorące, gęste jądro?
- **explanation_correct — przed:** Biały karzeł świeci wyłącznie dzięki zgromadzonemu wcześniej ciepłu i powoli stygnie przez biliony lat.
- **explanation_correct — po:** Biały karzeł to odsłonięte, gorące jądro po ewolucji gwiazdy o małej lub średniej masie. Typowy biały karzeł po gwieździe podobnej do Słońca składa się głównie z węgla i tlenu i stopniowo stygnie.

### 42. Jak nazywa się obiekt podgwiazdowy o masie zbyt małej, aby podtrzymywać syntezę zwykłego wodoru w jądrze?
- **question — przed:** Jak nazywa się obiekt podgwiazdowy o masie zbyt małej do rozpoczęcia syntezy wodoru, zwany potocznie 'nieudaną gwiazdą'?
- **question — po:** Jak nazywa się obiekt podgwiazdowy o masie zbyt małej, aby podtrzymywać syntezę zwykłego wodoru w jądrze?
- **explanation_correct — przed:** Brązowe karły mają masę od 13 do 80 mas Jowisza i są w stanie spalać jedynie deuter lub lit w swoich jądrach.
- **explanation_correct — po:** Brązowe karły nie podtrzymują syntezy zwykłego wodoru jak gwiazdy ciągu głównego, ale niektóre mogą przez pewien czas spalać deuter lub lit. Granice masy zależą od przyjętego modelu.

### 44. Który amerykański astronom opublikował w 1929 roku obserwacyjną zależność między odległościami galaktyk a ich prędkościami ucieczki?
- **question — przed:** Który amerykański astronom w 1929 roku odkrył, że wszechświat się rozszerza, obserwując przesunięcie ku czerwieni widm odległych galaktyk?
- **question — po:** Który amerykański astronom opublikował w 1929 roku obserwacyjną zależność między odległościami galaktyk a ich prędkościami ucieczki?
- **explanation_correct — przed:** Odkrycie Hubble'a dostarczyło kluczowego dowodu na poparcie teorii Wielkiego Wybuchu, a prawo rozszerzania nazwano jego imieniem.
- **explanation_correct — po:** Edwin Hubble zestawił odległości i przesunięcia widm galaktyk, przyczyniając się do ugruntowania obrazu rozszerzającego się wszechświata. Wcześniej Georges Lemaître wyprowadził podobną zależność teoretyczną i wykorzystał dane obserwacyjne.
- **explanation_incorrect — przed:** Einstein stworzył teorię względności, Lemaître zaproponował koncepcję pierwotnego atomu, a Shapley mierzył rozmiary Drogi Mlecznej.
- **explanation_incorrect — po:** Einstein stworzył ogólną teorię względności, Lemaître wcześniej rozważał ekspansję, a Shapley badał m.in. rozmiary Drogi Mlecznej.

### 45. Jak nazywa się belgijski ksiądz i kosmolog, który jako pierwszy zaproponował teorię Wielkiego Wybuchu pod nazwą 'hipotezy pierwotnego atomu'?
- **explanation_correct — przed:** Lemaître opublikował swoje matematyczne wyliczenia w 1927 roku, niezależnie wyprowadzając zależność znaną później jako Prawo Hubble'a-Lemaître'a.
- **explanation_correct — po:** Georges Lemaître badał rozszerzający się wszechświat w 1927 r., a hipotezę pierwotnego atomu przedstawił w 1931 r.
- **explanation_incorrect — przed:** Hubble dokonał weryfikacji obserwacyjnej, Fred Hoyle był przeciwnikiem teorii i ukuł szyderczą nazwę 'Big Bang', a Penzias odkrył promieniowanie tła.
- **explanation_incorrect — po:** Hubble badał zależność między odległością i prędkością galaktyk, Hoyle rozwijał konkurencyjny model stanu stacjonarnego, a Penzias współodkrył mikrofalowe promieniowanie tła.

### 46. Którzy dwaj amerykańscy fizycy przypadkowo odkryli w 1964 roku kosmiczne mikrofalowe promieniowanie tła (CMB), relikt po Wielkim Wybuchu?
- **options — przed:** ["Penzias i Wilson", "Alpher i Gamow", "Hubble i Humason", "Dickey i Peebles"]
- **options — po:** ["Penzias i Wilson", "Alpher i Gamow", "Hubble i Humason", "Dicke i Peebles"]
- **explanation_incorrect — przed:** Alpher i Gamow przewidzieli to promieniowanie teoretycznie w 1948 roku, Hubble i Humason badali galaktyki, a Dickey i Peebles próbowali je wykryć.
- **explanation_incorrect — po:** Alpher i Gamow badali wczesny wszechświat, Hubble i Humason odległe galaktyki, a Dicke i Peebles pracowali nad poszukiwaniem i interpretacją promieniowania reliktowego.

### 48. Która amerykańska astronomka wraz ze współpracownikami wniosła ważny wkład do dowodów na istnienie ciemnej materii, badając krzywe rotacji galaktyk spiralnych?
- **question — przed:** Która amerykańska astronomka udowodniła w latach 70. istnienie ciemnej materii, badając krzywe rotacji galaktyk spiralnych?
- **question — po:** Która amerykańska astronomka wraz ze współpracownikami wniosła ważny wkład do dowodów na istnienie ciemnej materii, badając krzywe rotacji galaktyk spiralnych?
- **explanation_correct — przed:** Rubin wykazała, że zewnętrzne gwiazdy w galaktykach poruszają się tak samo szybko jak te w centrum, co wymagało istnienia niewidocznej masy.
- **explanation_correct — po:** Vera Rubin i Kent Ford mierzyli prędkości gazu i gwiazd w galaktykach spiralnych. Płaskie zewnętrzne części krzywych rotacji stanowią ważną przesłankę istnienia niewidocznej masy.

### 51. Który orbiter misji Cassini-Huygens badał Saturna w latach 2004–2017 i dostarczył próbnik Huygens do Tytana?
- **question — przed:** Która amerykańska sonda kosmiczna badała układ Saturna w latach 2004–2017, zrzucając próbnik Huygens na Tytana?
- **question — po:** Który orbiter misji Cassini-Huygens badał Saturna w latach 2004–2017 i dostarczył próbnik Huygens do Tytana?
- **explanation_correct — przed:** Misja Cassini-Huygens była wspólnym przedsięwzięciem NASA i ESA, zakończonym spektakularnym zanurkowaniem w atmosferę Saturna.
- **explanation_correct — po:** Cassini-Huygens była wspólną misją NASA, ESA i włoskiej agencji ASI. ESA dostarczyła próbnik Huygens, a orbiter Cassini zakończył misję wejściem w atmosferę Saturna.

### 57. Która planeta Układu Słonecznego ma najsilniejsze wiatry, dochodzące w jej atmosferze do prędkości 2100 km/h?
- **explanation_correct — przed:** Mimo że Neptun otrzymuje niewiele ciepła słonecznego, jego wewnętrzne źródło energii generuje najszybsze wiatry w Układzie Słonecznym.
- **explanation_correct — po:** Na Neptunie zmierzono bardzo szybkie wiatry mimo małego dopływu energii słonecznej. Wewnętrzne źródło ciepła może uczestniczyć w napędzaniu cyrkulacji, której szczegóły nadal się bada.

### 59. Jak nazywa się hipotetyczny, odległy obłok lodowych ciał otaczający Układ Słoneczny i stanowiący możliwe źródło komet długookresowych?
- **question — przed:** Jak nazywa się gigantyczny, sferyczny rezerwuar komet lodowych na samych krańcach Układu Słonecznego, wyznaczający granicę grawitacyjną Słońca?
- **question — po:** Jak nazywa się hipotetyczny, odległy obłok lodowych ciał otaczający Układ Słoneczny i stanowiący możliwe źródło komet długookresowych?

### 60. Która planeta ma najbardziej rozbudowany i widoczny system pierścieni, którego naturę wyjaśnił Christiaan Huygens?
- **question — przed:** Które z ciał Układu Słonecznego ma najbardziej wyrazisty i rozbudowany system pierścieni, odkryty przez Galileusza?
- **question — po:** Która planeta ma najbardziej rozbudowany i widoczny system pierścieni, którego naturę wyjaśnił Christiaan Huygens?
- **explanation_correct — przed:** Pierścienie Saturna składają się w 99% z lodu wodnego z domieszką pyłu krzemionkowego i rozciągają się na tysiące kilometrów przy grubości zaledwie ok. 10 metrów.
- **explanation_correct — po:** Galileusz dostrzegł osobliwy kształt Saturna, a Huygens rozpoznał go jako pierścień. Pierścienie składają się głównie z cząstek lodu z domieszkami pyłu i skał.

### 61. Który z księżyców Urana wykazuje najbardziej ekstremalne ukształtowanie powierzchni z kanionami o głębokości do 20 km, wyglądając jak posklejany z różnych części?
- **explanation_correct — przed:** Miranda posiada klify Verona Chasma – najwyższe znane uskoki pionowe w Układzie Słonecznym.
- **explanation_correct — po:** Powierzchnia Mirandy ma głębokie kaniony i urwiska, m.in. Verona Rupes, oraz obszary o bardzo różnym wyglądzie.

### 63. Jak nazywa się największa planeta karłowata w pasie planetoid między Marsem a Jowiszem, będąca pierwszym odkrytym takim obiektem w 1801 roku?
- **explanation_correct — przed:** Ceres skupia w sobie około 1/3 masy całego pasa planetoid i jako jedyna w tym pasie posiada kulisty kształt dzięki własnej grawitacji.
- **explanation_correct — po:** Ceres jest największym obiektem pasa głównego i jedyną w nim oficjalnie uznaną planetą karłowatą. Jej masa stanowi około jednej trzeciej masy pasa.

### 65. Jak nazywa się proces fuzji jądrowej, który jest głównym źródłem energii w gwiazdach o masie zbliżonej do Słońca?
- **explanation_correct — przed:** Cykl proton-proton (p-p) polega na bezpośrednim łączeniu jądra wodoru w jądro helu.
- **explanation_correct — po:** Łańcuch proton–proton obejmuje szereg reakcji, w których z jąder wodoru powstaje hel, a część masy jest uwalniana jako energia.
- **explanation_incorrect — przed:** Cykl CNO dominuje w gwiazdach masywniejszych, potrójny proces alfa spala hel w węgiel, a proces r odpowiada za powstawanie ciężkich pierwiastków w supernowych.
- **explanation_incorrect — po:** Cykl CNO dominuje w gorętszych jądrach masywniejszych gwiazd; proces potrójny alfa łączy hel w węgiel, a proces r polega na szybkim wychwycie neutronów.

### 67. Jak nazywa się jasny czerwony nadolbrzym w gwiazdozbiorze Oriona, który wykazuje nieregularne wahania jasności i zbliża się do końca swojego życia?
- **explanation_correct — przed:** Betelgeza eksploduje w przyszłości jako supernowa, co będzie widoczne na ziemskim niebie nawet w ciągu dnia.
- **explanation_correct — po:** Betelgeza jest masywnym czerwonym nadolbrzymem i oczekuje się, że zakończy życie jako supernowa, ale termin tego zdarzenia nie jest znany.

### 70. Jak oznacza się katalogowo gromadę otwartą Plejady, widoczną w gwiazdozbiorze Byka?
- **question — przed:** Jak nazywa się najbliższa Ziemi gromada otwarta gwiazd, położona w gwiazdozbiorze Byka, znana jako Plejady?
- **question — po:** Jak oznacza się katalogowo gromadę otwartą Plejady, widoczną w gwiazdozbiorze Byka?
- **explanation_correct — przed:** Plejady (M45) są widoczne gołym okiem jako mały wózek z 6-7 jasnych gwiazd, otoczonych błękitną mgławicą refleksyjną.
- **explanation_correct — po:** Plejady (M45) są widoczną gołym okiem gromadą otwartą. Nie są najbliższą Ziemi gromadą tego typu: bliżej leżą Hiady.

### 74. Który grecki astronom w II wieku p.n.e. skatalogował gwiazdy i odkrył precesję punktów równonocy?
- **question — przed:** Który grecki astronom w II wieku p.n.e. stworzył pierwszy katalog jasności gwiazd i odkrył zjawisko precesji osi Ziemi?
- **question — po:** Który grecki astronom w II wieku p.n.e. skatalogował gwiazdy i odkrył precesję punktów równonocy?
- **explanation_correct — przed:** Hiparch z Nikei wprowadził podział gwiazd na 6 wielkości gwiazdowych (magnitudo), stosowany do dzisiaj.
- **explanation_correct — po:** Hiparch z Nikei badał położenia i jasności gwiazd oraz odkrył precesję. Współczesna skala wielkości gwiazdowych rozwija historyczny podział jasności na klasy.

### 75. Który perski astronom w X wieku opublikował „Księgę gwiazd stałych” i opisał Andromedę jako „małą chmurkę”?
- **question — przed:** Który perski astronom w X wieku opublikował 'Księgę gwiazd stałych' i po raz pierwszy opisał Galaktykę Andromedy jako 'małą chmurkę'?
- **question — po:** Który perski astronom w X wieku opublikował „Księgę gwiazd stałych” i opisał Andromedę jako „małą chmurkę”?

### 78. Który francuski astronom opracował katalog obiektów mgławicowych, aby odróżniać je od komet, a jego późniejsza wersja obejmuje 110 pozycji?
- **question — przed:** Który francuski astronom opublikował w 1781 roku katalog 110 obiektów głębokiego nieba, aby nie mylić ich z kometami?
- **question — po:** Który francuski astronom opracował katalog obiektów mgławicowych, aby odróżniać je od komet, a jego późniejsza wersja obejmuje 110 pozycji?
- **explanation_correct — przed:** Katalog Messiera zawiera najsłynniejsze mgławice, gromady i galaktyki oznaczone literą M (np. M31, M42).
- **explanation_correct — po:** Charles Messier opracował katalog obiektów mgławicowych; wydanie z 1781 r. zawierało 103 pozycje, zaś do współczesnej listy dodano kolejne obiekty aż do M110.

### 85. Jak nazywa się zjawisko pozornego ruchu wstecznego planet na niebie, wywołane różnicą prędkości orbitalnych planet i Ziemi?
- **explanation_correct — przed:** Ruch retrogradacyjny powoduje, że planeta rysuje na niebie pętlę, co było trudne do wyjaśnienia w geocentryzmie.
- **explanation_correct — po:** Pozorny ruch wsteczny wynika z obserwowania planet z poruszającej się Ziemi. Historyczne modele geocentryczne odtwarzały takie pętle m.in. za pomocą epicykli.

### 86. Jak nazywa się zjawisko powolnego zataczania stożka przez oś obrotu Ziemi z okresem około 26 000 lat?
- **options — przed:** ["Precesja", "Nutacja", "Rotacja", "Precesja planetarna"]
- **options — po:** ["Precesja", "Nutacja", "Rotacja", "Libracja"]
- **explanation_incorrect — przed:** Nutacja to drobne wahania nakładające się na precesję, rotacja to obrót dobowy, a precesja planetarna to wpływ innych planet.
- **explanation_incorrect — po:** Nutacja to drobne wahania nakładające się na precesję, rotacja oznacza obrót, a libracja to pozorne kołysanie tarczy Księżyca.

### 93. Która planeta karłowata nazwana na cześć hawajskiej bogini płodności ma wydłużony kształt i obraca się bardzo szybko?
- **question — przed:** Jak nazywa się największy znany obiekt w pasie Kuipera po Plutonie, nazwany na cześć hawajskiej bogini płodności?
- **question — po:** Która planeta karłowata nazwana na cześć hawajskiej bogini płodności ma wydłużony kształt i obraca się bardzo szybko?
- **explanation_incorrect — przed:** Eris jest cięższa od Plutona, Makemake ma czerwonawą barwę, a Sedna porusza się po bardzo wydłużonej orbicie daleko poza pasem Kuipera.
- **explanation_incorrect — po:** Eris, Makemake i Sedna są innymi obiektami transneptunowymi. Eris ma większą masę niż Pluton, a Haumea wyróżnia się wydłużonym kształtem i szybkim obrotem.

### 94. Jak nazywa się klasa pulsujących gwiazd zmiennych, u których Henrietta Leavitt odkryła zależność okres–jasność wykorzystywaną do pomiarów odległości?
- **question — przed:** Jak nazywa się klasa gwiazd zmiennych pulsujących, których zależność między okresem pulsacji a jasnością absolutną pozwala mierzyć odległości we wszechświecie?
- **question — po:** Jak nazywa się klasa pulsujących gwiazd zmiennych, u których Henrietta Leavitt odkryła zależność okres–jasność wykorzystywaną do pomiarów odległości?
- **options — przed:** ["Cefeidy", "T Tauri", "Nowe powrotne", "Zmienne typu RR Lyrae"]
- **options — po:** ["Cefeidy", "T Tauri", "Nowe powrotne", "Białe karły"]
- **explanation_incorrect — przed:** T Tauri to młode gwiazdy przed ciągiem głównym, nowe powrotne wybuchają cyklicznie, a RR Lyrae to starsze gwiazdy o krótszych okresach.
- **explanation_incorrect — po:** T Tauri są młodymi gwiazdami, nowe powrotne to układy o powtarzających się rozbłyskach, a białe karły są zwartymi pozostałościami gwiazd. Gwiazdy RR Lyrae również są używane jako wskaźniki odległości.

### 96. Jak nazywa się aktywna galaktyka o wysokiej jasności jądra, której dżet relatywistyczny jest skierowany bezpośrednio w stronę Ziemi?
- **explanation_incorrect — przed:** Kwazar emituje energię we wszystkich kierunkach, radiogalaktyka ma dżety widoczne z boku, a galaktyka Seyferta to słabsze jądro aktywne.
- **explanation_incorrect — po:** Blazar i kwazar są odmianami aktywnych jąder galaktyk i kategorie mogą się nakładać. Radiogalaktyki często obserwuje się pod większym kątem do osi dżetu; galaktyki Seyferta także zawierają aktywne jądra.

### 97. Jak nazywa się przybliżona granica masy nierotującego białego karła, podtrzymywanego przez ciśnienie zdegenerowanych elektronów?
- **question — przed:** Jak nazywa się granica maksymalnej masy stabilnego białego karła, wynosząca około 1,44 masy Słońca, po przekroczeniu której zapada się on w gwiazdę neutronową?
- **question — po:** Jak nazywa się przybliżona granica masy nierotującego białego karła, podtrzymywanego przez ciśnienie zdegenerowanych elektronów?
- **explanation_correct — przed:** Granica Chandrasekhara wynika z ciśnienia zdegenerowanego gazu elektronowego, które nie jest w stanie zrównoważyć grawitacji powyżej 1,44 masy Słońca.
- **explanation_correct — po:** Granica Chandrasekhara wynosi około 1,4 masy Słońca dla typowego składu. Los obiektu po przekroczeniu granicy zależy od jego składu i scenariusza ewolucji; nie zawsze powstaje gwiazda neutronowa.
- **explanation_incorrect — przed:** Granica TOV dotyczy gwiazd neutronowych (ok. 2,17 mas Słońca), Roche'a to granica rozrywania pływowego, a horyzont to cecha czarnej dziury.
- **explanation_incorrect — po:** Granica TOV dotyczy nierotujących gwiazd neutronowych, granica Roche’a rozerwania pływowego, a horyzont zdarzeń czarnej dziury.

### 98. Jak nazywa się teoretyczna maksymalna masa stabilnej, nierotującej gwiazdy neutronowej?
- **question — przed:** Jak nazywa się granica maksymalnej masy gwiazdy neutronowej, powyżej której zapada się ona nieuchronnie w czarną dziurę?
- **question — po:** Jak nazywa się teoretyczna maksymalna masa stabilnej, nierotującej gwiazdy neutronowej?
- **explanation_correct — przed:** Granica TOV wynosi około 2,17 masy Słońca i określa kres ciśnienia zdegenerowanego gazu neutronowego.
- **explanation_correct — po:** Granica Tolmana–Oppenheimera–Volkoffa zależy od równania stanu bardzo gęstej materii, którego dokładnie nie znamy. Rotacja może zmienić maksymalną stabilną masę.
- **explanation_incorrect — przed:** Granica Chandrasekhara dotyczy białych karłów, Roche'a ciał rozrywanych pływowo, a promień Schwarzschilda określa rozmiar czarnej dziury.
- **explanation_incorrect — po:** Granica Chandrasekhara dotyczy białych karłów, Roche’a rozerwania pływowego, a promień Schwarzschilda nierotującego modelu czarnej dziury.

### 99. Jak nazywa się gwałtowna eksplozja termojądrowa na powierzchni białego karła w ciasnym układzie podwójnym, wywołana akrecją wodoru z sąsiedniej gwiazdy?
- **explanation_incorrect — przed:** Supernowa całkowicie niszczy gwiazdę lub jej jądro, rozbłysk gamma to najsilniejszy impuls energii we wszechświecie, a kilonowa powstaje ze zderzenia gwiazd neutronowych.
- **explanation_incorrect — po:** Supernowe obejmują różne eksplozje gwiazdowe, rozbłysk gamma jest krótkim silnym błyskiem wysokoenergetycznym, a kilonowa może towarzyszyć zderzeniu gwiazd neutronowych.

### 100. Jak nazywa się rozbłysk towarzyszący wyrzutowi neutronobogatej materii podczas połączenia dwóch gwiazd neutronowych?
- **question — przed:** Jak nazywa się kataklizmiczna eksplozja powstająca w wyniku zderzenia dwóch gwiazd neutronowych lub gwiazdy neutronowej i czarnej dziury?
- **question — po:** Jak nazywa się rozbłysk towarzyszący wyrzutowi neutronobogatej materii podczas połączenia dwóch gwiazd neutronowych?
- **explanation_correct — przed:** Podczas kilonowej zachodzi gwałtowna fuzja jądrowa (proces r), tworząca ogromne ilości najcięższych pierwiastków, jak złoto i platyna.
- **explanation_correct — po:** W materii wyrzuconej przy połączeniu gwiazd neutronowych może zachodzić szybki wychwyt neutronów, czyli proces r. Rozpad powstałych jąder zasila promieniowanie kilonowej.
- **explanation_incorrect — przed:** Nowa to zapłon wodoru na białym karle, supernowa Ia to eksplozja całego białego karła, a hipernowa to zapadnięcie masywnego nadolbrzyma.
- **explanation_incorrect — po:** Nowa to wybuch na powierzchni białego karła, supernowa Ia jest eksplozją termojądrową białego karła, a hipernową nazywa się wyjątkowo energetyczną supernową.

### 101. Jak nazywa się typ supernowej związany z termojądrową eksplozją białego karła w układzie podwójnym?
- **question — przed:** Jak nazywa się typ supernowej powstający w wyniku całkowitej eksplozji termojądrowej białego karła, który przekroczył granicę Chandrasekhara?
- **question — po:** Jak nazywa się typ supernowej związany z termojądrową eksplozją białego karła w układzie podwójnym?
- **explanation_correct — przed:** Supernowe typu Ia mają niemal identyczną jasność absolutną, przez co są używane jako świece standardowe do mierzenia tempa ekspansji wszechświata.
- **explanation_correct — po:** Supernowe Ia wykorzystuje się jako standaryzowane świece: jasność koryguje się m.in. na podstawie zmian blasku. Rozważane są różne scenariusze wybuchu białego karła, także związane z połączeniem dwóch karłów.
- **explanation_incorrect — przed:** Typ II i Ib powstają z zapadnięcia jąder masywnych pojedynczych gwiazd, a kilonowa ze zderzenia gwiazd neutronowych.
- **explanation_incorrect — po:** Typy II i Ib często wiążą się z zapadnięciem jądra masywnej gwiazdy; kilonowa może towarzyszyć połączeniu gwiazd neutronowych.

### 102. Jak nazywa się niewielka, gęsta i ciemna chmura gazu i pyłu międzygwiazdowego, w której mogą powstawać gwiazdy?
- **question — przed:** Jak nazywa się chmura gazu i pyłu międzygwiazdowego, z której na skutek zapadania grawitacyjnego formują się nowe gwiazdy?
- **question — po:** Jak nazywa się niewielka, gęsta i ciemna chmura gazu i pyłu międzygwiazdowego, w której mogą powstawać gwiazdy?
- **options — przed:** ["Mgławica ciemna", "Obszar H II", "Kokon gwiazdowy", "Globula Boka"]
- **options — po:** ["Mgławica planetarna", "Obszar H II", "Pozostałość po supernowej", "Globula Boka"]
- **explanation_correct — przed:** Globule Boka to małe, bardzo ciemne i gęste chmury pyłu, w których zachodzi wczesna faza protogwiazdowa.
- **explanation_correct — po:** Globula Boka to niewielka gęsta chmura międzygwiazdowego gazu i pyłu. Jest rodzajem ciemnej mgławicy, a niektóre globule zawierają formujące się gwiazdy.
- **explanation_incorrect — przed:** Mgławica ciemna to szersza klasa obiektów, obszar H II to zjonizowany wodór wokół młodych gwiazd, a kokon to otoczka pyłowa wokół pojedynczej gwiazdy.
- **explanation_incorrect — po:** Mgławica planetarna jest otoczką odrzuconą przez gwiazdę, obszar H II zawiera zjonizowany wodór, a pozostałość po supernowej jest materią po wybuchu gwiazdy.

### 104. Który astronom w 1933 roku badał prędkości galaktyk w Gromadzie Warkocza i postulował znaczne ilości niewidocznej materii?
- **question — przed:** Który szwajcarsko-amerykański astronom w 1933 roku po raz pierwszy postulował istnienie ciemnej materii w gromadach galaktyk, nazywając ją 'dunkle Materie'?
- **question — po:** Który astronom w 1933 roku badał prędkości galaktyk w Gromadzie Warkocza i postulował znaczne ilości niewidocznej materii?
- **explanation_correct — przed:** Zwicky analizował prędkości galaktyk w Gromadzie Warkocza Bereniki, wykazując anomalie masy.
- **explanation_correct — po:** Fritz Zwicky wykorzystał prędkości galaktyk w Gromadzie Warkocza do oszacowania jej masy i wskazał potrzebę istnienia dodatkowej niewidocznej materii. Wcześniejsze szacunki niewidocznej materii formułowali także inni astronomowie.

### 105. Który astronom w 1950 roku rozwinął model odległego obłoku kometarnego, nazwanego dziś obłokiem Oorta?
- **question — przed:** Który astronom sformułował hipotezę o istnieniu sferycznego obłoku kometarnego otaczającego Układ Słoneczny w 1950 roku?
- **question — po:** Który astronom w 1950 roku rozwinął model odległego obłoku kometarnego, nazwanego dziś obłokiem Oorta?

### 108. Który fizyk w 1950 roku podczas lunchu zadał słynne pytanie 'Gdzie oni są?', dając początek paradoksowi dotyczącemu braku kontaktu z obcymi?
- **explanation_correct — przed:** Paradoks Fermiego wskazuje na sprzeczność między wysokimi szacunkami prawdopodobieństwa istnienia cywilizacji a brakiem jakichkolwiek śladów ich obecności.
- **explanation_correct — po:** Paradoks Fermiego dotyczy napięcia między możliwością istnienia licznych cywilizacji a brakiem jednoznacznych dowodów ich obecności. Wnioski zależą od niepewnych założeń.
- **explanation_incorrect — przed:** Einstein nie zajmował się tym problemem, Feynman był fizykiem kwantowym, a Drake sformułował równanie szacunkowe.
- **explanation_incorrect — po:** Feynman znany jest m.in. z elektrodynamiki kwantowej, a Drake sformułował równanie porządkujące czynniki wpływające na liczbę cywilizacji.

### 110. Jak nazywał się pierwszy radziecki pies wysłany na orbitę okołoziemską na pokładzie Sputnika 2 w listopadzie 1957 roku?
- **explanation_correct — przed:** Łajka była pierwszym żywym stworzeniem na orbicie, jednak zginęła po kilku godzinach z powodu przegrzania kapsuły.
- **explanation_correct — po:** Łajka była pierwszym psem na orbicie okołoziemskiej. Zginęła podczas lotu Sputnika 2; pierwsze organizmy w kosmosie wysyłano wcześniej w lotach suborbitalnych.

### 112. Jak nazywa się pierwsza bezzałogowa misja programu NASA, która w listopadzie 2022 roku okrążyła Księżyc testując statek Orion?
- **explanation_correct — przed:** Artemis I wykorzystała najpotężniejszą rakietę SLS i utorowała drogę do załogowych lotów na Srebrny Glob.
- **explanation_correct — po:** Artemis I była bezzałogowym lotem testowym rakiety Space Launch System i statku Orion wokół Księżyca.
- **explanation_incorrect — przed:** Apollo 17 to ostatnie lądowanie na Księżycu w 1972 roku, Constellation to anulowany program, a SLS-1 to nazwa rakiety.
- **explanation_incorrect — po:** Apollo 17 było ostatnim załogowym lądowaniem księżycowym programu Apollo, Constellation anulowano, a SLS to rakieta użyta w Artemis I.

### 113. Która amerykańska sonda kosmiczna jako pierwsza weszła na orbitę wokół planety karłowatej Ceres w marcu 2015 roku?
- **explanation_correct — przed:** Sonda Dawn zbadała wcześniej asteroidę Westa, stając się pierwszą sondą krążącą wokół dwóch różnych ciał pozaziemskich.
- **explanation_correct — po:** Dawn wcześniej okrążała planetoidę Westa; następnie w 2015 r. weszła na orbitę Ceres. Była pierwszą sondą, która orbitowała dwa różne ciała poza układem Ziemia–Księżyc.

### 114. Jak nazywa się zjawisko ugięcia światła odległej galaktyki pod wpływem grawitacji bliższego obiektu, tworzące obrazy zwane 'pierścieniami Einsteina'?
- **options — przed:** ["Soczewkowanie grawitacyjne", "Przesunięcie ku czerwieni", "Aberracja grawitacyjna", "Mikrosoczewkowanie"]
- **options — po:** ["Soczewkowanie grawitacyjne", "Przesunięcie ku czerwieni", "Dyfrakcja", "Aberracja chromatyczna"]
- **explanation_incorrect — przed:** Przesunięcie ku czerwieni to efekt rozszerzania wszechświata, aberracja to błąd optyczny, a mikrosoczewkowanie to podtyp zjawiska wywołany przez gwiazdy.
- **explanation_incorrect — po:** Przesunięcie ku czerwieni dotyczy zmiany długości fali, dyfrakcja ugięcia fali na przeszkodzie lub szczelinie, a aberracja chromatyczna jest wadą układu optycznego. Mikrosoczewkowanie jest odmianą soczewkowania grawitacyjnego.

### 115. Jak nazywa się pozorne kołysanie tarczy Księżyca, które z czasem pozwala z Ziemi zobaczyć łącznie około 59% jego powierzchni?
- **question — przed:** Jak nazywa się efekt powolnego zbliżania się i oddalania tarczy Księżyca w trakcie jego orbity, pozwalający dostrzec 59% jego powierzchni z Ziemi?
- **question — po:** Jak nazywa się pozorne kołysanie tarczy Księżyca, które z czasem pozwala z Ziemi zobaczyć łącznie około 59% jego powierzchni?
- **explanation_correct — przed:** Libracja wynika z nachylenia orbity Księżyca i jego zmiennej prędkości orbitalnej przy stałej prędkości rotacji.
- **explanation_correct — po:** Libracja wynika m.in. ze zmiennej prędkości orbitalnej i nachylenia osi Księżyca; nie należy jej mylić ze zmianami odległości Księżyca od Ziemi.

### 117. Który z lodowych księżyców Urana wyróżnia się najjaśniejszą powierzchnią i gęstą siecią dolin tektonicznych na powierzchni?
- **explanation_correct — przed:** Ariel wykazuje oznaki dawnego kriowulkanizmu i ma najmłodszą geologicznie powierzchnię spośród księżyców Urana.
- **explanation_correct — po:** Ariel ma jasną powierzchnię z dolinami i stosunkowo niewielką liczbą kraterów, co wskazuje na dawną aktywność geologiczną. Porównania odnoszą się do księżyców zaobserwowanych dostatecznie dokładnie.

### 119. Która planeta karłowata została nazwana na cześć bóstwa stwórcy z Rapa Nui?
- **question — przed:** Która planeta karłowata w pasie Kuipera wyróżnia się niemal idealnie czerwonawym kolorem i została nazwana na cześć bóstwa stwórcy z Rapa Nui?
- **question — po:** Która planeta karłowata została nazwana na cześć bóstwa stwórcy z Rapa Nui?
- **explanation_correct — przed:** Makemake to trzecia co do wielkości planeta karłowata, pokryta zamarzniętym metanem i etanem.
- **explanation_correct — po:** Makemake jest obiektem transneptunowym o czerwonawej powierzchni zawierającej m.in. zamarznięty metan.
- **explanation_incorrect — przed:** Eris jest szara, Haumea wydłużona, a Sedna leży znacznie dalej.
- **explanation_incorrect — po:** Eris i Haumea otrzymały nazwy z innych tradycji mitologicznych; Sedna również jest odległym obiektem transneptunowym.

### 120. Który z tych obiektów transneptunowych ma bardzo wydłużoną orbitę i peryhelium około 76 jednostek astronomicznych od Słońca?
- **question — przed:** Jak nazywa się najbardziej oddalony obiekt transneptunowy o okresie orbitalnym trwającym około 11 400 lat, poruszający się po ekstremalnie wydłużonej orbicie?
- **question — po:** Który z tych obiektów transneptunowych ma bardzo wydłużoną orbitę i peryhelium około 76 jednostek astronomicznych od Słońca?
- **explanation_correct — przed:** Sedna zbliża się do Słońca na odległość 76 j.a., a jej aphelium leży w rekordowej odległości blisko 937 j.a.
- **explanation_correct — po:** Sedna porusza się po bardzo wydłużonej orbicie; odległość jej peryhelium wynosi około 76 jednostek astronomicznych. Nie jest jedynym znanym bardzo odległym obiektem transneptunowym.
- **explanation_incorrect — przed:** Eris krąży znacznie bliżej (ok. 97 j.a. w aphelium), Gonggong to mniejsza planeta karłowata, a Orcus to plutonek krążący w rezonansie z Neptunem.
- **explanation_incorrect — po:** Eris, Gonggong i Orcus są innymi obiektami transneptunowymi o odmiennych orbitach.

### 122. Jak nazywają się najpowszechniejsze gwiazdy we wszechświecie, charakteryzujące się małą masą, niską temperaturą i długością życia liczoną w bilionach lat?
- **explanation_correct — przed:** Czerwone karły stanowią około 75% wszystkich gwiazd w naszej Galaktyce, a ich fuzja zachodzi na tyle powoli, że nie opuściły jeszcze ciągu głównego.
- **explanation_correct — po:** Czerwone karły są bardzo liczne i spalają wodór powoli. Według modeli najlżejsze żyją znacznie dłużej niż obecny wiek wszechświata.

### 123. Jak nazywa się klasa bardzo starych gwiazd zmiennych o małej masie, należących do II populacji, używana do mierzenia odległości w gromadach kulistych?
- **explanation_incorrect — przed:** Cefeidy to młode, masywne gwiazdy, zmienne typu Mira to czerwone olbrzymy o długim okresie, a Delta Scuti pulsują nieregularnie.
- **explanation_incorrect — po:** Cefeidy również służą do pomiaru odległości i obejmują różne populacje gwiazd. Gwiazdy typu Mira są czerwonymi olbrzymami o długich okresach, a Delta Scuti są inną klasą zmiennych pulsujących.

### 124. Jak nazywa się jasny pomarańczowy olbrzym w gwiazdozbiorze Wolarza?
- **question — przed:** Jak nazywa się czerwony olbrzym w gwiazdozbiorze Wolarza, czwarta pod względem jasności gwiazda nocnego nieba?
- **question — po:** Jak nazywa się jasny pomarańczowy olbrzym w gwiazdozbiorze Wolarza?
- **explanation_correct — przed:** Arktur to najjaśniejsza gwiazda północnej półkuli niebieskiej, poruszająca się z dużą prędkością własną na tle innych gwiazd.
- **explanation_correct — po:** Arktur jest najjaśniejszą gwiazdą Wolarza i jedną z najjaśniejszych gwiazd nocnego nieba. Wykazuje duży ruch własny.

### 128. Jak nazywa się jasna gwiazda w konstelacji Orła, najniższy wierzchołek Trójkąta Letniego, znana z bardzo szybkiej rotacji spłaszczającej jej bieguny?
- **explanation_incorrect — przed:** Deneb i Wega rotują znacznie wolniej, a Fomalhaut leży w Rybie Południowej.
- **explanation_incorrect — po:** Deneb i Wega tworzą pozostałe wierzchołki Trójkąta Letniego, a Fomalhaut leży w Rybie Południowej. Wega również bardzo szybko rotuje.

### 129. Jak nazywa się fala gęstości w ośrodku międzygwiazdowym, wywołana przez wybuch supernowej, rozprzestrzeniająca się z prędkością naddźwiękową?
- **explanation_correct — przed:** Fala uderzeniowa kompresuje obłoki gazu, co często staje się bezpośrednim zapalnikiem dla grawitacyjnego zapadania i narodzin nowych gwiazd.
- **explanation_correct — po:** Fala uderzeniowa może sprężać gaz międzygwiazdowy i w odpowiednich warunkach przyczyniać się do powstawania gwiazd.
- **explanation_incorrect — przed:** Wiatr gwiazdowy to ciągły strumień cząstek, dżet to wąska struga materii z jądra aktywnego, a fala synchrotronowa to typ emisji elektromagnetycznej.
- **explanation_incorrect — po:** Wiatr gwiazdowy to strumień cząstek, dżet to wąska struga materii, a promieniowanie synchrotronowe jest emisją cząstek naładowanych w polu magnetycznym.

### 130. Jak nazywa się zjawisko załamania światła słonecznego w kryształkach lodu w chmurach pierzastych, tworzące barwny krąg wokół tarczy Słońca lub Księżyca?
- **explanation_incorrect — przed:** Tęcza powstaje w kroplach wody, irydyzacja to tęczowe barwy na chmurach średnich, a wieńce powstają przez dyfrakcję światła na kropelkach.
- **explanation_incorrect — po:** Tęcza powstaje w kroplach wody, iryzacja daje barwy chmur w wyniku dyfrakcji, a wieńce wiążą się z dyfrakcją światła na drobnych kroplach lub kryształkach.

## astronomy_solar_system_en

Liczba pytań: 131. Zmienione rekordy: 65. Zakres merytorycznego przeglądu niepotwierdzony.

### 1. As of August 2026, which planet has the most confirmed moons?
- **question — przed:** Which planet in the Solar System has the most confirmed moons, overtaking Jupiter?
- **question — po:** As of August 2026, which planet has the most confirmed moons?
- **explanation_correct — przed:** Saturn has over 140 confirmed moons, placing it first in the Solar System.
- **explanation_correct — po:** NASA listed 293 confirmed moons of Saturn as of August 2026; discoveries and confirmations can change the count.
- **explanation_incorrect — przed:** Jupiter has 95 moons, Uranus has 28, and Neptune has 16.
- **explanation_incorrect — po:** Jupiter, Uranus and Neptune have many moons, but fewer than Saturn as of August 2026.

### 6. Which planet takes about 243 Earth days to complete one rotation relative to the distant stars?
- **question — przed:** Which planet in the Solar System has the longest day, lasting about 243 Earth days?
- **question — po:** Which planet takes about 243 Earth days to complete one rotation relative to the distant stars?
- **explanation_correct — przed:** Venus's rotation on its axis takes longer than its orbit around the Sun (a Venusian year is 225 Earth days).
- **explanation_correct — po:** Venus takes about 243 Earth days for one sidereal rotation; its solar day is about 117 Earth days, and its year about 225 Earth days.
- **explanation_incorrect — przed:** Mercury rotates in 59 days, Mars has a day close to Earth's (24.6 h), and Jupiter rotates very quickly.
- **explanation_incorrect — po:** Mercury rotates in about 59 Earth days, Mars in about 24.6 hours, and Jupiter in under 10 hours.

### 8. Which icy moon of Jupiter is the target of Europa Clipper, a mission studying whether conditions could support life?
- **question — przed:** Which moon of Jupiter is a target for life-searching missions due to a liquid water ocean under its icy crust?
- **question — po:** Which icy moon of Jupiter is the target of Europa Clipper, a mission studying whether conditions could support life?
- **explanation_correct — przed:** Europa hides a liquid water ocean beneath its icy shell, containing more water than all of Earth's oceans combined.
- **explanation_correct — po:** Europa likely has a subsurface ocean. Europa Clipper is designed to assess habitability, not to detect life directly.
- **explanation_incorrect — przed:** Io is volcanic and dry, Ganymede has ice and rock, and Callisto is geologically inactive.
- **explanation_incorrect — po:** Io is volcanically active. Ganymede and Callisto also show evidence of subsurface oceans; Europa is a major target for studies of potential habitability.

### 10. What is the closest large spiral galaxy to the Milky Way?
- **question — przed:** What is the name of the closest large spiral galaxy to our Milky Way, with which we will collide in about 4.5 billion years?
- **question — po:** What is the closest large spiral galaxy to the Milky Way?
- **explanation_correct — przed:** The Andromeda Galaxy (M31) is about 2.5 million light-years from Earth and is approaching us at 110 km/s.
- **explanation_correct — po:** The Andromeda Galaxy (M31) is about 2.5 million light-years away. A future merger with the Milky Way is possible, but its timing and likelihood remain uncertain.

### 11. What compact object has an event horizon beyond which light cannot escape to distant observers?
- **question — przed:** What does a massive star become at the end of its life when it gravitationally collapses to a point of infinite density?
- **question — po:** What compact object has an event horizon beyond which light cannot escape to distant observers?
- **explanation_correct — przed:** A black hole has a gravitational field so strong that not even light can escape from beyond its event horizon.
- **explanation_correct — po:** A black hole is a region bounded by an event horizon; classical general relativity predicts singularities, but conditions at the center are not established by a complete quantum theory.
- **explanation_incorrect — przed:** A white dwarf is the remnant of low-mass stars, a neutron star forms from medium-mass stars, and a red giant is an late stage of stellar evolution.
- **explanation_incorrect — po:** White dwarfs and neutron stars are compact stellar remnants without black-hole event horizons. Red giants are stars in a late evolutionary stage.

### 12. What is the name of the dense remnant of a supernova built almost entirely of subatomic particles with no electrical charge?
- **options — przed:** ["Neutron star", "White dwarf", "Black hole", "Magnetar"]
- **options — po:** ["Neutron star", "White dwarf", "Black hole", "Red giant"]
- **explanation_correct — przed:** Neutron stars are only about 20 kilometers in diameter, but a teaspoon of their matter weighs billions of tons.
- **explanation_correct — po:** A neutron star is a compact remnant formed in some core-collapse supernovae. It is composed largely of neutrons but also contains other particles.
- **explanation_incorrect — przed:** White dwarfs consist of degenerate electron matter, black holes have no surface, and magnetars are neutron stars with extreme magnetic fields.
- **explanation_incorrect — po:** White dwarfs and black holes are different compact objects, while a red giant is an expanded star. A magnetar is a strongly magnetized neutron star.

### 13. Which star is the brightest in Earth's night sky, located in the constellation Canis Major?
- **explanation_incorrect — przed:** Canopus is the second brightest, Arcturus third, and Vega fifth.
- **explanation_incorrect — po:** Canopus is the second-brightest star system in the night sky, Alpha Centauri the third, Arcturus the fourth, and Vega the fifth.

### 15. Which German astronomer formulated three laws describing the motion of planets in elliptical orbits?
- **explanation_incorrect — przed:** Brahe could not fit a mathematical model, Galileo used the telescope to observe moons, and Herschel discovered Uranus.
- **explanation_incorrect — po:** Brahe proposed a geoheliocentric model and collected precise observations; Galileo observed Jupiter’s moons, and Herschel discovered Uranus.

### 16. Which astronomer used a telescope to study the Moon, Jupiter’s moons and the phases of Venus around 1609–1610?
- **question — przed:** Who first pointed a telescope at the sky in 1609, discovering craters on the Moon and phases of Venus?
- **question — po:** Which astronomer used a telescope to study the Moon, Jupiter’s moons and the phases of Venus around 1609–1610?
- **explanation_correct — przed:** Galileo Galilei also discovered the four largest moons of Jupiter, which helped disprove the geocentric theory.
- **explanation_correct — po:** Galileo Galilei published influential telescopic observations. His observations of Venus and Jupiter challenged simple geocentric models; other observers, including Thomas Harriot, also used telescopes on the sky in 1609.

### 17. Which English scientist built an early successful reflecting telescope in 1668?
- **question — przed:** Which English physicist and astronomer built the first working reflecting telescope in 1668?
- **question — po:** Which English scientist built an early successful reflecting telescope in 1668?
- **explanation_correct — przed:** Newton's telescope used a primary mirror instead of lenses, eliminating the chromatic aberration that plagued refractor designs.
- **explanation_correct — po:** Newton built a working reflecting telescope using a primary mirror, avoiding the chromatic aberration inherent to simple refractors. Earlier designs and prototypes also existed.

### 22. Which two space probes, launched in 1977, have left the heliosphere and are exploring interstellar space?
- **explanation_correct — przed:** The Voyager probes sent back the first close-up photos of the giant outer planets and carry a Golden Record for extraterrestrials.
- **explanation_correct — po:** Voyager 1 and 2 crossed the heliopause in 2012 and 2018 respectively. Their Golden Records carry sounds and images from Earth.
- **explanation_incorrect — przed:** Pioneer was launched earlier but travels slower, Mariner explored inner planets, and Viking landed on Mars.
- **explanation_incorrect — po:** Pioneer 10 and 11 preceded Voyager in flying past Jupiter and Saturn, but are no longer transmitting. Mariner explored inner planets and Viking studied Mars.

### 23. Which large infrared space telescope was launched in December 2021 as a scientific successor to Hubble?
- **question — przed:** What is the name of the large space telescope launched in December 2021 that observes in infrared and succeeded Hubble?
- **question — po:** Which large infrared space telescope was launched in December 2021 as a scientific successor to Hubble?
- **explanation_correct — przed:** JWST has a gold-coated primary mirror 6.5 meters wide and is positioned at the Lagrange point L2.
- **explanation_correct — po:** JWST has a 6.5-meter segmented, gold-coated primary mirror and operates in an orbit around the Sun–Earth L2 region.
- **explanation_incorrect — przed:** Kepler searched for exoplanets, Nancy Roman is under construction, and Spitzer is an older infrared telescope.
- **explanation_incorrect — po:** Kepler searched for exoplanets, Spitzer was an earlier infrared telescope, and the Nancy Grace Roman Space Telescope is a separate mission.

### 24. What is the term for the passage of a planet across the Sun's disk as seen from Earth?
- **explanation_incorrect — przed:** An eclipse involves bodies of similar angular size (like the Moon), occultation is when a planet hides a star, and conjunction is a close approach on the sky.
- **explanation_incorrect — po:** Eclipses and occultations are related phenomena whose terminology depends on geometry. Conjunction is an apparent alignment in the sky.

### 26. What boundary separates events inside a black hole from those that can send signals to distant observers?
- **question — przed:** What is the name of the boundary around a black hole beyond which the escape velocity exceeds the speed of light?
- **question — po:** What boundary separates events inside a black hole from those that can send signals to distant observers?
- **options — przed:** ["Event horizon", "Ergosphere", "Singularity", "Schwarzschild radius"]
- **options — po:** ["Event horizon", "Ergosphere", "Accretion disk", "Photon sphere"]
- **explanation_correct — przed:** Anything crossing the event horizon is inevitably pulled into the singularity at the center of the black hole.
- **explanation_correct — po:** The event horizon is the boundary beyond which signals cannot reach distant observers. For a nonrotating black hole its radius is the Schwarzschild radius.
- **explanation_incorrect — przed:** The ergosphere lies outside a rotating black hole, the singularity is the center point, and the Schwarzschild radius defines the horizon's size.
- **explanation_incorrect — po:** The ergosphere is outside a rotating black hole’s horizon, the accretion disk is orbiting material, and the photon sphere is a region of possible photon orbits.

### 27. Which terrestrial planet has a dense carbon-dioxide atmosphere and an extreme greenhouse effect?
- **question — przed:** Which planet in the Solar System has the densest atmosphere, composed mainly of carbon dioxide, causing an extreme greenhouse effect?
- **question — po:** Which terrestrial planet has a dense carbon-dioxide atmosphere and an extreme greenhouse effect?
- **explanation_incorrect — przed:** Mars has a very thin atmosphere, Mercury has almost none, and Jupiter is a gas giant with no solid surface.
- **explanation_incorrect — po:** Mars has a thin carbon-dioxide atmosphere, Mercury has a tenuous exosphere, and Jupiter is a gas giant without a solid surface.

### 31. What is the general term for a streak of light produced when a meteoroid enters Earth’s atmosphere?
- **question — przed:** What is the term for the streak of light that occurs in the atmosphere when a speck of space debris burns up at high speed?
- **question — po:** What is the general term for a streak of light produced when a meteoroid enters Earth’s atmosphere?
- **explanation_correct — przed:** A meteor is the light phenomenon associated with a meteoroid burning up in the mesosphere.
- **explanation_correct — po:** A meteor is the luminous phenomenon produced as a meteoroid enters the atmosphere; an unusually bright meteor is also called a fireball.
- **explanation_incorrect — przed:** A meteoroid is the object in space, a meteorite is the remnant that hits the ground, and a fireball is an exceptionally bright meteor.
- **explanation_incorrect — po:** A meteoroid is the object in space, and a meteorite is material that reaches the ground. A fireball is a particularly bright meteor.

### 35. What is the name of the huge rotating anticyclone observed on Jupiter since at least the 1800s?
- **question — przed:** What is the name of the huge, rotating anticyclone on Jupiter that has raged for at least 300 years?
- **question — po:** What is the name of the huge rotating anticyclone observed on Jupiter since at least the 1800s?

### 37. Which two small, irregular moons orbit Mars?
- **question — przed:** Which two small, irregular moons of Mars were likely captured from the asteroid belt?
- **question — po:** Which two small, irregular moons orbit Mars?
- **explanation_correct — przed:** Phobos (Fear) and Deimos (Panic) orbit very close to Mars and have compositions similar to C-type asteroids.
- **explanation_correct — po:** Phobos and Deimos orbit Mars. Their origin is uncertain: proposed scenarios include capture and formation from debris after an impact.

### 38. Which planet is closest to the Sun and has a very tenuous exosphere and extreme temperature swings?
- **question — przed:** Which planet is closest to the Sun, characterized by a lack of atmosphere and extreme temperature swings?
- **question — po:** Which planet is closest to the Sun and has a very tenuous exosphere and extreme temperature swings?
- **explanation_correct — przed:** On Mercury, temperatures rise to 430°C by day and fall to -180°C by night due to the lack of an atmosphere.
- **explanation_correct — po:** Mercury has a thin exosphere rather than a substantial atmosphere; its surface experiences extreme temperature swings between sunlight and darkness.

### 41. What remnant remains after a Sun-like star sheds its outer layers and its hot core is exposed?
- **question — przed:** What is the name of the stellar remnant stage of a Sun-like star after it ejects its outer layers, leaving a hot carbon core?
- **question — po:** What remnant remains after a Sun-like star sheds its outer layers and its hot core is exposed?
- **explanation_correct — przed:** A white dwarf glows only from stored heat and cools down slowly over trillions of years.
- **explanation_correct — po:** A white dwarf is the exposed, extremely dense core of a low- or intermediate-mass star. It gradually cools after its formation.

### 42. What is a substellar object too low in mass to sustain hydrogen fusion in its core commonly called?
- **question — przed:** What is the term for a substellar object with a mass too low to sustain hydrogen fusion, often called a 'failed star'?
- **question — po:** What is a substellar object too low in mass to sustain hydrogen fusion in its core commonly called?
- **explanation_correct — przed:** Brown dwarfs have masses between 13 and 80 Jupiter masses and can only fuse deuterium or lithium in their cores.
- **explanation_correct — po:** Brown dwarfs are substellar objects that cannot sustain hydrogen fusion; some are massive enough to fuse deuterium and, at higher masses, lithium.
- **explanation_incorrect — przed:** Red dwarfs fuse hydrogen, white dwarfs are dead stars, and Jovian planets have no nuclear fusion.
- **explanation_incorrect — po:** Red dwarfs sustain hydrogen fusion, white dwarfs are stellar remnants, and giant planets are generally less massive substellar objects.

### 43. Which Greco-Egyptian scholar described an influential geocentric model in the Almagest?
- **question — przed:** Which Greco-Egyptian scholar created the geocentry model described in the Almagest, dominant for 1400 years?
- **question — po:** Which Greco-Egyptian scholar described an influential geocentric model in the Almagest?
- **explanation_correct — przed:** Ptolemy introduced a system of epicycles and deferents to explain planetary motions on the celestial sphere.
- **explanation_correct — po:** Ptolemy’s Almagest developed a geocentric mathematical system using epicycles and deferents; those devices were used before his time.

### 44. Which American astronomer published a galaxy distance–velocity relation in 1929, providing evidence for cosmic expansion?
- **question — przed:** Which American astronomer discovered in 1929 that the universe is expanding by observing the redshift of galaxies?
- **question — po:** Which American astronomer published a galaxy distance–velocity relation in 1929, providing evidence for cosmic expansion?
- **explanation_correct — przed:** Hubble's discovery provided observational proof of the expanding universe, and the expansion rate was named after him.
- **explanation_correct — po:** Hubble’s 1929 distance–velocity relation helped establish evidence for cosmic expansion, building on earlier redshift measurements and work by Lemaître and others.
- **explanation_incorrect — przed:** Einstein created general relativity, Lemaître proposed the primeval atom concept, and Shapley measured the Milky Way.
- **explanation_incorrect — po:** Einstein developed general relativity; Lemaître derived an expansion relation in 1927; Shapley studied the scale of the Milky Way.

### 45. Which Belgian priest and cosmologist proposed the “primeval atom” hypothesis in 1931?
- **question — przed:** Which Belgian priest and cosmologist first proposed the Big Bang theory, calling it the 'hypothesis of the primeval atom'?
- **question — po:** Which Belgian priest and cosmologist proposed the “primeval atom” hypothesis in 1931?
- **explanation_correct — przed:** Lemaître published his calculations in 1927, independently deriving the expansion rate relation.
- **explanation_correct — po:** Georges Lemaître proposed the primeval atom in 1931; in 1927 he had published work on an expanding universe and a distance–velocity relation.
- **explanation_incorrect — przed:** Hubble provided observational proof, Hoyle coined the term 'Big Bang' mockingly, and Penzias discovered CMB.
- **explanation_incorrect — po:** Hubble studied galaxy distances, Hoyle later coined the term “Big Bang”, and Penzias co-discovered the cosmic microwave background.

### 46. Which two American physicists accidentally discovered the Cosmic Microwave Background radiation (CMB) in 1964?
- **explanation_incorrect — przed:** Alpher and Gamow predicted CMB in 1948, Hubble and Humason studied galaxies, and Dicke and Peebles designed search experiments.
- **explanation_incorrect — po:** Alpher and Robert Herman predicted background radiation, building on work with Gamow. Hubble and Humason studied galaxies; Dicke and Peebles were part of the Princeton effort to search for such radiation.

### 47. Which female astronomer first discovered pulsars in 1967, although the Nobel Prize went to her advisor?
- **explanation_incorrect — przed:** Vera Rubin proved dark matter's existence, Leavitt studied Cepheids, and Cannon classified stellar spectra.
- **explanation_incorrect — po:** Rubin’s galaxy-rotation studies provided strong evidence for dark matter; Leavitt studied Cepheids and Cannon classified stellar spectra.

### 48. Which astronomer, working with Kent Ford, provided influential evidence for dark matter through galaxy rotation curves?
- **question — przed:** Which American astronomer proved the existence of dark matter in the 1970s by studying the rotation curves of spiral galaxies?
- **question — po:** Which astronomer, working with Kent Ford, provided influential evidence for dark matter through galaxy rotation curves?
- **explanation_correct — przed:** Rubin showed that outer stars in galaxies move as fast as those near the center, requiring an unseen mass.
- **explanation_correct — po:** Vera Rubin and Kent Ford measured galaxy rotation curves that provided strong evidence for unseen mass; other observations also support dark matter.

### 52. What is the name of the American rover that landed in Jezero Crater on Mars in 2021 alongside the Ingenuity helicopter?
- **explanation_incorrect — przed:** Curiosity has studied Gale Crater since 2012, and Opportunity and Spirit were older rovers launched in 2004.
- **explanation_incorrect — po:** Curiosity landed in Gale Crater in 2012. Opportunity and Spirit launched in 2003 and landed in 2004.

### 56. Which eclipse occurs when the Earth passes directly between the Sun and the Moon, casting its shadow on the Moon?
- **explanation_correct — przed:** A lunar eclipse can only occur at full moon and is visible from the entire night side of the Earth.
- **explanation_correct — po:** A lunar eclipse occurs at full moon when the Moon passes through Earth’s shadow. It can be seen from locations where the Moon is above the horizon during the eclipse.

### 57. Which planet in the Solar System has the strongest winds, reaching speeds of up to 2,100 km/h?
- **explanation_correct — przed:** Despite receiving little solar heat, Neptune's internal heat source generates the fastest winds in the Solar System.
- **explanation_correct — po:** Neptune has the fastest measured planetary winds in the Solar System. Its internal heat may contribute to its atmospheric dynamics, though details remain under study.

### 59. What is the name of the hypothesized distant, roughly spherical reservoir of long-period comets surrounding the Solar System?
- **question — przed:** What is the name of the giant, spherical reservoir of icy comets on the very edge of the Solar System, marking the Sun's gravitational limit?
- **question — po:** What is the name of the hypothesized distant, roughly spherical reservoir of long-period comets surrounding the Solar System?
- **explanation_correct — przed:** The Oort Cloud is estimated to extend from 2,000 to 100,000 AU from the Sun and has not been directly observed yet.
- **explanation_correct — po:** The Oort Cloud is a proposed distant reservoir of icy bodies; it has not been directly observed and its precise extent is uncertain.

### 61. Which moon of Uranus has the most extreme surface topography with canyons up to 20 km deep, looking like a jigsaw puzzle?
- **explanation_correct — przed:** Miranda features Verona Chasma, the tallest known cliff in the Solar System.
- **explanation_correct — po:** Miranda features Verona Rupes, an enormous cliff; estimates of its height remain uncertain.

### 62. Which planet was observed in 1846 near a position predicted from irregularities in Uranus’s orbit?
- **question — przed:** Which blue planet was discovered in 1846 through mathematical predictions rather than direct observation?
- **question — po:** Which planet was observed in 1846 near a position predicted from irregularities in Uranus’s orbit?
- **explanation_correct — przed:** Neptune was discovered by Johann Galle after Urbain Le Verrier calculated its position based on Uranus's orbital perturbations.
- **explanation_correct — po:** Johann Galle observed Neptune near the position predicted by Urbain Le Verrier. John Couch Adams had also independently calculated a predicted position.

### 63. What is the largest dwarf planet in the asteroid belt, first discovered in 1801?
- **explanation_correct — przed:** Ceres holds about a third of the asteroid belt's total mass and is the only body there spherical due to its own gravity.
- **explanation_correct — po:** Ceres contains roughly a quarter to a third of the asteroid belt’s mass and is classified as a dwarf planet. Vesta also has a broadly rounded shape but is not classified as a dwarf planet.

### 65. What is the name of the nuclear fusion process that is the primary energy source in stars of solar mass?
- **explanation_correct — przed:** The proton-proton (p-p) chain fuses hydrogen nuclei directly into helium nuclei.
- **explanation_correct — po:** The proton–proton chain converts hydrogen nuclei into helium through several steps, releasing energy.

### 66. Which hydrogen-fusion cycle dominates in many main-sequence stars more massive than the Sun and uses carbon, nitrogen and oxygen as catalysts?
- **question — przed:** Which nuclear fusion cycle dominates in stars heavier than 1.3 solar masses, using carbon as a catalyst?
- **question — po:** Which hydrogen-fusion cycle dominates in many main-sequence stars more massive than the Sun and uses carbon, nitrogen and oxygen as catalysts?

### 67. Which bright red supergiant in Orion shows irregular brightness fluctuations and is nearing the end of its life?
- **explanation_correct — przed:** Betelgeuse will eventually explode as a supernova, making it bright enough to see during the day.
- **explanation_correct — po:** Betelgeuse is a variable red supergiant expected eventually to explode as a supernova. The exact timing and brightness of such an event are uncertain.

### 70. What is the Messier designation of the Pleiades open star cluster in Taurus?
- **question — przed:** What is the closest open cluster of stars to Earth, located in Taurus, known as the Pleiades?
- **question — po:** What is the Messier designation of the Pleiades open star cluster in Taurus?
- **explanation_correct — przed:** The Pleiades (M45) are visible to the naked eye as a small dipper of 6-7 bright stars, surrounded by a blue reflection nebula.
- **explanation_correct — po:** The Pleiades are M45, an open cluster visible to the naked eye. The Hyades, also in Taurus, are closer to Earth.

### 74. Which Greek astronomer of the 2nd century BCE compiled an influential star catalog and discovered axial precession?
- **question — przed:** Which Greek astronomer in the 2nd century BCE created the first catalog of stars and discovered axial precession?
- **question — po:** Which Greek astronomer of the 2nd century BCE compiled an influential star catalog and discovered axial precession?
- **explanation_correct — przed:** Hipparchus of Nicaea introduced the division of stars into 6 magnitudes, which is still used today.
- **explanation_correct — po:** Hipparchus compiled an important star catalog and identified precession. Earlier star catalogs existed.

### 75. Which Persian astronomer described Andromeda as a small cloud in the 10th-century Book of Fixed Stars?
- **question — przed:** Which Persian astronomer in the 10th century published the 'Book of Fixed Stars' and first described the Andromeda Galaxy?
- **question — po:** Which Persian astronomer described Andromeda as a small cloud in the 10th-century Book of Fixed Stars?
- **explanation_correct — przed:** Al-Sufi revised and expanded Ptolemy's catalog, providing the stars' traditional Arabic names.
- **explanation_correct — po:** Al-Sufi cataloged stars and described the Andromeda Galaxy as a small cloud; the surviving record does not establish who first saw it.

### 78. Which French astronomer compiled a catalog of deep-sky objects to help comet observers avoid confusion?
- **question — przed:** Which French astronomer published a catalog of 110 deep-sky objects in 1781 so observers wouldn't confuse them with comets?
- **question — po:** Which French astronomer compiled a catalog of deep-sky objects to help comet observers avoid confusion?
- **explanation_correct — przed:** Messier's catalog contains the most famous nebulae, clusters, and galaxies designated with 'M' (e.g. M31, M42).
- **explanation_correct — po:** Charles Messier published several versions of the catalog; later additions brought the commonly used catalog to 110 objects.

### 87. What is the term for the small, periodic wobbles in Earth's axis with an 18.6-year cycle, superimposed on precession?
- **explanation_incorrect — przed:** Precession has a 26,000-year period, apsidal motion is orbital plane rotation, and libration is a lunar phenomenon.
- **explanation_incorrect — po:** Precession is the slow axial change, apsidal motion is rotation of an orbit’s line of apsides, and libration is an apparent rocking of the Moon.

### 90. Which two-toned moon of Saturn has one hemisphere dark as coal and the other bright as snow?
- **explanation_incorrect — przed:** Hyperion is sponge-like and rotates chaotically, Phoebe is a captured asteroid, and Titan has an orange atmosphere.
- **explanation_incorrect — po:** Hyperion has irregular shape and chaotic rotation; Phoebe is thought to be a captured outer Solar System object, and Titan has an orange atmosphere.

### 92. What is the term for the range of orbits around a star where liquid water can exist on a planet's surface?
- **explanation_correct — przed:** The habitable zone (or Goldilocks zone) depends on the star's luminosity and the planet's atmospheric greenhouse properties.
- **explanation_correct — po:** The habitable zone is a range of orbital distances where liquid water could exist on a planet’s surface under suitable atmospheric conditions; it is not a guarantee of habitability.

### 93. Which rapidly rotating dwarf planet is named after a Hawaiian goddess of childbirth?
- **question — przed:** What is the largest known Kuiper Belt object after Pluto, named after the Hawaiian goddess of childbirth?
- **question — po:** Which rapidly rotating dwarf planet is named after a Hawaiian goddess of childbirth?
- **explanation_incorrect — przed:** Eris is heavier than Pluto, Makemake is reddish, and Sedna lies much further out.
- **explanation_incorrect — po:** Eris is named after a Greek goddess of strife, Makemake after a Rapa Nui creator deity, and Sedna after an Inuit sea deity.

### 94. Which class of variable stars includes the prototype Delta Cephei and has a period–luminosity relation useful for measuring distances?
- **question — przed:** What is the term for a class of pulsating variable stars whose period-luminosity relation allows them to be used as distance indicators?
- **question — po:** Which class of variable stars includes the prototype Delta Cephei and has a period–luminosity relation useful for measuring distances?
- **explanation_incorrect — przed:** T Tauri are young pre-main-sequence stars, recurrent novae erupt periodically, and RR Lyrae are older stars with shorter periods.
- **explanation_incorrect — po:** RR Lyrae stars are also pulsating distance indicators; T Tauri stars are young stars, and recurrent novae are eruptive systems.

### 95. What are active galaxies with strong radio emission from large jets and lobes often called?
- **question — przed:** What is the term for active galaxies emitting strong radio waves from symmetrical jets powered by central black holes?
- **question — po:** What are active galaxies with strong radio emission from large jets and lobes often called?
- **options — przed:** ["Radio galaxies", "Seyfert galaxies", "Blazars", "Starburst galaxies"]
- **options — po:** ["Radio galaxies", "Globular clusters", "Open star clusters", "Planetary nebulae"]
- **explanation_incorrect — przed:** Seyfert galaxies have very bright optical cores, blazars have jets pointed at Earth, and starburst galaxies have rapid star formation.
- **explanation_incorrect — po:** Globular and open clusters are groups of stars; planetary nebulae are shells of gas expelled by evolved stars.

### 96. What is the term for an active galaxy whose relativistic jet is pointed directly towards Earth?
- **options — przed:** ["Blazar", "Quasar", "Radio galaxy", "Seyfert galaxy"]
- **options — po:** ["Blazar", "Globular cluster", "White dwarf", "Planetary nebula"]
- **explanation_incorrect — przed:** Quasars emit energy in all directions, radio galaxies have jets seen from the side, and Seyfert galaxies have less luminous active cores.
- **explanation_incorrect — po:** A globular cluster is a group of stars, a white dwarf is a stellar remnant, and a planetary nebula is a shell of gas around an evolved star.

### 97. What is the maximum mass limit for a stable white dwarf, equal to about 1.44 solar masses?
- **explanation_incorrect — przed:** The TOV limit applies to neutron stars (about 2.17 solar masses), the Roche limit concerns tidal tearing, and the event horizon is a black hole boundary.
- **explanation_incorrect — po:** The TOV limit concerns nonrotating neutron stars and depends on the equation of state; the Roche limit concerns tides, and the event horizon bounds a black hole.

### 98. What is the theoretical maximum mass of a stable, nonrotating neutron star called?
- **question — przed:** What is the maximum mass limit for a stable neutron star, beyond which it collapses into a black hole?
- **question — po:** What is the theoretical maximum mass of a stable, nonrotating neutron star called?
- **explanation_correct — przed:** The TOV limit is about 2.17 solar masses, marking the limit of neutron degeneracy pressure.
- **explanation_correct — po:** The Tolman–Oppenheimer–Volkoff limit depends on the equation of state of dense matter and is not known as a single exact value.

### 99. What is the term for a runaway thermonuclear explosion on a white dwarf's surface in a close binary system?
- **explanation_incorrect — przed:** A supernova destroys the star, a gamma-ray burst is a beam of high energy, and a kilonova is a merger of neutron stars.
- **explanation_incorrect — po:** Some supernovae disrupt a white dwarf or follow stellar core collapse; gamma-ray bursts are flashes of high-energy radiation, and kilonovae can follow compact-object mergers.

### 100. What is the bright transient powered in part by radioactive heavy elements produced in a neutron-star merger called?
- **question — przed:** What is the term for the cataclysmic explosion resulting from the merger of two neutron stars?
- **question — po:** What is the bright transient powered in part by radioactive heavy elements produced in a neutron-star merger called?
- **explanation_correct — przed:** Kilonovae undergo rapid neutron capture (r-process), creating heavy elements like gold and platinum.
- **explanation_correct — po:** A kilonova can follow a neutron-star merger and is powered by the radioactive decay of heavy elements formed by rapid neutron capture.

### 101. Which type of supernova is a thermonuclear explosion of a white dwarf?
- **question — przed:** Which type of supernova results from the complete thermonuclear destruction of a white dwarf exceeding the Chandrasekhar limit?
- **question — po:** Which type of supernova is a thermonuclear explosion of a white dwarf?
- **explanation_correct — przed:** Type Ia supernovae have a uniform peak luminosity, allowing them to serve as standard candles to measure cosmic expansion.
- **explanation_correct — po:** Type Ia supernovae arise from thermonuclear explosions of white dwarfs. Their peak luminosities can be standardized for distance measurements, though they are not identical and need not all exceed the Chandrasekhar limit.
- **explanation_incorrect — przed:** Types II and Ib are core-collapse events of single massive stars, and a kilonova is a merger event.
- **explanation_incorrect — po:** Types II and Ib are generally associated with core collapse of massive stars, while a kilonova can follow a compact-object merger.

### 102. What is the name for a small, dense, dark cloud of gas and dust, often a site of star formation?
- **question — przed:** What is the term for a small, dark nebula of gas and dust from which star formation occurs?
- **question — po:** What is the name for a small, dense, dark cloud of gas and dust, often a site of star formation?
- **options — przed:** ["Bok globule", "H II region", "Stellar cocoon", "Dark nebula"]
- **options — po:** ["Bok globule", "H II region", "Open star cluster", "Supernova remnant"]
- **explanation_incorrect — przed:** H II regions are ionized hydrogen, a stellar cocoon surrounds a single star, and dark nebulae is a broader class.
- **explanation_incorrect — po:** An H II region contains ionized hydrogen; an open cluster is a group of stars, and a supernova remnant is expanding debris. A Bok globule is a type of dark nebula.

### 105. Which astronomer proposed the existence of a spherical cloud of comets surrounding the Solar System in 1950?
- **explanation_correct — przed:** Jan Oort proposed the cloud to explain why long-period comets continue to appear despite being destroyed on perihelion passages.
- **explanation_correct — po:** Jan Oort proposed a distant comet reservoir in 1950 to account for long-period comets; Ernst Öpik had suggested a distant comet cloud earlier.

### 106. Which American astronomer formulated the 'dirty snowball' model of comet nuclei in 1950?
- **explanation_correct — przed:** Whipple's model was confirmed by close-up photos of Halley's Comet taken by the Giotto probe in 1986.
- **explanation_correct — po:** Giotto’s 1986 flyby revealed a dark, active comet nucleus and helped test and refine Whipple’s icy-conglomerate model.

### 110. What was the name of the first Soviet space dog launched into orbit on Sputnik 2 in November 1957?
- **explanation_correct — przed:** Laika was the first living creature in orbit, but died after a few hours from capsule overheating.
- **explanation_correct — po:** Laika was the first animal to orbit Earth. She died on the flight, likely within hours; Sputnik 2 was not designed for her recovery.

### 111. Which Chinese space probe made the first soft landing on the far side of the Moon in January 2019?
- **explanation_incorrect — przed:** Chang'e 3 landed on the near side, Yutu 2 was its rover, and Tianwen 1 is a Mars mission.
- **explanation_incorrect — po:** Chang’e 3 landed on the near side with the Yutu rover; Yutu 2 was carried by Chang’e 4, and Tianwen 1 is a Mars mission.

### 114. What is the term for the bending of light from a distant galaxy by a closer massive object, creating 'Einstein rings'?
- **options — przed:** ["Gravitational lensing", "Redshift", "Gravitational aberration", "Microlensing"]
- **options — po:** ["Gravitational lensing", "Cosmological redshift", "Doppler shift", "Stellar parallax"]
- **explanation_incorrect — przed:** Redshift is the expansion effect, aberration is an optical error, and microlensing is stellar lensing.
- **explanation_incorrect — po:** Redshift and Doppler shift alter observed wavelengths, while stellar parallax is an apparent positional shift. Microlensing is a type of gravitational lensing.

### 119. Which dwarf planet in the Kuiper Belt has a reddish color and is named after the creator deity of Rapa Nui?
- **explanation_correct — przed:** Makemake is the third-largest dwarf planet, covered with frozen methane and ethane.
- **explanation_correct — po:** Makemake is a dwarf planet in the Kuiper Belt; methane and ethane ices have been detected on its surface.

### 120. Which distant trans-Neptunian object has an orbital period of about 11,400 years, moving in an extremely eccentric orbit?
- **explanation_correct — przed:** Sedna approaches the Sun to 76 AU, and its aphelion lies at a record distance of about 937 AU.
- **explanation_correct — po:** Sedna follows a highly eccentric orbit, coming to roughly 76 AU from the Sun and traveling hundreds of AU away. Its orbital estimates and distance ranking can change as observations improve.

### 123. What is the name of a class of old, low-mass pulsating variable stars of Population II, used to measure distances to globular clusters?
- **explanation_incorrect — przed:** Cepheids are young massive stars, Mira variables are long-period red giants, and Delta Scuti pulse irregularly.
- **explanation_incorrect — po:** Classical Cepheids are generally younger and more massive, but Type II Cepheids are older stars. Mira variables are long-period red giants, and Delta Scuti stars are pulsating variables.

### 128. Which bright star in Aquila, the lowest vertex of the Summer Triangle, is known for its rapid rotation flattening its poles?
- **explanation_incorrect — przed:** Deneb and Vega rotate much slower, and Fomalhaut is in Piscis Austrinus.
- **explanation_incorrect — po:** Vega is also a rapid rotator; Deneb is in Cygnus and Fomalhaut in Piscis Austrinus. Altair is the bright Aquila vertex of the Summer Triangle.

### 129. What is the term for a supersonic density wave in the interstellar medium caused by a supernova explosion?
- **explanation_correct — przed:** The shock wave compresses gas clouds, which often triggers gravitational collapse and the birth of new stars.
- **explanation_correct — po:** A supernova shock wave compresses and heats surrounding gas. In some circumstances such shocks can trigger star formation; they can also disrupt clouds.

### 131. What atmospheric optical phenomenon produces bright mock suns on either side of the Sun?
- **question — przed:** What is the rare atmospheric optical phenomenon of mock suns appearing on either side of the Sun?
- **question — po:** What atmospheric optical phenomenon produces bright mock suns on either side of the Sun?


/**
 * @file config.js
 * Contains static game configuration and UI translations.
 */

// --- GAME CONFIGURATION ---
export const CONFIG = {
  // Colors for player tokens and UI elements
  PLAYER_COLORS: [
    '#ef4444',
    '#3b82f6',
    '#22c55e',
    '#f97316',
    '#a855f7',
    '#ec4899',
    '#84cc16',
    '#eab308',
    '#06b6d4',
    '#6366f1',
  ],
  // Colors for the six game categories
  CATEGORY_COLORS: ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#facc15'],
  // Defines the different types of squares on the board
  SQUARE_TYPES: {
    HQ: 'HEADQUARTERS',
    SPOKE: 'SPOKE',
    RING: 'RING',
    HUB: 'HUB',
    ROLL_AGAIN: 'ROLL_AGAIN',
  },
  // Delay in milliseconds for pawn movement animation
  ANIMATION_DELAY_MS: 50,
  // The maximum number of subcategory topics to remember per category to avoid repetition
  MAX_SUBCATEGORY_HISTORY_ITEMS: 15,
  // The maximum number of 'history items' to remember per category to avoid repetition
  MAX_ENTITY_HISTORY_ITEMS: 25,
  // A list of emojis available for player tokens
  EMOJI_OPTIONS: [
    '🚀',
    '🦄',
    '🤖',
    '🦊',
    '🧙',
    '👽',
    '👾',
    '👻',
    '👑',
    '💎',
    '🍕',
    '🍔',
    '⚽️',
    '🏀',
    '🎸',
    '🎨',
    '🎭',
    '🎬',
    '🎤',
    '🎮',
    '💻',
    '💡',
    '🧪',
    '🌍',
    '🏛️',
    '🏰',
    '🗿',
    '🛸',
    '🌲',
    '⛵️',
    '🐈',
    '🐕',
    '🦈',
  ],
};

// --- CATEGORY PRESETS ---
export const CATEGORY_PRESETS = [
  {
    name: { pl: 'Wiedza Ogólna – Klasyk', en: 'General Knowledge – Classic' },
    categories: [
      { pl: 'Historia', en: 'History' },
      { pl: 'Geografia', en: 'Geography' },
      { pl: 'Nauka', en: 'Science' },
      { pl: 'Kultura i sztuka', en: 'Culture & Art' },
      { pl: 'Sport', en: 'Sports' },
      { pl: 'Media i rozrywka', en: 'Media & Entertainment' },
    ],
  },
  {
    name: { pl: 'Wiedza Ogólna – Współczesność', en: 'General Knowledge – Modern Times' },
    categories: [
      { pl: 'Wydarzenia bieżące', en: 'Current Events' },
      { pl: 'Technologia', en: 'Technology' },
      { pl: 'Popkultura', en: 'Pop Culture' },
      { pl: 'Odkrycia naukowe', en: 'Scientific Discoveries' },
      { pl: 'Polityka', en: 'Politics' },
      { pl: 'Internet i media społecznościowe', en: 'Internet & Social Media' },
    ],
  },

  {
    name: { pl: 'Polska – Wiedza Ogólna', en: 'Poland – General Knowledge' },
    categories: [
      { pl: 'Historia', en: 'History' },
      { pl: 'Geografia', en: 'Geography' },
      { pl: 'Kultura i sztuka', en: 'Culture & Art' },
      { pl: 'Znani Polacy', en: 'Famous Poles' },
      { pl: 'Sport', en: 'Sports' },
      { pl: 'Społeczeństwo', en: 'Society' },
    ],
  },
  {
    name: { pl: 'Polska – Lata 90.', en: 'Poland – The 90s' },
    categories: [
      { pl: 'Historia', en: 'History' },
      { pl: 'Muzyka', en: 'Music' },
      { pl: 'Film i seriale', en: 'Movies & TV' },
      { pl: 'Życie codzienne', en: 'Everyday Life' },
      { pl: 'Sport', en: 'Sports' },
      { pl: 'Technologia', en: 'Technology' },
    ],
  },
  {
    name: { pl: 'Polska – Lata 80.', en: 'Poland – The 80s' },
    categories: [
      { pl: 'Historia', en: 'History' },
      { pl: 'Polityka', en: 'Politics' },
      { pl: 'Muzyka', en: 'Music' },
      { pl: 'Kultura i obyczaje', en: 'Culture & Customs' },
      { pl: 'Życie codzienne', en: 'Everyday Life' },
      { pl: 'Technologia', en: 'Technology' },
    ],
  },

  {
    name: { pl: 'Świat – Lata 2000.', en: 'World – The 2000s' },
    categories: [
      { pl: 'Historia', en: 'History' },
      { pl: 'Muzyka', en: 'Music' },
      { pl: 'Kino i TV', en: 'Cinema & TV' },
      { pl: 'Technologia', en: 'Technology' },
      { pl: 'Gadżety', en: 'Gadgets' },
      { pl: 'Moda i trendy', en: 'Fashion & Trends' },
    ],
  },
  {
    name: { pl: 'Świat – Zimna Wojna', en: 'World – The Cold War' },
    categories: [
      { pl: 'Konflikty', en: 'Conflicts' },
      { pl: 'Wyścig zbrojeń i kosmos', en: 'Arms & Space Race' },
      { pl: 'Propaganda i szpiegostwo', en: 'Propaganda & Espionage' },
      { pl: 'Kultura', en: 'Culture' },
      { pl: 'Przywódcy', en: 'Leaders' },
      { pl: 'Upadek systemu', en: 'Collapse of the Bloc' },
    ],
  },
  {
    name: { pl: 'Świat – Starożytność', en: 'World – Antiquity' },
    categories: [
      { pl: 'Historia', en: 'History' },
      { pl: 'Mitologia', en: 'Mythology' },
      { pl: 'Kultura i sztuka', en: 'Culture & Art' },
      { pl: 'Filozofia', en: 'Philosophy' },
      { pl: 'Nauka i wynalazki', en: 'Science & Inventions' },
      { pl: 'Wojny i konflikty', en: 'Wars & Conflicts' },
    ],
  },
  {
    name: { pl: 'Świat – Średniowiecze', en: 'World – Middle Ages' },
    categories: [
      { pl: 'Historia', en: 'History' },
      { pl: 'Religia', en: 'Religion' },
      { pl: 'Kultura i sztuka', en: 'Culture & Art' },
      { pl: 'Nauka i odkrycia', en: 'Science & Discoveries' },
      { pl: 'Polityka', en: 'Politics' },
      { pl: 'Wyprawy i podboje', en: 'Expeditions & Conquests' },
    ],
  },
  {
    name: { pl: 'Świat – Lata 60.', en: 'World – The 60s' },
    categories: [
      { pl: 'Historia', en: 'History' },
      { pl: 'Muzyka', en: 'Music' },
      { pl: 'Film i TV', en: 'Movies & TV' },
      { pl: 'Społeczeństwo', en: 'Society' },
      { pl: 'Moda i styl', en: 'Fashion & Style' },
      { pl: 'Polityka', en: 'Politics' },
    ],
  },

  {
    name: { pl: 'Nauka – Podstawy', en: 'Science – The Basics' },
    categories: [
      { pl: 'Fizyka', en: 'Physics' },
      { pl: 'Chemia', en: 'Chemistry' },
      { pl: 'Biologia', en: 'Biology' },
      { pl: 'Astronomia', en: 'Astronomy' },
      { pl: 'Matematyka', en: 'Mathematics' },
      { pl: 'Wielcy odkrywcy', en: 'Great Discoverers' },
    ],
  },
  {
    name: { pl: 'Technologia – Historia', en: 'Technology – History' },
    categories: [
      { pl: 'Komputery', en: 'Computers' },
      { pl: 'Internet', en: 'Internet' },
      { pl: 'Telekomunikacja', en: 'Telecommunication' },
      { pl: 'Transport', en: 'Transport' },
      { pl: 'Energetyka', en: 'Energy' },
      { pl: 'Wielkie wynalazki', en: 'Major Inventions' },
    ],
  },
  {
    name: { pl: 'Technologia – Współczesność', en: 'Technology – Modern Era' },
    categories: [
      { pl: 'Sztuczna inteligencja', en: 'Artificial Intelligence' },
      { pl: 'Smartfony i aplikacje', en: 'Smartphones & Apps' },
      { pl: 'Media społecznościowe', en: 'Social Media' },
      { pl: 'Start-upy', en: 'Startups' },
      { pl: 'Badania kosmiczne', en: 'Space Exploration' },
      { pl: 'Cyberbezpieczeństwo', en: 'Cybersecurity' },
    ],
  },
  {
    name: { pl: 'Technika – Inżynieria', en: 'Engineering & Technology' },
    categories: [
      { pl: 'Budowle i mosty', en: 'Buildings & Bridges' },
      { pl: 'Robotyka', en: 'Robotics' },
      { pl: 'Transport', en: 'Transport' },
      { pl: 'Energia i środowisko', en: 'Energy & Environment' },
      { pl: 'Nanonauka', en: 'Nanoscience' },
      { pl: 'Biotechnologia', en: 'Biotechnology' },
    ],
  },

  {
    name: { pl: 'Gry wideo', en: 'Video Games' },
    categories: [
      { pl: 'Historia gier', en: 'History of Games' },
      { pl: 'Serie i postacie', en: 'Series & Characters' },
      { pl: 'Konsole', en: 'Consoles' },
      { pl: 'Gatunki', en: 'Genres' },
      { pl: 'Kultura graczy', en: 'Gaming Culture' },
      { pl: 'E-sport', en: 'E-sports' },
    ],
  },
  {
    name: { pl: 'Gry wideo – Retro', en: 'Video Games – Retro' },
    categories: [
      { pl: 'Konsole klasyczne', en: 'Classic Consoles' },
      { pl: 'Gry arcade', en: 'Arcade Games' },
      { pl: 'Platformówki', en: 'Platformers' },
      { pl: 'RPG i przygodowe', en: 'RPG & Adventures' },
      { pl: 'Kultowe serie', en: 'Iconic Series' },
      { pl: 'Twórcy i studia', en: 'Developers & Studios' },
    ],
  },

  {
    name: { pl: 'Gry wideo – 2010+', en: 'Video Games – 2010+' },
    categories: [
      { pl: 'Nowe gatunki', en: 'New Genres' },
      { pl: 'Multiplayer i e-sport', en: 'Multiplayer & E-sports' },
      { pl: 'Indie games', en: 'Indie Games' },
      { pl: 'Gry AAA', en: 'AAA Titles' },
      { pl: 'Postacie i światy', en: 'Characters & Worlds' },
      { pl: 'Gaming online', en: 'Online Gaming' },
    ],
  },
  {
    name: { pl: 'Rozrywka – Kino', en: 'Entertainment – Cinema' },
    categories: [
      { pl: 'Historia kina', en: 'History of Cinema' },
      { pl: 'Gatunki filmowe', en: 'Film Genres' },
      { pl: 'Reżyserzy', en: 'Directors' },
      { pl: 'Aktorzy', en: 'Actors' },
      { pl: 'Nagrody filmowe', en: 'Film Awards' },
      { pl: 'Kultowe filmy', en: 'Cult Movies' },
    ],
  },
  {
    name: { pl: 'Rozrywka – Muzyka', en: 'Entertainment – Music' },
    categories: [
      { pl: 'Gatunki muzyczne', en: 'Music Genres' },
      { pl: 'Artyści i zespoły', en: 'Artists & Bands' },
      { pl: 'Albumy i single', en: 'Albums & Singles' },
      { pl: 'Koncerty i festiwale', en: 'Concerts & Festivals' },
      { pl: 'Nagrody muzyczne', en: 'Music Awards' },
      { pl: 'Kultura muzyczna', en: 'Music Culture' },
    ],
  },

  {
    name: { pl: 'Podróże – Świat', en: 'Travel – World' },
    categories: [
      { pl: 'Kontynenty', en: 'Continents' },
      { pl: 'Kraje', en: 'Countries' },
      { pl: 'Miasta', en: 'Cities' },
      { pl: 'Zabytki', en: 'Landmarks' },
      { pl: 'Cuda natury', en: 'Natural Wonders' },
      { pl: 'Kultury i tradycje', en: 'Cultures & Traditions' },
    ],
  },
  {
    name: { pl: 'Podróże – Europa', en: 'Travel – Europe' },
    categories: [
      { pl: 'Geografia', en: 'Geography' },
      { pl: 'Miasta', en: 'Cities' },
      { pl: 'Zabytki', en: 'Landmarks' },
      { pl: 'Kultury i tradycje', en: 'Cultures & Traditions' },
      { pl: 'Historia', en: 'History' },
      { pl: 'Kuchnia regionalna', en: 'Regional Cuisine' },
    ],
  },

  {
    name: { pl: 'Podróże – Polska', en: 'Travel – Poland' },
    categories: [
      { pl: 'Regiony i miasta', en: 'Regions & Cities' },
      { pl: 'Zamki i pałace', en: 'Castles & Palaces' },
      { pl: 'Parki narodowe', en: 'National Parks' },
      { pl: 'Kultura i tradycje', en: 'Culture & Traditions' },
      { pl: 'Historia', en: 'History' },
      { pl: 'Turystyka współczesna', en: 'Modern Tourism' },
    ],
  },
  {
    name: { pl: 'Kuchnia Polska', en: 'Polish Cuisine' },
    categories: [
      { pl: 'Dania główne', en: 'Main Courses' },
      { pl: 'Zupy', en: 'Soups' },
      { pl: 'Przystawki', en: 'Appetizers' },
      { pl: 'Desery', en: 'Desserts' },
      { pl: 'Święta i tradycje kulinarne', en: 'Holiday & Traditional Foods' },
      { pl: 'Znane potrawy regionalne', en: 'Famous Regional Dishes' },
    ],
  },
  {
    name: { pl: 'Kuchnie świata', en: 'World Cuisines' },
    categories: [
      { pl: 'Europa', en: 'Europe' },
      { pl: 'Azja', en: 'Asia' },
      { pl: 'Afryka', en: 'Africa' },
      { pl: 'Ameryka Północna', en: 'North America' },
      { pl: 'Ameryka Południowa', en: 'South America' },
      { pl: 'Bliski Wschód', en: 'Middle East' },
    ],
  },
  {
    name: { pl: 'Napoje', en: 'Beverages' },
    categories: [
      { pl: 'Napoje bezalkoholowe', en: 'Non-Alcoholic Drinks' },
      { pl: 'Herbata i kawa', en: 'Tea & Coffee' },
      { pl: 'Soki i napoje owocowe', en: 'Juices & Fruit Drinks' },
      { pl: 'Piwo i cydr', en: 'Beer & Cider' },
      { pl: 'Wino', en: 'Wine' },
      { pl: 'Trunki wysokoprocentowe', en: 'Spirits & Liquor' },
    ],
  },

  {
    name: { pl: 'Hobby i pasje', en: 'Hobbies & Passions' },
    categories: [
      { pl: 'Sport i rekreacja', en: 'Sports & Recreation' },
      { pl: 'Sztuka i twórczość', en: 'Art & Creativity' },
      { pl: 'Kolekcjonerstwo', en: 'Collecting' },
      { pl: 'Podróże i turystyka', en: 'Travel & Tourism' },
      { pl: 'Gry i zabawa', en: 'Games & Fun' },
      { pl: 'Kulinaria', en: 'Culinary Arts' },
    ],
  },
  {
    name: { pl: 'Życie codzienne', en: 'Everyday Life' },
    categories: [
      { pl: 'Moda i trendy', en: 'Fashion & Trends' },
      { pl: 'Jedzenie i gotowanie', en: 'Food & Cooking' },
      { pl: 'Dom i rodzina', en: 'Home & Family' },
      { pl: 'Praca i szkoła', en: 'Work & School' },
      { pl: 'Media i internet', en: 'Media & Internet' },
      { pl: 'Społeczne obyczaje', en: 'Social Customs' },
    ],
  },

  {
    name: { pl: 'Sport – Ogólne', en: 'Sport – General' },
    categories: [
      { pl: 'Igrzyska olimpijskie', en: 'Olympic Games' },
      { pl: 'Piłka nożna', en: 'Football (Soccer)' },
      { pl: 'Koszykówka', en: 'Basketball' },
      { pl: 'Lekkoatletyka', en: 'Athletics' },
      { pl: 'Sporty zimowe', en: 'Winter Sports' },
      { pl: 'Znani sportowcy', en: 'Famous Athletes' },
    ],
  },
];

// --- TRANSLATIONS ---
export const translations = {
  setup_title: { pl: 'Ustawienia', en: 'Settings' },
  api_error: { pl: 'Błąd API', en: 'API Error' },
  setup_error_title: { pl: 'Błąd konfiguracji', en: 'Setup Error' },
  input_error_title: { pl: 'Błąd danych', en: 'Input Error' },
  input_required_title: { pl: 'Wymagane dane', en: 'Input Required' },
  success_title: { pl: 'Sukces', en: 'Success' },
  error_title: { pl: 'Błąd', en: 'Error' },
  configuration_error_body: { pl: 'Błąd konfiguracji.', en: 'Configuration error.' },
  invalid_save_format: { pl: 'Nieprawidłowy format zapisu gry.', en: 'Invalid game state format.' },
  mutation_failed: { pl: 'Nie udało się zmutować kategorii.', en: 'Failed to mutate category.' },
  roll_error_message: { pl: 'Błąd, rzuć ponownie.', en: 'Error, roll again.' },
  network_error_title: { pl: 'Błąd sieci', en: 'Network Error' },
  network_error_body: {
    pl: 'Sprawdź połączenie z internetem i spróbuj ponownie.',
    en: 'Please check your internet connection and try again.',
  },
  model_label: { pl: 'Model Językowy:', en: 'Language Model:' },
  model_provider_label: { pl: 'Dostawca AI:', en: 'AI Provider:' },
  model_select_label: { pl: 'Model:', en: 'Model:' },
  game_mode_label: { pl: 'Tryb Gry:', en: 'Game Mode:' },
  game_mode_mcq: { pl: 'Pytania zamknięte', en: 'Single Choice' },
  game_mode_short: { pl: 'Pytania otwarte (krótkie)', en: 'Open-ended (short)' },
  game_mode_desc_mcq: {
    pl: 'Klasyczne pytania z jedną poprawną odpowiedzią.',
    en: 'Classic questions with a single correct answer.',
  },
  game_mode_desc_short_answer: {
    pl: 'Odpowiedzi składające się z 1-3 słów.',
    en: 'Answers consisting of 1-3 words.',
  },
  knowledge_level_label: { pl: 'Poziom Wiedzy:', en: 'Knowledge Level:' },
  knowledge_level_basic: { pl: 'Podstawowy', en: 'Basic' },
  knowledge_level_intermediate: { pl: 'Średniozaawansowany', en: 'Intermediate' },
  knowledge_level_expert: { pl: 'Ekspercki', en: 'Expert' },
  knowledge_desc_basic: { pl: 'Pytania z wiedzy ogólnej.', en: 'General knowledge questions.' },
  knowledge_desc_intermediate: {
    pl: 'Pytania dla znających temat.',
    en: 'Questions for those familiar with the topic.',
  },
  knowledge_desc_expert: {
    pl: 'Pytania dla prawdziwych ekspertów.',
    en: 'Questions for true experts.',
  },
  category_generator_btn: { pl: 'Generuj', en: 'Generate' },
  categories_label: { pl: 'Kategorie', en: 'Categories' },
  default_categories: {
    pl: 'Historia, Geografia, Nauka, Sztuka, Sport, Rozrywka',
    en: 'History, Geography, Science, Art, Sports, Entertainment',
  },
  players_label: { pl: 'Gracze', en: 'Players' },
  player_count_label: { pl: 'Liczba:', en: 'Count:' },
  player_name_placeholder: { pl: 'Imię Gracza {i}', en: "Player {i}'s Name" },
  start_game_btn: { pl: 'Rozpocznij grę', en: 'Start game' },
  load_game_btn: { pl: 'Wczytaj ostatnią grę', en: 'Load last game' },
  min_categories_alert: {
    pl: 'Wszystkie 6 pól kategorii musi być wypełnione.',
    en: 'All 6 category fields must be filled.',
  },
  player_turn: { pl: 'Tura Gracza', en: "Player's Turn" },
  roll_to_start: { pl: 'Rzuć kostką, aby rozpocząć!', en: 'Roll the dice to start!' },
  roll_dice_btn: { pl: 'Rzuć Kostką', en: 'Roll Dice' },
  choose_move: {
    pl: 'Wybierz pole, na które chcesz się przesunąć.',
    en: 'Choose a square to move to.',
  },
  dice_roll_result: { pl: 'Wyrzucono: {roll}', en: 'You rolled: {roll}' },
  category_title: { pl: 'Kategoria: {category}', en: 'Category: {category}' },
  category_preset_label: { pl: 'Wybierz zestaw kategorii:', en: 'Choose a category set:' },
  category_preset_placeholder: { pl: 'Wybierz gotowy zestaw...', en: 'Select a preset...' },
  regenerate_question_btn: { pl: 'Nowe pytanie', en: 'New Question' },
  choose_category_title: { pl: 'Wybierz kategorię', en: 'Choose a Category' },
  choose_mutation_title: {
    pl: 'Kategoria mutuje! Wybierz nową:',
    en: 'Category is mutating! Choose a new one:',
  },
  generating_question: { pl: 'Generuję pytanie...', en: 'Generating question...' },
  generating_categories: { pl: 'Generuję kategorie...', en: 'Generating categories...' },
  question_generation_error: {
    pl: 'Nie udało się wygenerować pytania. Sprawdź konsolę, by poznać szczegóły.',
    en: 'Failed to generate a question. Check console for details.',
  },
  answer_placeholder: { pl: 'Wpisz swoją odpowiedź...', en: 'Type your answer here...' },
  submit_answer_btn: { pl: 'Zatwierdź Odpowiedź', en: 'Submit Answer' },
  analyzing_text: { pl: 'Analizuję...', en: 'Analyzing...' },
  empty_answer_error: { pl: 'Proszę wpisać odpowiedź.', en: 'Please enter an answer.' },
  answer_evaluation: { pl: 'Oceń odpowiedź', en: 'Evaluate Answer' },
  player_answer_was: { pl: 'Odpowiedź gracza:', en: "Player's answer:" },
  correct_answer_is: { pl: 'Poprawna odpowiedź:', en: 'Correct answer:' },
  roll_again: { pl: 'Rzuć ponownie', en: 'Roll again' },
  explanation: { pl: 'Wyjaśnienie:', en: 'Explanation:' },
  your_answer_explanation: { pl: 'Porównanie odpowiedzi:', en: 'Answer Comparison:' },
  llm_evaluation: { pl: 'Werdykt', en: 'Verdict' },
  evaluation_certainty_text: {
    pl: 'Werdykt dla: {verdict_for} (pewność: {certainty}%)',
    en: 'Verdict for: {verdict_for} (certainty: {certainty}%)',
  },
  verdict_player: { pl: 'Gracz', en: 'Player' },
  verdict_game: { pl: 'Gra', en: 'Game' },
  verify_answer_btn: { pl: 'Weryfikuj', en: 'Verify' },
  incorrect_answer_analysis_error: {
    pl: 'Nie udało się przeanalizować odpowiedzi.',
    en: 'Failed to analyze the answer.',
  },
  accept_answer: { pl: 'Poprawna', en: 'Correct' },
  reject_answer: { pl: 'Niepoprawna', en: 'Incorrect' },
  verification_error: { pl: 'Błąd weryfikacji.', en: 'Verification error.' },
  continue_btn: { pl: 'Kontynuuj', en: 'Continue' },
  congratulations: { pl: 'Gratulacje!', en: 'Congratulations!' },
  winner_is: { pl: 'Zwycięzcą jest', en: 'The winner is' },
  play_again_btn: { pl: 'Zagraj Ponownie', en: 'Play Again' },
  restart_game_btn: { pl: 'Zacznij od nowa', en: 'Start Over' },
  restart_game_confirm: {
    pl: 'Czy na pewno chcesz zrestartować grę? Cały postęp zostanie utracony.',
    en: 'Are you sure you want to restart the game? All progress will be lost.',
  },
  suggestion_modal_title: { pl: 'Sugestie', en: 'Suggestions' },
  suggestion_loader_text: { pl: 'Generuję sugestie...', en: 'Generating suggestions...' },
  suggestion_error: {
    pl: 'Nie udało się wygenerować sugestii.',
    en: 'Could not generate suggestions.',
  },
  suggestion_input_needed: {
    pl: 'Proszę wpisać kategorię, aby uzyskać sugestie.',
    en: 'Please enter a category to get suggestions for.',
  },
  suggestion_button_title: { pl: 'Zasugeruj alternatywy', en: 'Suggest alternatives' },
  infobox_temp_desc: {
    pl: 'Kontroluje "kreatywność" modelu AI. Niska wartość (np. 0.2) tworzy bardziej przewidywalne i zachowawcze pytania. Wysoka wartość (np. 1.2) zachęca do tworzenia bardziej zróżnicowanych i nieoczekiwanych treści, co może czasem prowadzić do dziwnych wyników.',
    en: "Controls the 'creativity' of the AI model. A low value (e.g., 0.2) generates more predictable and conservative questions. A high value (e.g., 1.2) encourages more diverse and unexpected content, which can sometimes lead to strange results.",
  },
  generating_mutation: { pl: 'Generuję nowe kategorie...', en: 'Generating new categories...' },
  infobox_rules_title: { pl: '📜 Zasady Gry', en: '📜 Game Rules' },
  infobox_rules_desc: {
    pl: `
            <ul class="list-disc list-inside space-y-1 mt-1 mb-2 text-slate-600">
                <li><b>Cel gry:</b> Jako pierwszy zdobyć 6 kolorowych kółek (cząstek) – po jednym z każdej kategorii.</li>
                <li><b>Tura gracza:</b> Rzuć kostką, przesuń pionek o wyrzuconą liczbę oczek i odpowiedz na pytanie z kategorii pola, na którym staniesz. Poprawna odpowiedź pozwala rzucać dalej.</li>
                <li><b>Zdobywanie kółek:</b> Poprawna odpowiedź na "polu głównym / HQ" (duże pole na końcu ramienia) nagradzana jest kółkiem w kolorze tego pola.</li>
                <li><b>Białe pola ("Rzuć ponownie"):</b> Wszystkie białe/szare pola na zewnętrznym pierścieniu (poza polem centralnym) to pola specjalne – stanięcie na nich natychmiast daje dodatkowy rzut kostką.</li>
                <li><b>Pole centralne ("Piasta"):</b> Pozwala wybrać dowolną kategorię pytania, na które chcesz odpowiedzieć.</li>
            </ul>
        `,
    en: `
            <ul class="list-disc list-inside space-y-1 mt-1 mb-2 text-slate-600">
                <li><b>Objective:</b> Be the first to collect a colored disc (wedge) from each of the six categories.</li>
                <li><b>Gameplay:</b> Roll the die, move your pawn, and answer the question for the category you land on. A correct answer lets you keep rolling.</li>
                <li><b>Earning Discs:</b> Correctly answer a question on a category "HQ" (large round space at the end of the spoke) to earn that category's disc.</li>
                <li><b>White Squares ("Roll Again"):</b> All white/light-gray squares on the outer ring (excluding the center hub) are special spaces – landing on them immediately grants an extra roll.</li>
                <li><b>Central Square ("Hub"):</b> Landing on the center space allows you to choose any category you want to answer.</li>
            </ul>
        `,
  },
  game_menu_title: { pl: 'Menu Gry', en: 'Game Menu' },
  show_history_btn: { pl: 'Pokaż historię promptów', en: 'Show prompt history' },
  generate_categories_error: {
    pl: 'Nie udało się wygenerować kategorii. Sprawdź ustawienia API i spróbuj ponownie.',
    en: 'Failed to generate categories. Check API settings and try again.',
  },
  backend_categories_error: {
    pl: 'Backend nie zwrócił poprawnych kategorii.',
    en: 'Backend did not return valid categories.',
  },
  backend_question_error: {
    pl: 'Backend nie zwrócił poprawnego pytania.',
    en: 'Backend response is not a valid question object.',
  },
  category_mutated: { pl: 'Kategoria zmutowała!', en: 'Category has mutated!' },
  new_category_msg: {
    pl: '"{old_cat}" zmienia się w "{new_cat}"!',
    en: '"{old_cat}" changes into "{new_cat}"!',
  },
  history_modal_title: { pl: 'Historia Zapytań', en: 'Request History' },
  history_prompt_title: { pl: 'Wysłane Zapytanie (do backendu)', en: 'Sent Request (to backend)' },
  history_response_title: { pl: 'Otrzymana Odpowiedź', en: 'Received Response' },
  history_empty: { pl: 'Historia jest jeszcze pusta.', en: 'History is empty.' },
  rate_limit_title: { pl: 'Przekroczono limit zapytań', en: 'Request Limit Exceeded' },
  rate_limit_desc: {
    pl: 'Wykorzystałeś limit zapytań dla obecnego modelu. Wybierz inny model, aby kontynuować grę.',
    en: 'You have used the request limit for the current model. Please choose another model to continue.',
  },
  confirm_choice_btn: { pl: 'Zatwierdź wybór', en: 'Confirm Choice' },
  download_state_btn: { pl: 'Pobierz zapis', en: 'Download State' },
  upload_state_btn: { pl: 'Wczytaj grę', en: 'Load Game' },
  theme_title: { pl: 'Motyw', en: 'Theme' },
  theme_light_label: { pl: 'Jasny', en: 'Light' },
  theme_dark_label: { pl: 'Ciemny', en: 'Dark' },
  theme_oled_label: { pl: 'OLED', en: 'OLED' },
  scaling_title: { pl: 'Skalowanie UI', en: 'UI Scaling' },
  scale_dice: { pl: 'Kostka', en: 'Dice' },
  scale_board: { pl: 'Plansza', en: 'Board' },
  scale_descriptions: { pl: 'Opisy ruchu', en: 'Move descriptions' },
  scale_question: { pl: 'Karta pytania', en: 'Question card' },
  language_pl: { pl: 'Polski', en: 'Polish' },
  language_en: { pl: 'English', en: 'English' },
  game_loaded_success: { pl: 'Gra wczytana pomyślnie!', en: 'Game loaded successfully!' },
  game_loaded_error: {
    pl: 'Błąd wczytywania pliku. Upewnij się, że to poprawny plik zapisu.',
    en: "Error loading file. Make sure it's a valid save file.",
  },
  choose_6_categories_btn: { pl: 'Wybierz 6 Kategorii do Gry', en: 'Choose 6 Categories for Game' },
  modal_choose_categories_title: {
    pl: 'Wybierz 6 kategorii do gry',
    en: 'Choose 6 categories for the game',
  },
  modal_choose_categories_desc: {
    pl: 'Wybierz dokładnie 6 kategorii, z których będą losowane pytania w trakcie rozgrywki.',
    en: 'Select exactly 6 categories from which questions will be drawn during the game.',
  },
  category_search_placeholder: { pl: 'Szukaj kategorii...', en: 'Search categories...' },
  category_questions: { pl: 'Pytania', en: 'Questions' },
  category_selected: { pl: 'Wybrana', en: 'Selected' },
  filter_all: { pl: 'Wszystkie', en: 'All' },
  preset_classic_pl: { pl: 'Klasyk PL', en: 'Classic PL' },
  preset_pop_pl: { pl: 'Popkultura PL', en: 'Popculture PL' },
  preset_classic_en: { pl: 'Classic EN', en: 'Classic EN' },
  btn_random_select_6: { pl: 'Losuj 6 kategorii', en: 'Select 6 random' },
  btn_clear_categories: { pl: 'Odznacz wszystkie', en: 'Deselect all' },
  btn_cancel: { pl: 'Anuluj', en: 'Cancel' },
  btn_apply: { pl: 'Zatwierdź Wybór', en: 'Confirm Selection' },
  tab_offline: { pl: '📦 Wybierz Bazę Pytań', en: '📦 Choose Question Base' },
  tab_prompt: { pl: '📋 Kreator Promptu dla AI', en: '📋 AI Prompt Creator' },
  db_preset_select_label: {
    pl: 'Wybierz wbudowaną bazę pytań:',
    en: 'Choose a built-in question database:',
  },
  db_file_upload_label: {
    pl: 'Wgraj plik bazy pytań (.json):',
    en: 'Upload question database file (.json):',
  },
  db_text_paste_label: {
    pl: 'Wklej tekst bazy pytań (JSON):',
    en: 'Paste question database text (JSON):',
  },
  db_text_paste_placeholder: {
    pl: 'Wklej obiekt JSON, np.:\n{\n  "name": "Moja Baza",\n  "language": "pl",\n  ...\n}',
    en: 'Paste JSON object, e.g.:\n{\n  "name": "My Base",\n  "language": "en",\n  ...\n}',
  },
  db_text_paste_btn: { pl: 'Wczytaj wklejony tekst', en: 'Load pasted text' },
  offline_help_text: {
    pl: 'Pytania będą wczytywane lokalnie z wybranej bazy. Możesz też stworzyć bazę pytań za pomocą <a href="generator.html" class="text-indigo-650 font-bold hover:underline">Generatora Pytań (AI)</a>.',
    en: 'Questions will be loaded locally from the selected database. You can also create a question database using the <a href="generator.html" class="text-indigo-650 font-bold hover:underline">Question Generator (AI)</a>.',
  },
  prompt_q_per_category_label: {
    pl: 'Liczba pytań na kategorię:',
    en: 'Number of questions per category:',
  },
  prompt_q_suggested: {
    pl: 'Sugerowane: 20 pytań na gracza.',
    en: 'Suggested: 20 questions per player.',
  },
  prompt_format_label: { pl: 'Format wyjściowy:', en: 'Output format:' },

  prompt_format_json: { pl: 'Standardowy JSON', en: 'Standard JSON' },
  copy_prompt_btn: { pl: 'Kopiuj prompt dla AI 📋', en: 'Copy prompt for AI 📋' },
  prompt_help_text: {
    pl: '<b>Jak to działa?</b> Skonfiguruj kategorie po prawej stronie, wpisz opcjonalny temat, wybierz format, a następnie kliknij przycisk powyżej. Wklej skopiowany prompt do ulubionego modelu AI (np. ChatGPT, Claude, Gemini). Zapisz odpowiedź jako plik <code>.txt</code> lub <code>.json</code> (lub po prostu skopiuj jej tekst) i wgraj/wklej w zakładce obok: <b>Wybierz Bazę Pytań</b>.',
    en: '<b>How it works:</b> Configure the categories on the right, enter an optional theme, choose a format, and click the button above. Paste the copied prompt into your favorite AI model (e.g. ChatGPT, Claude, Gemini). Save the response as a <code>.txt</code> or <code>.json</code> file (or just copy its text) and upload/paste it in the tab: <b>Choose Question Base</b>.',
  },
  roll_dice_title: { pl: 'Rzuć kostką', en: 'Roll the die' },
  generator_link_btn: { pl: 'Generator baz pytań', en: 'Question Database Generator' },
  explanation_correct_label: {
    pl: 'Wyjaśnienie poprawnej odpowiedzi:',
    en: 'Explanation of correct answer:',
  },
  explanation_incorrect_label: {
    pl: 'Wyjaśnienie odpowiedzi niepoprawnych:',
    en: 'Explanation of incorrect answers:',
  },
  explanation_none: { pl: 'Brak dostępnych wyjaśnień.', en: 'No explanations available.' },
  no_save_title: { pl: 'Brak zapisu', en: 'No Save Found' },
  no_save_body: { pl: 'Nie znaleziono zapisanej gry.', en: 'No saved game state was found.' },
  file_error_title: { pl: 'Błąd pliku', en: 'File Error' },

  // Wizard translations
  welcome_title: { pl: 'Witaj w grze Trivia!', en: 'Welcome to Trivia!' },
  welcome_desc: {
    pl: 'Klasyczna gra planszowa z pytaniami w nowej odsłonie. Skonfiguruj rozgrywkę w kilku prostych krokach.',
    en: 'A classic trivia board game reinvented. Set up your gameplay in a few simple steps.',
  },
  continue_game_title: { pl: 'Masz już zapisaną grę?', en: 'Have a saved game?' },
  players_step_title: { pl: 'Dodaj graczy', en: 'Add players' },
  players_step_desc: {
    pl: 'Podaj imiona graczy i wybierz dla nich emoji. Możesz dodać od 1 do 10 graczy.',
    en: "Enter players' names and select their emojis. You can add from 1 to 10 players.",
  },
  categories_step_title: { pl: 'Wybierz kategorie', en: 'Select categories' },
  categories_step_desc: {
    pl: 'Wybierz dokładnie 6 kategorii pytań, które pojawią się na planszy.',
    en: 'Select exactly 6 question categories that will appear on the board.',
  },
  rules_step_title: { pl: 'Wyjaśnienie zasad', en: 'Game rules' },
  rules_step_desc: {
    pl: 'Zapoznaj się z podstawowymi zasadami przed rozpoczęciem gry.',
    en: 'Familiarize yourself with the basic rules before starting the game.',
  },
  step_lang: { pl: 'Język', en: 'Language' },
  step_players: { pl: 'Gracze', en: 'Players' },
  step_categories: { pl: 'Kategorie', en: 'Categories' },
  step_rules: { pl: 'Zasady', en: 'Rules' },
  wizard_back_btn: { pl: 'Wstecz', en: 'Back' },
  wizard_next_btn: { pl: 'Dalej', en: 'Next' },
  advanced_title: {
    pl: 'Zaawansowane (własna baza pytań)',
    en: 'Advanced (custom question database)',
  },
  advanced_desc: {
    pl: 'Załaduj plik JSON lub wklej tekst bazy pytań, aby zagrać z własnymi pytaniami.',
    en: 'Load a JSON file or paste question database text to play with your own questions.',
  },
  selected_categories_header: { pl: 'Wybrane kategorie', en: 'Selected categories' },

  // Generator translations
  gen_back_to_game: { pl: 'Powrót do Gry', en: 'Back to Game' },
  gen_llm_config_title: { pl: '🔑 Konfiguracja LLM', en: '🔑 LLM Configuration' },
  gen_ai_provider: { pl: 'Dostawca AI:', en: 'AI Provider:' },
  gen_api_key: { pl: 'Klucz API:', en: 'API Key:' },
  gen_ai_models: { pl: 'Modele AI', en: 'AI Models' },
  gen_refresh_list: { pl: 'Odśwież listę', en: 'Refresh List' },
  gen_model_bp_label: {
    pl: '🧠 Model dla Blueprintów (Wysoka logika):',
    en: '🧠 Model for Blueprints (High reasoning):',
  },
  gen_model_q_label: {
    pl: '⚡ Model dla Pytań (Szybkość/Wydajność):',
    en: '⚡ Model for Questions (Speed/Efficiency):',
  },
  gen_custom_url: { pl: 'Custom URL (opcjonalnie):', en: 'Custom URL (optional):' },
  gen_config_title: { pl: '📦 Konfiguracja Generatora', en: '📦 Generator Configuration' },
  gen_q_lang: { pl: 'Język pytań:', en: 'Question language:' },
  gen_lang_pl: { pl: 'Polski (PL)', en: 'Polish (PL)' },
  gen_lang_en: { pl: 'English (EN)', en: 'English (EN)' },
  gen_lang_both: { pl: 'Oba języki (PL + EN)', en: 'Both languages (PL + EN)' },
  gen_q_per_category: { pl: 'Liczba pytań na kategorię:', en: 'Questions per category:' },
  gen_batch_size_label: {
    pl: '⚡ Pytań w jednym prompcie (batch):',
    en: '⚡ Questions per prompt (batch):',
  },
  gen_batch_slow: { pl: '1 (wolno, precyzyjnie)', en: '1 (slow, precise)' },
  gen_batch_fast: { pl: '20 (szybko, batch)', en: '20 (fast, batch)' },
  gen_default_difficulty: { pl: 'Domyślny Poziom Trudności:', en: 'Default Difficulty Level:' },
  gen_diff_basic: { pl: 'Podstawowy / Basic', en: 'Basic' },
  gen_diff_intermediate: { pl: 'Średniozaawansowany / Intermediate', en: 'Intermediate' },
  gen_diff_expert: { pl: 'Ekspercki / Expert', en: 'Expert' },
  gen_theme_label: { pl: 'Motyw przewodni pytań (opcjonalnie):', en: 'Question theme (optional):' },
  gen_theme_placeholder: { pl: 'np. Popkultura lat 90...', en: 'e.g., 90s Pop Culture...' },
  gen_workspace_label: { pl: 'Workspace (Import pytań):', en: 'Workspace (Import questions):' },
  gen_open_dir_btn: {
    pl: '📂 Otwórz katalog bazy (.json)',
    en: '📂 Open database directory (.json)',
  },
  gen_load_file_btn: { pl: '📄 Wczytaj pojedynczy plik', en: '📄 Load single file' },
  gen_cats_and_gen_title: { pl: '🏷️ Kategorie i Generowanie', en: '🏷️ Categories & Generation' },
  gen_category_name_label: { pl: 'Nazwa Kategorii', en: 'Category Name' },
  gen_category_desc_label: { pl: 'Opis (opcjonalnie)', en: 'Description (optional)' },
  gen_add_cat_btn: { pl: '➕ Dodaj Kategorię do wygenerowania', en: '➕ Add Category to generate' },
  gen_clear_cats_btn: { pl: '🗑️ Wyczyść formularz', en: '🗑️ Clear form' },
  gen_start_btn: { pl: '🚀 Rozpocznij Generowanie', en: '🚀 Start Generation' },
  gen_stop_btn: { pl: 'Stop', en: 'Stop' },
  gen_progress_title: { pl: '⏳ Postęp Generowania', en: '⏳ Generation Progress' },
  gen_progress_counts: { pl: 'Wygenerowano: {count} pytań', en: 'Generated: {count} questions' },
  gen_status_waiting: { pl: 'Oczekiwanie...', en: 'Waiting...' },
  gen_review_title: { pl: '📝 Baza Pytań', en: '📝 Question Database' },
  gen_save_all_btn: { pl: '💾 Zapisz wszystko na dysk', en: '💾 Save all to disk' },
  gen_export_all_btn: { pl: '📥 Pobierz ZIP / Pliki', en: '📥 Download ZIP / Files' },
  gen_check_spoilers_btn: { pl: '⚠️ Sprawdź Spoilery', en: '⚠️ Check Spoilers' },
  gen_download_cats_subtitle: {
    pl: 'Pobierz lub zapisz kategorie:',
    en: 'Download or save categories:',
  },
  gen_search_placeholder: {
    pl: 'Szukaj w pytaniach i odpowiedziach...',
    en: 'Search in questions and answers...',
  },
  gen_filter_all_cats: { pl: 'Wszystkie kategorie', en: 'All categories' },
  gen_filter_all_langs: { pl: 'Wszystkie języki', en: 'All languages' },
  gen_filter_lang_pl: { pl: 'Polski (PL)', en: 'Polish (PL)' },
  gen_filter_lang_en: { pl: 'English (EN)', en: 'English (EN)' },
  gen_new_q_btn: { pl: 'Nowe pytanie', en: 'New question' },
  gen_table_th_category: { pl: 'Kategoria', en: 'Category' },
  gen_table_th_question: { pl: 'Pytanie', en: 'Question' },
  gen_table_th_answer: { pl: 'Poprawna Odpowiedź', en: 'Correct Answer' },
  gen_table_th_actions: { pl: 'Akcje', en: 'Actions' },
  gen_modal_edit_title: { pl: 'Edytuj pytanie', en: 'Edit question' },
  gen_modal_new_title: { pl: 'Nowe pytanie', en: 'New question' },
  gen_modal_category: { pl: 'Kategoria', en: 'Category' },
  gen_modal_subcategory: {
    pl: 'Tag / Podkategoria (opcjonalnie)',
    en: 'Tag / Subcategory (optional)',
  },
  gen_modal_language: { pl: 'Język', en: 'Language' },
  gen_modal_q_text: { pl: 'Treść Pytania', en: 'Question Content' },
  gen_modal_options_title: { pl: 'Opcje odpowiedzi', en: 'Answer options' },
  gen_modal_correct_hint: {
    pl: 'Wskaż poprawną (musi być identyczna jak jedna z opcji wyżej!)',
    en: 'Indicate the correct one (must match one of the options above exactly!)',
  },
  gen_modal_explanation_correct: { pl: 'Wyjaśnienie (poprawna)', en: 'Explanation (correct)' },
  gen_modal_explanation_incorrect: {
    pl: 'Wyjaśnienie (błędne dystraktory)',
    en: 'Explanation (incorrect distractors)',
  },
  gen_modal_cancel: { pl: 'Anuluj', en: 'Cancel' },
  gen_modal_save: { pl: 'Zapisz', en: 'Save' },
  gen_spoiler_title: { pl: 'Wykryte Spoilery w Pytaniach', en: 'Detected Spoilers in Questions' },
  gen_spoiler_desc: {
    pl: 'Narzędzie wykrywa pytania, w których treść pytania zawiera poprawną odpowiedź (lub jej odmienioną formę/część). Możesz poprawić je ręcznie w tabeli lub automatycznie za pomocą AI.',
    en: 'This tool detects questions where the question text contains the correct answer (or an inflected form/part of it). You can correct them manually in the table or automatically using AI.',
  },
  gen_spoiler_all_langs: { pl: 'Wszystkie języki', en: 'All languages' },
  gen_spoiler_autofix_btn: {
    pl: '🤖 Popraw wyświetlone przez AI',
    en: '🤖 Autofix displayed via AI',
  },
  gen_spoiler_th_original: { pl: 'Pytanie (Oryginał)', en: 'Question (Original)' },
  gen_spoiler_th_answer: { pl: 'Odpowiedź', en: 'Answer' },
  gen_spoiler_th_match: { pl: 'Dopasowanie', en: 'Match' },
  gen_spoiler_th_new_text: { pl: 'Nowa Treść Pytania', en: 'New Question Content' },
  gen_spoiler_th_actions: { pl: 'Akcje', en: 'Actions' },
  gen_spoiler_status_msg: {
    pl: 'Wykryto {count} podejrzanych pytań.',
    en: 'Detected {count} suspicious questions.',
  },
  gen_spoiler_save_btn: { pl: 'Zapisz wszystkie', en: 'Save all' },
  gen_spoiler_close_btn: { pl: 'Zamknij', en: 'Close' },
  gen_load_confirm: {
    pl: 'Czy chcesz automatycznie załadować wszystkie pliki JSON z tego katalogu do bazy pytań?',
    en: 'Do you want to automatically load all JSON files from this directory into the question database?',
  },
  gen_load_success: {
    pl: 'Pomyślnie załadowano {count} z {total} kategorii (.json).',
    en: 'Successfully loaded {count} out of {total} categories (.json).',
  },
  gen_load_error: {
    pl: 'Błąd wczytywania katalogu: {error}',
    en: 'Error loading directory: {error}',
  },
  gen_import_success: {
    pl: 'Dołączono kategorię: {name} ({count} pytań)',
    en: 'Imported category: {name} ({count} questions)',
  },
  gen_import_error: { pl: 'Błąd importu: {error}', en: 'Import error: {error}' },
  gen_api_key_required: { pl: 'Wymagany jest klucz API!', en: 'API Key is required!' },
  gen_models_fetched: { pl: 'Modele pobrane!', en: 'Models fetched successfully!' },
  gen_models_fetch_error: { pl: 'Błąd pobierania modeli.', en: 'Error fetching models.' },
  gen_fill_categories: {
    pl: 'Uzupełnij nazwy kategorii!',
    en: 'Please fill in all category names!',
  },
  gen_stopped: { pl: 'Zatrzymano.', en: 'Stopped.' },
  gen_finished: { pl: 'Zakończono generowanie!', en: 'Generation finished!' },
  gen_error: { pl: 'Błąd generowania.', en: 'Generation error.' },
  gen_saved_file: { pl: 'Zapisano {file}', en: 'Saved {file}' },
  gen_save_error: { pl: 'Błąd zapisu.', en: 'Error saving file.' },
  gen_zip_success: {
    pl: 'Pomyślnie pobrano plik ZIP ze wszystkimi kategoriami!',
    en: 'Successfully downloaded ZIP file with all categories!',
  },
  gen_zip_error: { pl: 'Błąd tworzenia ZIP: {error}', en: 'Error creating ZIP: {error}' },
  gen_no_questions_export: { pl: 'Brak pytań do wyeksportowania!', en: 'No questions to export!' },
  gen_no_questions_lang: {
    pl: 'Brak pytań pasujących do wybranego filtra języka!',
    en: 'No questions matching the selected language filter!',
  },
  gen_question_updated: { pl: 'Zaktualizowano pytanie.', en: 'Question updated.' },
  gen_question_added: { pl: 'Dodano nowe pytanie!', en: 'New question added!' },
  gen_fill_required: {
    pl: 'Wypełnij wszystkie wymagane pola (kategoria, pytanie i 4 opcje)!',
    en: 'Please fill all required fields (category, question and 4 options)!',
  },
  gen_spoiler_none: {
    pl: 'Nie wykryto żadnych pytań zawierających odpowiedzi dla wybranego języka.',
    en: 'No questions containing answers detected for the selected language.',
  },
  gen_spoilers_autofixed: {
    pl: 'AI poprawiło pytanie i odpowiedź!',
    en: 'AI corrected the question and answer!',
  },
  gen_spoilers_autofix_error: {
    pl: 'Nieprawidłowy format odpowiedzi AI.',
    en: 'Invalid AI response format.',
  },
  gen_spoilers_rewrite_error: { pl: 'Błąd przepisywania: {error}', en: 'Rewrite error: {error}' },
  gen_spoilers_saved_single: {
    pl: 'Zapisano poprawione pytanie i odpowiedź.',
    en: 'Saved corrected question and answer.',
  },
  gen_spoilers_saved_all: {
    pl: 'Zapisano wszystkie poprawione pytania i odpowiedzi ({count}).',
    en: 'Saved all corrected questions and answers ({count}).',
  },
  gen_spoilers_autofix_bulk_error: {
    pl: 'Wystąpił błąd podczas masowego przepisywania.',
    en: 'An error occurred during bulk rewriting.',
  },
  gen_suggest_cats_btn: { pl: '💡 Sugeruj kategorie (AI)', en: '💡 Suggest categories (AI)' },
  gen_suggest_modal_title: { pl: '💡 Sugerowane Kategorie', en: '💡 Suggested Categories' },
  gen_suggest_modal_desc: {
    pl: 'Na podstawie już istniejących kategorii i wybranego języka, AI wygenerowało następujące propozycje. Wybierz te, które chcesz dodać do listy:',
    en: 'Based on existing categories and the selected language, AI generated the following proposals. Select those you want to add to the list:',
  },
  gen_suggest_loading: { pl: 'Generowanie propozycji...', en: 'Generating proposals...' },
  gen_suggest_close_btn: { pl: 'Zamknij', en: 'Close' },
  gen_suggest_add_btn: { pl: '➕ Dodaj wybrane', en: '➕ Add selected' },
  gen_suggest_fetch_error: {
    pl: 'Błąd podczas generowania propozycji kategorii.',
    en: 'Error generating category proposals.',
  },
  gen_suggest_added_notification: {
    pl: 'Dodano {count} nowych kategorii.',
    en: 'Added {count} new categories.',
  },
  gen_suggest_loaded_cats_title: {
    pl: 'Załadowane kategorie (baza dla AI)',
    en: 'Loaded categories (AI base)',
  },
  gen_concurrency_label: {
    pl: '🔄 Współbieżność (równoległe zapytania):',
    en: '🔄 Concurrency (parallel requests):',
  },
  gen_concurrency_low: {
    pl: '1 (sekwencyjnie)',
    en: '1 (sequentially)',
  },
  gen_concurrency_high: {
    pl: '10 (maks. współbieżność)',
    en: '10 (max concurrency)',
  },
  gen_check_verify_btn: { pl: '🔍 Kompleksowa Weryfikacja AI', en: '🔍 Full AI Verification' },
  gen_verify_title: { pl: 'Kompleksowa Weryfikacja Pytań AI', en: 'Full AI Question Verification' },
  gen_verify_desc: {
    pl: 'Narzędzie analizuje wybrane pytania pod kątem duplikatów, logiczności pytań i odpowiedzi, jakości dystraktorów oraz wyjaśnień. AI wskaże problemy i zaproponuje poprawki, które możesz zatwierdzić.',
    en: 'This tool analyzes the selected questions for duplicates, logic of questions/answers, distractor quality, and explanations. AI will detect issues and suggest fixes for you to approve.',
  },
  gen_verify_all_langs: { pl: 'Wszystkie języki', en: 'All languages' },
  gen_verify_run_btn: { pl: '🤖 Uruchom analizę AI', en: '🤖 Run AI Analysis' },
  gen_verify_loading: {
    pl: 'Analizowanie pytań przez AI (może potrwać kilkanaście sekund)...',
    en: 'AI is analyzing questions (may take several seconds)...',
  },
  gen_verify_none: {
    pl: 'Brak sugestii zmian. Wszystkie pytania przeszły weryfikację pomyślnie!',
    en: 'No change suggestions. All questions passed verification successfully!',
  },
  gen_verify_status_msg: {
    pl: 'Wykryto {count} pytań z sugerowanymi zmianami.',
    en: 'Detected {count} questions with suggested changes.',
  },
  gen_verify_save_btn: { pl: 'Zatwierdź wszystkie wybrane', en: 'Accept all selected' },
  gen_verify_close_btn: { pl: 'Zamknij', en: 'Close' },
  gen_verify_th_original: { pl: 'ORYGINAŁ', en: 'ORIGINAL' },
  gen_verify_th_suggested: {
    pl: 'SUGEROWANE ZMIANY (EDYTOWALNE)',
    en: 'SUGEROWANE ZMIANY (EDITABLE)',
  },
  gen_verify_th_issues: { pl: 'Wykryte Problemy', en: 'Detected Issues' },
  gen_verify_accept_btn: { pl: 'Zatwierdź', en: 'Accept' },
  gen_verify_reject_btn: { pl: 'Odrzuć', en: 'Reject' },
  gen_verify_saved_single: {
    pl: 'Zatwierdzono poprawki dla pytania.',
    en: 'Approved corrections for the question.',
  },
  gen_verify_saved_all: {
    pl: 'Zatwierdzono {count} poprawek.',
    en: 'Approved {count} corrections.',
  },
  gen_verify_no_questions: {
    pl: 'Brak pytań do zweryfikowania! Wygeneruj lub załaduj pytania najpierw.',
    en: 'No questions to verify! Generate or load questions first.',
  },
  gen_verify_analysis_error: {
    pl: 'Błąd weryfikacji przez AI: {error}',
    en: 'AI verification error: {error}',
  },
  gen_verify_confidence: { pl: 'Pewność zmiany', en: 'Confidence' },
  gen_verify_confidence_high: { pl: 'Wysoka', en: 'High' },
  gen_verify_confidence_medium: { pl: 'Średnia', en: 'Medium' },
  gen_verify_confidence_low: { pl: 'Niska', en: 'Low' },
  gen_verify_last_verified: { pl: 'Ost. weryfikacja', en: 'Last verified' },
  gen_verify_not_verified: { pl: 'Brak wcześniejszej weryfikacji', en: 'Not yet verified' },
  gen_verify_unverified_only: {
    pl: 'Tylko niezweryfikowane (seria)',
    en: 'Only unverified (serial)',
  },
  gen_verify_force_reverify: { pl: 'Wymuś ponowną weryfikację', en: 'Force re-verification' },
  gen_verify_next_batch_btn: {
    pl: '⏭️ Weryfikuj kolejne 500 ({count} pozostało)',
    en: '⏭️ Verify next 500 ({count} left)',
  },
  gen_verify_unverified_pool_status: {
    pl: 'Pozostało niezweryfikowanych pytań: {count}',
    en: 'Unverified questions left: {count}',
  },
};

// Make CATEGORY_PRESETS globally available for live-quiz-common.js
if (typeof window !== 'undefined') {
  window.CATEGORY_PRESETS = CATEGORY_PRESETS;
}

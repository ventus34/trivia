import { translations } from './config.js';
import { UI } from './dom.js';
import { refreshAnswerReadingCards, setAnswerReadingItems } from './reading-cards.js';

function makeReadingLabel(sourceNode, key) {
  const sourceLabel = sourceNode?.parentElement?.querySelector(`[data-lang-key="${key}"]`);
  if (!sourceLabel) return undefined;
  const label = sourceLabel.cloneNode(true);
  label.classList.add('reading-section-label');
  label.dataset.langKey = key;
  return label;
}

let showDetails = false;
let latestQuestionData = null;
let latestLanguage = 'pl';
let verificationStatus = null;

export function resetExplanationView() {
  showDetails = false;
  verificationStatus = null;
}

function readingLabel(sourceNode, key, text) {
  const label = makeReadingLabel(sourceNode, key);
  if (!label) return undefined;
  // Status is a real text label, not an icon conveyed solely through CSS.
  // It stays available to screen readers and is copied into measurement pages.
  delete label.dataset.langKey;
  label.textContent = text;
  return label;
}

function explanationSections(questionData, lang) {
  const sections = [];
  const correct = questionData?.explanation_correct || questionData?.explanation;
  const incorrect = questionData?.explanation_distractors || questionData?.explanation_incorrect;
  if (correct) sections.push({ label: translations.explanation_correct_label[lang], text: correct });
  if (incorrect) sections.push({ label: translations.explanation_incorrect_label[lang], text: incorrect });
  if (!sections.length) sections.push({ label: '', text: translations.explanation_none[lang] });
  return sections;
}

function setAnswerReadingContent() {
  const en = latestLanguage === 'en';
  const playerStatus = verificationStatus === null
    ? (en ? '◌ Awaiting review · Your answer' : '◌ Do oceny · Odpowiedź gracza')
    : verificationStatus
      ? (en ? '✓ Accepted · Your answer' : '✓ Poprawna · Odpowiedź gracza')
      : (en ? '✕ Incorrect · Your answer' : '✕ Niepoprawna · Odpowiedź gracza');
  const correctStatus = en ? '✓ Correct answer' : '✓ Poprawna odpowiedź';
  const items = showDetails ? [] : [
    {
      kind: 'text',
      node: UI.playerAnswerText,
      template: UI.playerAnswerText,
      text: UI.playerAnswerText.textContent,
      labelNode: readingLabel(UI.playerAnswerText, 'player_answer_was', playerStatus),
      sectionKey: 'player_answer_was',
    },
    {
      kind: 'text',
      node: UI.correctAnswerText,
      template: UI.correctAnswerText,
      text: UI.correctAnswerText.textContent,
      labelNode: readingLabel(UI.correctAnswerText, 'correct_answer_is', correctStatus),
      sectionKey: 'correct_answer_is',
    },
  ];

  if (showDetails && !UI.explanationContainer.classList.contains('hidden')) {
    explanationSections(latestQuestionData, latestLanguage).forEach(({ label, text }) => {
      items.push({
        kind: 'text',
        node: UI.explanationText,
        template: UI.explanationText,
        text,
        labelNode: label ? readingLabel(UI.explanationText, 'explanation', label) : undefined,
        sectionKey: 'explanation',
      });
    });
  }
  setAnswerReadingItems(items);
}

/**
 * Builds a localized explanation string for correct/incorrect answers.
 * @param {object} questionData
 * @param {string} lang - 'pl' | 'en'
 * @returns {string}
 */
export function buildExplanationContent(questionData, lang) {
  const explanationParts = [];

  const correctLabel = translations.explanation_correct_label[lang];

  if (questionData?.explanation_correct) {
    explanationParts.push(`${correctLabel}\n${questionData.explanation_correct}`);
  } else if (questionData?.explanation) {
    explanationParts.push(`${correctLabel}\n${questionData.explanation}`);
  }

  const incorrectExplanation =
    questionData?.explanation_distractors || questionData?.explanation_incorrect;
  if (incorrectExplanation) {
    const incorrectLabel = translations.explanation_incorrect_label[lang];
    explanationParts.push(`${incorrectLabel}\n${incorrectExplanation}`);
  }

  if (explanationParts.length > 0) {
    return explanationParts.join('\n\n');
  }

  return translations.explanation_none[lang];
}

/**
 * Renders explanation content and styles into provided elements.
 * @param {object} options
 * @param {object} options.questionData
 * @param {string} options.lang
 * @param {HTMLElement} options.containerEl
 * @param {HTMLElement} options.textEl
 * @param {boolean} options.isCorrect
 */
export function renderExplanation({ questionData, lang, containerEl, textEl, isCorrect }) {
  latestQuestionData = questionData;
  latestLanguage = lang === 'en' ? 'en' : 'pl';
  verificationStatus = typeof isCorrect === 'boolean' ? isCorrect : null;
  const explanationContent = buildExplanationContent(questionData, lang);

  containerEl.classList.remove('hidden');
  textEl.textContent = explanationContent;
  textEl.style.whiteSpace = 'pre-line';

  textEl.classList.remove('bg-yellow-100', 'bg-red-100', 'bg-green-100');
  textEl.classList.add('bg-gray-100');
  UI.playerAnswerText.classList?.remove('bg-gray-100', 'bg-red-100', 'bg-green-100');
  UI.playerAnswerText.classList?.add(verificationStatus === null ? 'bg-gray-100' : verificationStatus ? 'bg-green-100' : 'bg-red-100');

  // Snapshot the canonical values again so manual verification can replace an
  // explanation after the answer deck is already open without showing stale text.
  const popup = UI.answerPopup;
  if (popup?.ownerDocument) {
    let toggle = popup.querySelector('[data-explanation-toggle]');
    if (!toggle) {
      toggle = popup.ownerDocument.createElement('button');
      toggle.type = 'button';
      toggle.dataset.explanationToggle = '';
      toggle.className = 'explanation-toggle';
      popup.querySelector('#standard-popup-content').appendChild(toggle);
      toggle.addEventListener('click', () => {
        showDetails = !showDetails;
        updateToggle(toggle);
        setAnswerReadingContent();
        refreshAnswerReadingCards();
        toggle.focus();
      });
    }
    updateToggle(toggle);
  }
  setAnswerReadingContent();
  refreshAnswerReadingCards()?.catch((error) => {
    console.warn('Could not refresh answer reading cards after explanation update.', error);
  });
}

function updateToggle(toggle) {
  const english = toggle.ownerDocument.documentElement.lang === 'en';
  toggle.textContent = showDetails ? (english ? 'Back to result' : 'Wróć do wyniku') : (english ? 'Explanation' : 'Wyjaśnienie');
  toggle.setAttribute('aria-expanded', String(showDetails));
}

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

function setAnswerReadingContent() {
  const items = [
    {
      kind: 'text',
      node: UI.playerAnswerText,
      template: UI.playerAnswerText,
      text: UI.playerAnswerText.textContent,
      labelNode: makeReadingLabel(UI.playerAnswerText, 'player_answer_was'),
      sectionKey: 'player_answer_was',
    },
    {
      kind: 'text',
      node: UI.correctAnswerText,
      template: UI.correctAnswerText,
      text: UI.correctAnswerText.textContent,
      labelNode: makeReadingLabel(UI.correctAnswerText, 'correct_answer_is'),
      sectionKey: 'correct_answer_is',
    },
  ];

  if (!UI.explanationContainer.classList.contains('hidden')) {
    items.push({
      kind: 'text',
      node: UI.explanationText,
      template: UI.explanationText,
      text: UI.explanationText.textContent,
      labelNode: makeReadingLabel(UI.explanationText, 'explanation'),
      sectionKey: 'explanation',
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
  const explanationContent = buildExplanationContent(questionData, lang);

  containerEl.classList.remove('hidden');
  textEl.textContent = explanationContent;
  textEl.style.whiteSpace = 'pre-line';

  if (isCorrect) {
    textEl.classList.remove('bg-yellow-100', 'bg-red-100');
    textEl.classList.add('bg-green-100');
  } else {
    textEl.classList.remove('bg-yellow-100', 'bg-green-100');
    textEl.classList.add('bg-red-100');
  }

  // Snapshot the canonical values again so manual verification can replace an
  // explanation after the answer deck is already open without showing stale text.
  setAnswerReadingContent();
  refreshAnswerReadingCards()?.catch((error) => {
    console.warn('Could not refresh answer reading cards after explanation update.', error);
  });
}

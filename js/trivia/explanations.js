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

function setAnswerReadingContent(questionData, lang, verificationStatus) {
  const en = lang === 'en';
  const playerStatus = verificationStatus === null
    ? (en ? '◌ Awaiting review · Your answer' : '◌ Do oceny · Odpowiedź gracza')
    : verificationStatus
      ? (en ? '✓ Accepted · Your answer' : '✓ Poprawna · Odpowiedź gracza')
      : (en ? '✕ Incorrect · Your answer' : '✕ Niepoprawna · Odpowiedź gracza');
  const correctStatus = en ? '✓ Correct answer' : '✓ Poprawna odpowiedź';
  const items = [
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

  explanationSections(questionData, lang).forEach(({ label, text }) => {
    items.push({
      kind: 'text',
      node: UI.explanationText,
      template: UI.explanationText,
      text,
      labelNode: label ? readingLabel(UI.explanationText, 'explanation', label) : undefined,
      sectionKey: 'explanation',
      fillRemainingSpace: true,
    });
  });
  setAnswerReadingItems(items);
}

/**
 * Builds a localized explanation string for correct/incorrect answers.
 * @param {object} questionData
 * @param {string} lang - 'pl' | 'en'
 * @returns {string}
 */
export function buildExplanationContent(questionData, lang) {
  return explanationSections(questionData, lang)
    .map(({ label, text }) => (label ? `${label}\n${text}` : text))
    .join('\n\n');
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
  const verificationStatus = typeof isCorrect === 'boolean' ? isCorrect : null;
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
  setAnswerReadingContent(questionData, lang, verificationStatus);
  refreshAnswerReadingCards()?.catch((error) => {
    console.warn('Could not refresh answer reading cards after explanation update.', error);
  });
}

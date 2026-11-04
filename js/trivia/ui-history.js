/** Session question history, kept separate from portable game saves. */
import { UI } from './dom.js';
import { gameState } from './state.js';
import { translations } from './config.js';

let sessionId;
let entries = [];

export function recordQuestionHistory(question, category) {
  if (sessionId !== gameState.gameId) {
    entries = [];
    sessionId = gameState.gameId;
  }
  entries.push({ question: question.question, answer: question.answer, category });
}

export function renderPromptHistory() {
  UI.historyContent.replaceChildren();
  const en = gameState.currentLanguage === 'en';
  if (!entries.length || sessionId !== gameState.gameId) {
    UI.historyContent.textContent = translations.history_empty[gameState.currentLanguage];
    return;
  }
  entries.slice().reverse().forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'history-card';
    const category = document.createElement('p');
    category.className = 'history-category';
    category.textContent = entry.category;
    const question = document.createElement('h4');
    question.textContent = entry.question;
    const answer = document.createElement('p');
    answer.textContent = `${en ? 'Correct answer' : 'Poprawna odpowiedź'}: ${entry.answer}`;
    card.append(category, question, answer);
    UI.historyContent.appendChild(card);
  });
}

export function showHistoryModal() {
  UI.historyModalTitle.textContent = translations.history_modal_title[gameState.currentLanguage];
  renderPromptHistory();
  UI.historyModal.classList.add('visible');
}

export function hideHistoryModal() {
  UI.historyModal.classList.remove('visible');
}

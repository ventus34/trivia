/** Return a shuffled copy without changing the saved question data. */
export function shuffleAnswerOptions(options, random = Math.random) {
  const shuffled = options.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Returns null when the answer key does not identify exactly one choice. */
export function getChoiceVerdict(question, selectedOption) {
  const normalize = (text) => typeof text === 'string' ? text.trim().normalize('NFC').toLowerCase() : '';
  const answer = normalize(question.answer);
  if (!answer || !Array.isArray(question.options)) return null;
  const options = question.options.map(normalize);
  const selected = normalize(selectedOption);
  if (!selected || !options.includes(selected) || options.filter((option) => option === answer).length !== 1) {
    return null;
  }
  return selected === answer;
}

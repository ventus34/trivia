/** Return a shuffled copy without changing the saved question data. */
export function shuffleAnswerOptions(options, random = Math.random) {
  const shuffled = options.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

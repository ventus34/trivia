import { describe, expect, it } from 'vitest';
import {
  contentHash,
  currentVerification,
  exportQuestion,
  importQuestions,
  questionFingerprint,
  requireExistingIds,
  storeVerification,
  verificationResponse,
} from '../js/trivia/question-records.js';

const question = {
  id: 'q_fixture',
  question: 'Która odpowiedź?',
  subcategory: 'Język',
  options: ['Żółć', 'Gram', 'Piana', 'Krem'],
  answer: 'Żółć',
  explanation_correct: 'Poprawne.',
  explanation_incorrect: 'Pozostałe.',
};

describe('stable question records', () => {
  it('keeps open versions, preserves fields and prevents ID loss when overwriting', async () => {
    const pack = { name: 'Quiz', language: 'pl', last_verified_at: '2020', questions: [question] };
    const pool = [];
    expect(await importQuestions(pack, 'quiz_pl.json', pool)).toEqual({ added: 1, conflicts: [] });
    expect(await importQuestions(pack, 'quiz_pl.json', pool)).toEqual({ added: 0, conflicts: [] });
    const changed = { ...question, question: 'Inne pytanie?' };
    expect(await importQuestions({ ...pack, questions: [changed] }, 'copy.json', pool)).toEqual({
      added: 0,
      conflicts: [question.id],
    });
    expect(exportQuestion(pool[0])).toEqual(question);
    expect(currentVerification(pool[0])).toBeNull();
    expect(() => requireExistingIds(pack, { questions: [{ ...question, id: 'q_new' }] })).toThrow();
  });

  it('accepts only explicit and unique model results', () => {
    const response = verificationResponse([{ id: 'a' }, { id: 'b' }, { id: 'c' }], {
      results: [
        { id: 'a', status: 'passed' },
        { id: 'a', status: 'passed' },
        { id: 'b', status: 'uncertain' },
        { id: 'other', status: 'passed' },
      ],
    });
    expect([...response.results.keys()]).toEqual(['b']);
    expect(response.missing).toBe(2);
    expect(response.invalid).toBe(2);
    expect(verificationResponse([question], { suggestions: [] }).missing).toBe(1);
  });

  it('hashes effective Unicode content and invalidates a changed revision', async () => {
    const q = { ...question, category: 'Quiz', language: 'pl' };
    const fingerprint = questionFingerprint(q);
    expect(await contentHash(fingerprint)).toBe(
      'sha256:662c8400f84ef2f0ebb65dc01ce81e077b1426ed891f02101090b0addc4a39a8'
    );
    expect(await storeVerification(q, fingerprint, { status: 'passed' }, 'test')).toBe(true);
    expect(currentVerification(q).status).toBe('passed');
    q.explanation_correct = 'Inne wyjaśnienie.';
    expect(currentVerification(q)).toBeNull();
    expect(await storeVerification(q, fingerprint, { status: 'passed' }, 'test')).toBe(false);
  });
});

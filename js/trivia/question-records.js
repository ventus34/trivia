/** The CLI and generator hash the same ordered JSON array of effective content. */
export function questionFingerprint(q, pack = {}) {
  const text = (value) => (typeof value === 'string' ? value : '');
  return JSON.stringify([
    text(q.sourceCategory) || text(q.category) || text(pack.name),
    text(q.subcategory),
    text(q.question),
    text(q.answer),
    Array.isArray(q.options) ? q.options : [],
    text(q.explanation_correct),
    text(q.explanation_incorrect),
    text(q.language) || text(pack.language) || 'pl',
  ]);
}

export function newQuestionId() {
  return 'q_' + globalThis.crypto.randomUUID().replaceAll('-', '');
}

export async function contentHash(fingerprint) {
  const bytes = new globalThis.TextEncoder().encode(fingerprint);
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return (
    'sha256:' +
    Array.from(new Uint8Array(hash), (value) => value.toString(16).padStart(2, '0')).join('')
  );
}

export async function importQuestions(pack, filename, questions) {
  const { questions: imported, ...metadata } = pack;
  const known = new Map(questions.map((question) => [question.id, question]));
  const conflicts = new Set();
  const candidates = await Promise.all(
    imported.map(async (question) => {
      if (!question || typeof question !== 'object' || Array.isArray(question)) {
        throw new Error('Invalid question in ' + filename);
      }
      if (
        Object.hasOwn(question, 'id') &&
        (typeof question.id !== 'string' || !question.id.trim())
      ) {
        throw new Error('Invalid question ID in ' + filename);
      }
      const q = {
        ...question,
        id: question.id || newQuestionId(),
        category: pack.name,
        language: question.language || pack.language || 'pl',
        sourceCategory: question.category,
        explicitLanguage: Object.hasOwn(question, 'language'),
        sourcePack: { metadata, filename },
      };
      if (q.verification?.schema === 1 && q.verification.type === 'generator') {
        const fingerprint = questionFingerprint(q);
        if (q.verification.check_hash === (await contentHash(fingerprint))) {
          q.reviewedFingerprint = fingerprint;
        }
      }
      return q;
    })
  );
  // Another import can finish while the hashes above are being computed.
  for (const question of questions) known.set(question.id, question);
  let added = 0;
  for (const candidate of candidates) {
    const previous = known.get(candidate.id);
    if (previous) {
      if (questionFingerprint(previous) !== questionFingerprint(candidate))
        conflicts.add(candidate.id);
      continue;
    }
    known.set(candidate.id, candidate);
    questions.push(candidate);
    added++;
  }
  return { added, conflicts: [...conflicts] };
}

export function exportQuestion(question) {
  const data = { ...question };
  for (const key of [
    'sourcePack',
    'explicitLanguage',
    'sourceCategory',
    'reviewedFingerprint',
    'category',
    'language',
  ]) {
    delete data[key];
  }
  if (question.sourceCategory !== undefined) data.category = question.sourceCategory;
  if (question.explicitLanguage) data.language = question.language;
  return data;
}

export function requireExistingIds(previous, replacement) {
  const ids = new Set(replacement.questions.map((q) => q.id));
  if (previous.questions?.some((q) => q.id && !ids.has(q.id))) {
    throw new Error('Update would remove existing question IDs. Use a current export.');
  }
}

export function verificationResponse(expected, response) {
  const ids = new Set(expected.map((q) => q.id));
  const results = new Map();
  const seen = new Set();
  let invalid = 0;
  for (const result of Array.isArray(response?.results) ? response.results : []) {
    const id = result?.id;
    if (!ids.has(id) || seen.has(id)) {
      results.delete(id);
      invalid++;
      continue;
    }
    seen.add(id);
    if (
      result.status === 'passed' ||
      result.status === 'uncertain' ||
      (result.status === 'issues_found' &&
        Array.isArray(result.issues) &&
        result.issues.some((detail) => typeof detail === 'string' && detail.trim()))
    ) {
      results.set(id, result);
    }
  }
  return { results, missing: expected.length - results.size, invalid };
}

export function currentVerification(q) {
  if (q.reviewedFingerprint !== questionFingerprint(q)) return null;
  return q.verification;
}

export async function storeVerification(q, fingerprint, result, model) {
  const hash = await contentHash(fingerprint);
  if (questionFingerprint(q) !== fingerprint) return false;
  q.reviewedFingerprint = fingerprint;
  q.verification = {
    schema: 1,
    type: 'generator',
    status: result.status,
    method: 'llm_review',
    model,
    content_hash: hash,
    check_hash: hash,
    source_verified: false,
    date: new Date().toISOString(),
    ...(result.issues?.length && { issues: result.issues }),
  };
  return true;
}

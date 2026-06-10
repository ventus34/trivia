/**
 * @file utils.js
 * This file contains shared utility functions.
 */

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Make shuffleArray globally available for non-module scripts
window.shuffleArray = shuffleArray;

/**
 * A generic function to call the application's own backend API.
 * The server is now responsible for handling retries.
 * @param {string} endpoint The backend API endpoint (e.g., '/api/generate-question').
 * @param {object} payload The request body payload to send to the backend.
 * @returns {Promise<any>} The JSON response from the backend.
 */
export async function callApi(endpoint, payload) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return await response.json();
    }

    // Handle non-ok HTTP statuses (e.g., 500, 429)
    const errorText = await response.text();
    let errorBody;
    try {
      errorBody = JSON.parse(errorText);
    } catch (e) {
      errorBody = { detail: errorText || `Request failed with status ${response.status}` };
    }
    throw new ApiError(
      errorBody.detail || `Request failed with status ${response.status}`,
      response.status
    );
  } catch (error) {
    // Handle network errors or errors thrown from the block above
    console.error(`Failed to call backend endpoint ${endpoint}:`, error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

/**
 * Robustly parses a JSON string, stripping markdown wrappers and performing basic syntax healing.
 * @param {string} rawText - The raw pasted text.
 * @returns {object} The parsed JSON object.
 */
export function healAndParseJSON(rawText) {
  let clean = rawText.trim();

  // 1. Remove markdown code block markers
  clean = clean
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  // 2. Extract JSON part if surrounded by conversational text
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  // 3. Try standard JSON.parse
  try {
    return JSON.parse(clean);
  } catch (err) {
    console.warn('Standard JSON.parse failed, attempting simple healing...', err);
  }

  // 4. Try basic trailing comma healing
  let healed = clean.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  try {
    return JSON.parse(healed);
  } catch (err) {
    console.error('JSON healing failed:', err);
    const isEn = typeof window !== 'undefined' && localStorage.getItem('trivia_lang') === 'en';
    throw new Error(
      isEn
        ? 'Failed to parse text as JSON. Make sure the structure is correct.'
        : 'Nie udało się sparsować tekstu jako JSON. Upewnij się, że struktura jest poprawna.'
    );
  }
}

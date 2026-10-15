import { describe, expect, it, vi } from 'vitest';
import {
  maximizeFittingFontSize,
  paginateReadingItems,
  splitTextToPages,
} from '../js/trivia/reading-cards.js';

const countGraphemes = (text) =>
  Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)).length;
const wordSegments = (text) =>
  Array.from(new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text))
    .filter((segment) => segment.isWordLike)
    .map((segment) => segment.segment);

const fitsAtGraphemeCount = (maximum) => (text) => countGraphemes(text) <= maximum;

const reconstructItems = (pages, items) =>
  items.map((item, itemIndex) =>
    pages
      .flat()
      .filter((slot) => slot.itemIndex === itemIndex)
      .map((slot) => slot.text)
      .join('')
  );

describe('reading-card pagination', () => {
  it('preserves every source character and splits only at whole words when they fit', () => {
    const source =
      'First, a short sentence.\nDruga sekcja ma swoje słowa, łącznie z ąęł.\n\nLast words!';
    const pages = splitTextToPages(source, fitsAtGraphemeCount(18));

    expect(pages.length).toBeGreaterThan(1);
    expect(pages.join('')).toBe(source);
    expect(pages.flatMap(wordSegments)).toEqual(wordSegments(source));
  });

  it('keeps unbroken Unicode graphemes intact, even when a token must span pages', () => {
    const grapheme = '👩🏽‍🚀';
    const source = grapheme.repeat(6);
    const pages = splitTextToPages(source, fitsAtGraphemeCount(1));

    expect(pages).toEqual(Array(6).fill(grapheme));
    expect(pages.join('')).toBe(source);
  });

  it('keeps combining, skin-tone, ZWJ, and flag clusters intact without Intl.Segmenter', () => {
    const clusters = ['e\u0301', '👩🏽‍🚀', '🇵🇱', '✌️'];
    const source = clusters.join('');
    const fallbackIntl = Object.create(Intl);
    Object.defineProperty(fallbackIntl, 'Segmenter', { value: undefined });
    vi.stubGlobal('Intl', fallbackIntl);

    try {
      const pages = splitTextToPages(source, () => false);
      expect(pages).toEqual(clusters);
      expect(pages.join('')).toBe(source);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('keeps every fragment of very long answers tied to its original action', () => {
    const options = [
      { id: 'a', text: 'A. ' + 'a'.repeat(997), kind: 'action', onChoose: () => 'a' },
      { id: 'b', text: 'B. ' + 'b'.repeat(997), kind: 'action', onChoose: () => 'b' },
      { id: 'c', text: 'C. ' + 'c'.repeat(997), kind: 'action', onChoose: () => 'c' },
      { id: 'd', text: 'D. ' + 'd'.repeat(997), kind: 'action', onChoose: () => 'd' },
    ];
    const pages = paginateReadingItems(
      options,
      (slots) => slots.reduce((total, slot) => total + countGraphemes(slot.text), 0) <= 260
    );
    const slots = pages.flat();

    expect(pages.length).toBeGreaterThan(options.length);
    expect(new Set(slots.map((slot) => slot.item.id))).toEqual(new Set(['a', 'b', 'c', 'd']));
    for (const [itemIndex, option] of options.entries()) {
      const fragments = slots.filter((slot) => slot.itemIndex === itemIndex);
      expect(fragments.length).toBeGreaterThan(1);
      expect(fragments.map((slot) => slot.text).join('')).toBe(option.text);
      expect(fragments.every((slot) => slot.item === option)).toBe(true);
      expect(fragments.every((slot) => slot.item.onChoose === option.onChoose)).toBe(true);
      expect(fragments.map((slot) => slot.chunkIndex)).toEqual(
        Array.from({ length: fragments.length }, (_, index) => index)
      );
      expect(fragments.every((slot) => slot.chunkCount === fragments.length)).toBe(true);
    }
    pages.forEach((page) => {
      const itemIndexes = page.map((slot) => slot.itemIndex);
      expect(new Set(itemIndexes).size).toBe(itemIndexes.length);
    });
  });

  it('reflows multi-section question and explanation text from full source at narrower widths', async () => {
    const explanation = { section: 'explanation', text: 'The explanation is loading.' };
    const items = [
      {
        section: 'question',
        text: 'Which statement best explains this result? ' + 'Context '.repeat(12),
      },
      {
        section: 'choices',
        text: 'A. First choice\nB. Second choice\nC. Third choice\nD. Fourth choice',
      },
      { section: 'answer', text: 'The second choice is correct.' },
      explanation,
    ];
    const initialPages = paginateReadingItems(
      items,
      (slots) => slots.reduce((total, slot) => total + countGraphemes(slot.text), 0) <= 120
    );
    await Promise.resolve();
    explanation.text = [
      'First explanation paragraph.',
      'A longer explanation with original punctuation, emoji 👩🏽‍🚀, and Unicode. '.repeat(14),
    ].join('\n\n');
    const resolvedSource = items.map((item) => item.text);
    const widePages = paginateReadingItems(
      items,
      (slots) => slots.reduce((total, slot) => total + countGraphemes(slot.text), 0) <= 120
    );
    const narrowPages = paginateReadingItems(
      items,
      (slots) => slots.reduce((total, slot) => total + countGraphemes(slot.text), 0) <= 44
    );

    expect(narrowPages.length).toBeGreaterThan(widePages.length);
    expect(initialPages.length).toBeLessThan(widePages.length);
    expect(reconstructItems(widePages, items)).toEqual(resolvedSource);
    expect(reconstructItems(narrowPages, items)).toEqual(resolvedSource);
    expect(items.map((item) => item.text)).toEqual(resolvedSource);
  });

  it('returns an explicit empty page and retains text when one grapheme cannot fit', () => {
    expect(splitTextToPages('', () => false)).toEqual(['']);

    const source = 'A👩🏽‍🚀B';
    const pages = splitTextToPages(source, () => false);
    expect(pages.join('')).toBe(source);
    expect(pages).toEqual(['A', '👩🏽‍🚀', 'B']);
  });

  it('finds the largest fitting font size to within one pixel', () => {
    const limit = 37.25;
    const fits = (size) => size <= limit;
    const size = maximizeFittingFontSize(16, 64, fits, 0.1);

    expect(fits(size)).toBe(true);
    expect(limit - size).toBeLessThanOrEqual(0.1);
    expect(fits(size + 0.1)).toBe(false);
  });

  it('clamps to the configured floor and ceiling', () => {
    expect(maximizeFittingFontSize(16, 64, () => true)).toBe(64);
    expect(maximizeFittingFontSize(16, 64, () => false)).toBe(16);
  });

  it('preserves full multi-section source across paginated layouts and resize reflow', () => {
    const items = [
      {
        section: 'question',
        text: 'Select the best explanation. ' + 'A longer question with context. '.repeat(8),
      },
      { section: 'choices', text: 'A. One\nB. Two\nC. Three\nD. Four' },
      { section: 'answer', text: 'The full answer remains available.' },
      {
        section: 'explanation',
        text: 'First paragraph.\n\n' + 'Detailed explanation with Unicode 👩🏽‍🚀. '.repeat(24),
      },
    ];
    const originalText = items.map((item) => item.text);

    const layoutForViewport = (width, height) => {
      const minFontSize = 16;
      const maxFontSize = 64;
      const fitsPageAt = (slots, fontSize) => {
        const characters = slots.reduce((total, slot) => total + countGraphemes(slot.text), 0);
        const charsPerLine = Math.max(1, width / (fontSize * 0.56));
        const lines = Math.ceil(characters / charsPerLine);
        return lines * fontSize * 1.35 <= height;
      };
      const pages = paginateReadingItems(items, (slots) => fitsPageAt(slots, minFontSize));
      const fontSizes = pages.map((page) =>
        maximizeFittingFontSize(minFontSize, maxFontSize, (size) => fitsPageAt(page, size))
      );
      return { pages, fontSizes, fitsPageAt };
    };

    const wide = layoutForViewport(760, 400);
    const narrow = layoutForViewport(260, 300);

    expect(narrow.pages.length).toBeGreaterThan(wide.pages.length);
    expect(reconstructItems(wide.pages, items)).toEqual(originalText);
    expect(reconstructItems(narrow.pages, items)).toEqual(originalText);
    expect(items.map((item) => item.text)).toEqual(originalText);
    wide.pages.forEach((page, index) => {
      expect(wide.fitsPageAt(page, wide.fontSizes[index])).toBe(true);
    });
    narrow.pages.forEach((page, index) => {
      expect(narrow.fitsPageAt(page, narrow.fontSizes[index])).toBe(true);
    });
  });

  it('settles on the same page font after repeated unchanged resize/font refreshes', () => {
    const fits = (fontSize) => fontSize <= 29.75;
    const measuredSizes = Array.from({ length: 12 }, () =>
      maximizeFittingFontSize(16, 64, fits, 0.1)
    );

    expect(new Set(measuredSizes).size).toBe(1);
    expect(fits(measuredSizes[0])).toBe(true);
    expect(fits(measuredSizes[0] + 0.1)).toBe(false);
  });
});

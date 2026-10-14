/**
 * Responsive reading cards for long question and answer content.
 *
 * A page is measured at the CSS font and width currently in use. Text is split
 * only at word boundaries, with grapheme-safe fallback for a single long token.
 * Action nodes are the original DOM nodes, so their handlers and state survive
 * pagination and reflow.
 */

import { translations } from './config.js';

const fallbackWords = (value) => value.match(/\s+|[^\s]+/gu) || [];

function segmentText(value, granularity) {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, { granularity });
    return Array.from(segmenter.segment(value), (part) => part.segment);
  }
  if (granularity === 'word') return fallbackWords(value);

  const points = Array.from(value);
  const isExtender = (point) => {
    const code = point.codePointAt(0);
    return (
      (code >= 0x0300 && code <= 0x036f) ||
      (code >= 0x0483 && code <= 0x0489) ||
      (code >= 0x0591 && code <= 0x05bd) ||
      code === 0x05bf ||
      (code >= 0x05c1 && code <= 0x05c2) ||
      (code >= 0x0610 && code <= 0x061a) ||
      (code >= 0x064b && code <= 0x065f) ||
      code === 0x0670 ||
      (code >= 0x06d6 && code <= 0x06ed) ||
      (code >= 0x0711 && code <= 0x0711) ||
      (code >= 0x0730 && code <= 0x074a) ||
      (code >= 0x07a6 && code <= 0x07b0) ||
      (code >= 0x07eb && code <= 0x07f3) ||
      (code >= 0x0816 && code <= 0x082d) ||
      (code >= 0x0859 && code <= 0x085b) ||
      (code >= 0x08d3 && code <= 0x0903) ||
      (code >= 0x093a && code <= 0x094f) ||
      (code >= 0x0951 && code <= 0x0957) ||
      (code >= 0x0962 && code <= 0x0963) ||
      (code >= 0x1ab0 && code <= 0x1aff) ||
      (code >= 0x1dc0 && code <= 0x1dff) ||
      (code >= 0x20d0 && code <= 0x20ff) ||
      (code >= 0xfe20 && code <= 0xfe2f) ||
      (code >= 0xfe00 && code <= 0xfe0f) ||
      (code >= 0xe0100 && code <= 0xe01ef) ||
      (code >= 0x1f3fb && code <= 0x1f3ff) ||
      (code >= 0xe0020 && code <= 0xe007f)
    );
  };
  const clusters = [];
  let current = '';
  let joinNext = false;
  let regionalCount = 0;
  points.forEach((point) => {
    const code = point.codePointAt(0);
    const isRegional = code >= 0x1f1e6 && code <= 0x1f1ff;
    if (!current) {
      current = point;
      regionalCount = isRegional ? 1 : 0;
    } else if (isExtender(point) || point === '\u200d' || joinNext) {
      current += point;
      joinNext = point === '\u200d';
      if (point !== '\u200d' && joinNext) joinNext = false;
    } else if (isRegional && regionalCount === 1) {
      current += point;
      regionalCount = 2;
    } else {
      clusters.push(current);
      current = point;
      regionalCount = isRegional ? 1 : 0;
      joinNext = false;
    }
  });
  if (current) clusters.push(current);
  return clusters;
}

/**
 * Split text into fitting pages without losing whitespace or grapheme clusters.
 * `fits(candidate)` must return whether that exact candidate fits one content
 * area at the current font and width. If even a single grapheme is too large,
 * it is still returned as a page and CSS may wrap it anywhere.
 *
 * @param {string} text
 * @param {(candidate: string) => boolean} fits
 * @returns {string[]}
 */
export function splitTextToPages(text, fits) {
  const source = String(text ?? '');
  if (typeof fits !== 'function') throw new TypeError('fits must be a function');
  if (!source) return [''];
  if (fits(source)) return [source];

  const pages = [];
  let current = '';
  const append = (part) => {
    if (fits(current + part)) {
      current += part;
      return;
    }
    if (current) {
      pages.push(current);
      current = '';
    }
    if (fits(part)) {
      current = part;
      return;
    }

    // A long identifier/URL can exceed the page by itself. Keep grapheme
    // clusters intact, while allowing a single oversize cluster as a fallback.
    const graphemes = segmentText(part, 'grapheme');
    let fragment = '';
    graphemes.forEach((grapheme) => {
      if (fits(fragment + grapheme)) {
        fragment += grapheme;
      } else {
        if (fragment) pages.push(fragment);
        fragment = grapheme;
        if (!fits(fragment)) {
          pages.push(fragment);
          fragment = '';
        }
      }
    });
    current = fragment;
  };

  segmentText(source, 'word').forEach(append);
  if (current || pages.length === 0) pages.push(current);
  return pages;
}

/**
 * Pack reading items into measured pages. `fitsPage(slots)` tests the exact
 * ordered slots as one rendered page; each slot carries its original item,
 * source index, and display text. Long items are split before items are packed.
 *
 * @param {Array<{text?: string, kind?: string}>} items
 * @param {(slots: Array<object>) => boolean} fitsPage
 * @returns {Array<Array<object>>}
 */
export function paginateReadingItems(items, fitsPage) {
  if (typeof fitsPage !== 'function') throw new TypeError('fitsPage must be a function');
  const pages = [];
  let page = [];

  items.forEach((item, itemIndex) => {
    const source = String(item.text ?? '');
    const wholeItemFits = fitsPage([
      { item, itemIndex, text: source, chunkIndex: 0, chunkCount: 1 },
    ]);
    const chunks =
      item.split === false || wholeItemFits
        ? [source]
        : splitTextToPages(source, (text) =>
            // Reserve room for a localized continuation label when an action
            // needs fragments. The final label can only be shorter than this.
            fitsPage([{ item, itemIndex, text, chunkIndex: 998, chunkCount: 999 }])
          );

    chunks.forEach((text, chunkIndex) => {
      const slot = { item, itemIndex, text, chunkIndex, chunkCount: chunks.length };
      if (chunks.length > 1) {
        if (page.length) {
          pages.push(page);
          page = [];
        }
        pages.push([slot]);
        return;
      }
      const candidate = [...page, slot];
      if (page.length && !fitsPage(candidate)) {
        pages.push(page);
        page = [slot];
      } else {
        page = candidate;
      }
    });
  });

  if (page.length || pages.length === 0) pages.push(page);
  return pages;
}

function cloneForMeasure(node, text, lang = 'pl', preserveId = false) {
  const clone = node?.cloneNode?.(true) || document.createElement('p');
  if (!preserveId) clone.removeAttribute?.('id');
  clone.removeAttribute?.('data-controller-initial-focus');
  clone.removeAttribute?.('hidden');
  clone.removeAttribute?.('aria-hidden');
  clone.classList?.remove('sr-only');
  if (text !== undefined) clone.textContent = text;
  const labelKey = clone.dataset?.langKey;
  if (labelKey && translations[labelKey]?.[lang]) clone.textContent = translations[labelKey][lang];
  return clone;
}

/** Creates a measured page deck around existing page and navigation elements. */
export function createReadingCardDeck({
  dialog,
  body,
  pagesElement,
  pagination,
  previousButton,
  nextButton,
  status,
  language = () => 'pl',
}) {
  if (
    !dialog ||
    !body ||
    !pagesElement ||
    !pagination ||
    !previousButton ||
    !nextButton ||
    !status
  ) {
    throw new TypeError(
      'Reading-card deck requires dialog, body, pages, pager, buttons, and status'
    );
  }

  let sourceItems = [];
  let pageData = [];
  let activePage = 0;
  let pendingInitialFocus = false;
  let preferredSectionKey = null;
  let resizeObserver;
  let languageObserver;
  let scheduleId = 0;
  let destroyed = false;
  const win = dialog.ownerDocument.defaultView;
  const doc = dialog.ownerDocument;
  const originalParents = new Map();

  const translationsFor = () => {
    const lang = language() === 'en' ? 'en' : 'pl';
    const text = (key) => translations[key]?.[lang] || '';
    return {
      text,
      lang,
      page: (index, total) =>
        text('reading_page_status').replace('{page}', index).replace('{total}', total),
      previous: text('reading_previous_page'),
      next: text('reading_next_page'),
      pagination: text('reading_pagination_label'),
      optionFragment: (option, page, total, continued) => {
        const key = continued
          ? 'reading_option_fragment_continue'
          : 'reading_option_fragment_start';
        return text(key)
          .replace('{option}', option)
          .replace('{page}', page)
          .replace('{total}', total);
      },
    };
  };

  const itemSection = (item) =>
    item.sectionKey ? translationsFor().text(item.sectionKey) : item.section || '';
  const appendSectionLabel = (parent, item) => {
    if (!item.labelNode) return;
    const label = cloneForMeasure(item.labelNode, undefined, translationsFor().lang);
    const labelKey = item.labelNode.dataset?.langKey;
    const canonicalLabel = item.labelNode.isConnected
      ? item.labelNode
      : labelKey
        ? item.node?.parentElement?.querySelector(`[data-lang-key="${labelKey}"]`)
        : null;
    if (canonicalLabel?.isConnected && canonicalLabel.closest('#answer-reading-body')) {
      const sourceStyle = win.getComputedStyle(canonicalLabel);
      label.style.fontSize = sourceStyle.fontSize;
      label.style.lineHeight = sourceStyle.lineHeight;
    }
    parent.appendChild(label);
  };

  const restoreActionNodes = () => {
    sourceItems.forEach((item) => {
      if (!item.node || item.kind === 'text') return;
      const original = originalParents.get(item.node);
      if (original?.parent) {
        if (item.kind === 'action') item.node.textContent = item.text;
        if (item.originalAriaLabel == null) item.node.removeAttribute('aria-label');
        else item.node.setAttribute('aria-label', item.originalAriaLabel);
        const before =
          original.nextSibling?.parentNode === original.parent ? original.nextSibling : null;
        original.parent.insertBefore(item.node, before);
      }
    });
  };

  const buildMeasurementPage = (slots) => {
    const measurementRoot = doc.createElement('div');
    measurementRoot.id = pagesElement.id;
    measurementRoot.className = 'reading-pages';
    measurementRoot.style.cssText = [
      'position:fixed',
      'left:-100000px',
      'top:0',
      `width:${body.clientWidth}px`,
      `height:${body.clientHeight}px`,
      'visibility:hidden',
      'pointer-events:none',
      'display:flex',
      'flex-direction:column',
      'box-sizing:border-box',
    ].join(';');
    const measurement = doc.createElement('div');
    measurement.className = 'reading-page';
    measurement.style.cssText = [
      'width:100%',
      'flex:1 1 auto',
      'min-height:0',
      'box-sizing:border-box',
      `font:${win.getComputedStyle(body).font}`,
      `line-height:${win.getComputedStyle(body).lineHeight}`,
    ].join(';');
    slots.forEach(({ item, text, chunkIndex = 0, chunkCount = 1 }) => {
      appendSectionLabel(measurement, item);
      if (item.kind === 'action' && chunkCount > 1) {
        const continuation = doc.createElement('p');
        continuation.className = 'reading-fragment-label';
        continuation.textContent = translationsFor().optionFragment(
          item.optionLabel || '',
          chunkIndex + 1,
          chunkCount,
          chunkIndex > 0
        );
        measurement.appendChild(continuation);
      }
      const node =
        item.kind === 'node'
          ? cloneForMeasure(item.template || item.node, undefined, translationsFor().lang, true)
          : cloneForMeasure(item.template || item.node, text);
      measurement.appendChild(node);
    });
    measurementRoot.appendChild(measurement);
    doc.body.appendChild(measurementRoot);
    const fits = measurement.scrollHeight <= measurement.clientHeight + 1;
    measurementRoot.remove();
    return fits;
  };

  const renderPage = (index) => {
    const page = pagesElement.children[index];
    if (!page) return;

    const focusTarget = page.contains(doc.activeElement) ? doc.activeElement : null;
    pageData[index].forEach(({ item, text, chunkIndex, chunkCount }) => {
      appendSectionLabel(page, item);
      if (item.kind === 'action' && chunkCount > 1) {
        const continuation = doc.createElement('p');
        continuation.className = 'reading-fragment-label';
        continuation.textContent = translationsFor().optionFragment(
          item.optionLabel || '',
          chunkIndex + 1,
          chunkCount,
          chunkIndex > 0
        );
        page.appendChild(continuation);
      }
      if (item.kind === 'text') {
        page.appendChild(cloneForMeasure(item.template || item.node, text));
      } else if (item.kind === 'action') {
        item.node.textContent = text;
        item.node.setAttribute('aria-label', item.text);
        page.appendChild(item.node);
      } else {
        page.appendChild(item.node);
      }
    });

    const t = translationsFor();
    const section = itemSection(pageData[index]?.[0]?.item || {});
    page.setAttribute(
      'aria-label',
      `${section ? `${section}, ` : ''}${t.page(index + 1, pageData.length)}`
    );
    status.textContent = `${section ? `${section} · ` : ''}${t.page(index + 1, pageData.length)}`;
    pagination.setAttribute('aria-label', t.pagination);
    previousButton.disabled = index === 0;
    nextButton.disabled = index >= pageData.length - 1;
    previousButton.setAttribute('aria-label', t.previous);
    nextButton.setAttribute('aria-label', t.next);
    pagination.classList.toggle('hidden', pageData.length <= 1);
    const pageControl = page.querySelector(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)'
    );
    previousButton.removeAttribute('data-controller-initial-focus');
    nextButton.removeAttribute('data-controller-initial-focus');
    pageControl?.setAttribute('data-controller-initial-focus', '');
    if (!pageControl && !nextButton.disabled)
      nextButton.setAttribute('data-controller-initial-focus', '');

    if (focusTarget?.isConnected) focusTarget.focus?.({ preventScroll: true });
  };

  const showPage = (index) => {
    if (!pageData.length) return;
    activePage = Math.max(0, Math.min(pageData.length - 1, index));
    Array.from(pagesElement.children).forEach((page, pageIndex) => {
      const isActive = pageIndex === activePage;
      page.hidden = !isActive;
      if (isActive) page.replaceChildren();
    });
    renderPage(activePage);
  };

  const reflow = () => {
    if (destroyed || !body.clientWidth || !body.clientHeight) return false;
    const focused = doc.activeElement;
    restoreActionNodes();
    pagesElement.replaceChildren();

    const fitsPage = (slots) => buildMeasurementPage(slots);
    pageData = paginateReadingItems(sourceItems, fitsPage);
    pageData.forEach((slots, index) => {
      const page = doc.createElement('section');
      page.className = 'reading-page';
      page.setAttribute('role', 'group');
      page.hidden = index !== 0;
      pagesElement.appendChild(page);
    });
    const focusedPage =
      focused &&
      pageData.findIndex((slots) =>
        slots.some(
          ({ item }) =>
            item.kind !== 'text' && (item.node === focused || item.node.contains?.(focused))
        )
      );
    const preferredSectionPage = preferredSectionKey
      ? pageData.findIndex((slots) =>
          slots.some(({ item }) => item.sectionKey === preferredSectionKey)
        )
      : -1;
    activePage =
      preferredSectionPage >= 0
        ? preferredSectionPage
        : focusedPage >= 0
          ? focusedPage
          : Math.min(activePage, pageData.length - 1);
    preferredSectionKey = null;
    showPage(activePage);
    if (focused && pagesElement.contains(focused) && !focused.closest('[hidden]')) {
      focused.focus?.({ preventScroll: true });
    }
    return true;
  };

  const scheduleRefresh = () => {
    if (destroyed) return;
    if (scheduleId) win.cancelAnimationFrame(scheduleId);
    scheduleId = win.requestAnimationFrame(() => {
      scheduleId = 0;
      if (!body.clientWidth || !body.clientHeight) return;
      reflow();
    });
  };

  const refresh = async () => {
    if (doc.fonts?.ready) await doc.fonts.ready;
    // Wait for display/transition classes to produce their final layout.
    await new Promise((resolve) =>
      win.requestAnimationFrame(() => win.requestAnimationFrame(resolve))
    );
    const didReflow = reflow();
    if (didReflow && pendingInitialFocus) {
      pendingInitialFocus = false;
      const target =
        pagesElement.querySelector(
          '[data-controller-initial-focus], button:not(:disabled), input:not(:disabled)'
        ) || pagination.querySelector('[data-controller-initial-focus]');
      target?.focus?.({ preventScroll: true });
    }
    return didReflow;
  };

  const setItems = (items) => {
    const isInitialContent = sourceItems.length === 0;
    preferredSectionKey = pageData[activePage]?.[0]?.item.sectionKey || null;
    restoreActionNodes();
    sourceItems = items.map((item) => {
      const kind = item.kind || (item.node?.tagName === 'BUTTON' ? 'action' : 'text');
      const record = {
        ...item,
        kind,
        text: String(item.text ?? item.node?.textContent ?? ''),
        template: item.template || item.node,
        originalAriaLabel: item.node?.getAttribute?.('aria-label') ?? null,
      };
      if (record.node && kind !== 'text') {
        originalParents.set(record.node, {
          parent: record.node.parentNode,
          nextSibling: record.node.nextSibling,
        });
      }
      return record;
    });
    activePage = 0;
    pendingInitialFocus = isInitialContent;
    scheduleRefresh();
  };

  const clear = () => {
    restoreActionNodes();
    sourceItems = [];
    pageData = [];
    activePage = 0;
    pendingInitialFocus = false;
    preferredSectionKey = null;
    pagesElement.replaceChildren();
    pagination.classList.add('hidden');
    status.textContent = '';
    previousButton.disabled = true;
    nextButton.disabled = true;
    previousButton.removeAttribute('data-controller-initial-focus');
    nextButton.removeAttribute('data-controller-initial-focus');
  };

  const onPrevious = () => showPage(activePage - 1);
  const onNext = () => showPage(activePage + 1);
  previousButton.addEventListener('click', onPrevious);
  nextButton.addEventListener('click', onNext);
  win.addEventListener('resize', scheduleRefresh, { passive: true });
  if (typeof win.ResizeObserver === 'function') {
    resizeObserver = new win.ResizeObserver(scheduleRefresh);
    resizeObserver.observe(dialog);
  }
  if (typeof win.MutationObserver === 'function') {
    languageObserver = new win.MutationObserver(scheduleRefresh);
    languageObserver.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
  }
  doc.fonts?.addEventListener?.('loadingdone', scheduleRefresh);

  return {
    setItems,
    refresh,
    showPage,
    clear,
    getPageCount: () => pageData.length,
    getCurrentPage: () => activePage,
    destroy() {
      destroyed = true;
      if (scheduleId) win.cancelAnimationFrame(scheduleId);
      resizeObserver?.disconnect();
      languageObserver?.disconnect();
      win.removeEventListener('resize', scheduleRefresh);
      doc.fonts?.removeEventListener?.('loadingdone', scheduleRefresh);
      previousButton.removeEventListener('click', onPrevious);
      nextButton.removeEventListener('click', onNext);
      clear();
    },
  };
}

let questionDeck;
let answerDeck;

/** Initializes the question and verification decks once the document is ready. */
export function setupReadingCards({ language = () => 'pl', document: doc = document } = {}) {
  questionDeck?.destroy();
  answerDeck?.destroy();

  const createDeck = (prefix, dialog, body, pages) => {
    const pagination = doc.getElementById(`${prefix}-reading-pagination`);
    const previousButton = pagination?.querySelector('[data-reading-prev]');
    const nextButton = pagination?.querySelector('[data-reading-next]');
    const status = pagination?.querySelector('[data-reading-status]');
    if (!dialog || !body || !pages || !pagination || !previousButton || !nextButton || !status) {
      return null;
    }
    return createReadingCardDeck({
      dialog,
      body,
      pagesElement: pages,
      pagination,
      previousButton,
      nextButton,
      status,
      language,
    });
  };

  questionDeck = createDeck(
    'question',
    doc.getElementById('modal-content'),
    doc.getElementById('question-content'),
    doc.getElementById('question-reading-pages')
  );
  answerDeck = createDeck(
    'answer',
    doc.getElementById('answer-popup'),
    doc.getElementById('answer-reading-body'),
    doc.getElementById('answer-reading-pages')
  );
  return { questionDeck, answerDeck };
}

// Alias kept explicit for callers that name setup by its initialization role.
export const initReadingCards = setupReadingCards;

export function setQuestionReadingItems(items) {
  questionDeck?.setItems(items);
}

export function refreshQuestionReadingCards() {
  return questionDeck?.refresh();
}

export function clearQuestionReadingCards() {
  questionDeck?.clear();
}

export function setAnswerReadingItems(items) {
  answerDeck?.setItems(items);
}

export function refreshAnswerReadingCards() {
  return answerDeck?.refresh();
}

export function clearAnswerReadingCards() {
  answerDeck?.clear();
}

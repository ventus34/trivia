/**
 * @file ui-board.js
 * Board rendering and board-related UI updates.
 */

import { CONFIG } from './config.js';
import { gameState } from './state.js';
import { UI } from './dom.js';
import { uiHandlers } from './ui-handlers.js';

let boardInteractionObserver;

function squareLabel(square) {
  const isEnglish = gameState.currentLanguage === 'en';
  const category =
    square.categoryIndex !== null && square.categoryIndex !== undefined
      ? gameState.categories[square.categoryIndex]
      : '';
  const typeLabels = isEnglish
    ? {
        [CONFIG.SQUARE_TYPES.HQ]: 'headquarters',
        [CONFIG.SQUARE_TYPES.HUB]: 'central hub',
        [CONFIG.SQUARE_TYPES.ROLL_AGAIN]: 'roll again square',
      }
    : {
        [CONFIG.SQUARE_TYPES.HQ]: 'pole główne',
        [CONFIG.SQUARE_TYPES.HUB]: 'centrum planszy',
        [CONFIG.SQUARE_TYPES.ROLL_AGAIN]: 'pole rzuć ponownie',
      };
  const squareType = typeLabels[square.type] || '';
  const details = [category, squareType].filter(Boolean).join(', ');
  const selected = gameState.isAwaitingMove && document.getElementById(`square-${square.id}`)?.classList.contains('highlighted-move');

  if (isEnglish) {
    return `Square ${square.id}${details ? `, ${details}` : ''}. ${selected ? 'Available move.' : 'Roll the die to show available moves.'}`;
  }
  return `Pole ${square.id}${details ? `, ${details}` : ''}. ${selected ? 'Możliwy ruch.' : 'Rzuć kostką, aby zobaczyć możliwe ruchy.'}`;
}

function syncBoardSquareControls() {
  gameState.board?.forEach((square) => {
    const squareEl = document.getElementById(`square-${square.id}`);
    if (!squareEl) return;

    const isAvailable =
      gameState.isAwaitingMove && squareEl.classList.contains('highlighted-move');
    squareEl.tabIndex = isAvailable ? 0 : -1;
    squareEl.setAttribute('aria-disabled', String(!isAvailable));
    squareEl.setAttribute('aria-label', squareLabel(square));
    squareEl.toggleAttribute('data-controller-focus', isAvailable);
  });
}

/**
 * Renders the game board squares and their connections as an SVG overlay.
 */
export function renderBoard() {
  boardInteractionObserver?.disconnect();
  UI.boardElement.innerHTML = '';
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'board-connections');
  UI.boardWrapper.insertBefore(svg, UI.boardElement);

  const drawnConnections = new Set();

  gameState.board.forEach((square) => {
    const squareEl = document.createElement('button');
    squareEl.type = 'button';
    squareEl.className = 'board-square';
    squareEl.id = `square-${square.id}`;
    squareEl.tabIndex = -1;
    squareEl.setAttribute('aria-disabled', 'true');
    squareEl.setAttribute('aria-label', squareLabel(square));
    squareEl.setAttribute('data-board-square', '');
    squareEl.style.left = `calc(${square.pos.x}% - 3%)`;
    squareEl.style.top = `calc(${square.pos.y}% - 3%)`;

    const categoryColor =
      square.categoryIndex !== null ? CONFIG.CATEGORY_COLORS[square.categoryIndex] : '#f3f4f6';
    squareEl.style.backgroundColor = categoryColor;

    if (square.type === CONFIG.SQUARE_TYPES.HQ) {
      squareEl.style.transform = 'scale(1.4)';
      squareEl.style.borderRadius = '50%';
    }
    if (square.type === CONFIG.SQUARE_TYPES.ROLL_AGAIN) {
      squareEl.innerHTML = `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M16 8h.01"></path><path d="M12 12h.01"></path><path d="M8 16h.01"></path></svg>`;
    }
    if (square.type === CONFIG.SQUARE_TYPES.HUB) {
      squareEl.style.transform = 'scale(1.2)';
      squareEl.style.background = 'radial-gradient(circle, #fff, #d1d5db)';
    }

    squareEl.addEventListener('click', () => {
      if (typeof uiHandlers.handleSquareClick === 'function') {
        uiHandlers.handleSquareClick(square.id);
      }
    });
    UI.boardElement.appendChild(squareEl);

    square.connections.forEach((connId) => {
      const key1 = `${square.id}-${connId}`;
      const key2 = `${connId}-${square.id}`;
      if (!drawnConnections.has(key1) && !drawnConnections.has(key2)) {
        const neighbor = gameState.board.find((s) => s.id === connId);
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', `${square.pos.x}%`);
        line.setAttribute('y1', `${square.pos.y}%`);
        line.setAttribute('x2', `${neighbor.pos.x}%`);
        line.setAttribute('y2', `${neighbor.pos.y}%`);
        svg.appendChild(line);
        drawnConnections.add(key1);
      }
    });
  });

  syncBoardSquareControls();
  const MutationObserverConstructor = window.MutationObserver;
  if (MutationObserverConstructor) {
    boardInteractionObserver = new MutationObserverConstructor(syncBoardSquareControls);
    boardInteractionObserver.observe(UI.boardElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  }
}

/**
 * Renders the legend showing category names and their corresponding colors.
 */
export function renderCategoryLegend() {
  UI.categoryLegend.innerHTML = '';
  gameState.categories.forEach((cat, i) => {
    const legendItem = document.createElement('div');
    legendItem.className = 'flex items-center gap-2 category-legend-item';
    legendItem.id = `legend-cat-${i}`;
    const swatch = document.createElement('span');
    swatch.className = 'w-4 h-4 rounded-full';
    swatch.style.backgroundColor = CONFIG.CATEGORY_COLORS[i];
    swatch.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = cat;
    legendItem.append(swatch, label);
    UI.categoryLegend.appendChild(legendItem);
  });
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Highlights categories in the legend that correspond to the destination squares,
 * and dims the rest.
 * @param {string[]} destinationIds - Array of square IDs the player can move to.
 */
export function highlightAvailableCategories(destinationIds) {
  const availableIndices = new Set();
  let hasHub = false;

  destinationIds.forEach((id) => {
    const square = gameState.board.find((s) => s.id === parseInt(id));
    if (square) {
      if (square.type === CONFIG.SQUARE_TYPES.HUB) {
        hasHub = true;
      } else if (square.categoryIndex !== null && square.categoryIndex !== undefined) {
        availableIndices.add(square.categoryIndex);
      }
    }
  });

  const allIndices = [0, 1, 2, 3, 4, 5];
  const activeSet = hasHub ? new Set(allIndices) : availableIndices;

  if (activeSet.size === 0) {
    resetCategoryLegendHighlights();
    return;
  }

  allIndices.forEach((i) => {
    const el = document.getElementById(`legend-cat-${i}`);
    if (el) {
      if (activeSet.has(i)) {
        el.classList.remove('dimmed');
        el.classList.add('active-highlight');

        const color = CONFIG.CATEGORY_COLORS[i];
        el.style.setProperty('--legend-highlight-color', color);
        el.style.setProperty('--legend-highlight-glow', hexToRgba(color, 0.35));
        el.style.setProperty('--legend-highlight-bg', hexToRgba(color, 0.12));
      } else {
        el.classList.remove('active-highlight');
        el.classList.add('dimmed');
        el.style.removeProperty('--legend-highlight-color');
        el.style.removeProperty('--legend-highlight-glow');
        el.style.removeProperty('--legend-highlight-bg');
      }
    }
  });
}

/**
 * Resets the category legend items to their normal state (no highlights, no dimming).
 */
export function resetCategoryLegendHighlights() {
  const allIndices = [0, 1, 2, 3, 4, 5];
  allIndices.forEach((i) => {
    const el = document.getElementById(`legend-cat-${i}`);
    if (el) {
      el.classList.remove('dimmed', 'active-highlight');
      el.style.removeProperty('--legend-highlight-color');
      el.style.removeProperty('--legend-highlight-glow');
      el.style.removeProperty('--legend-highlight-bg');
    }
  });
}

/**
 * Renders player tokens on their current board positions.
 */
function getTokenStackOffsets(count) {
  if (count === 1) return [{ x: 0, y: 0 }];
  if (count === 2) return [{ x: -1.6, y: 0 }, { x: 1.6, y: 0 }];
  if (count === 3) {
    return [
      { x: 0, y: -1.5 },
      { x: -1.35, y: 1 },
      { x: 1.35, y: 1 },
    ];
  }
  if (count === 4) {
    return [
      { x: -1.25, y: -1.25 },
      { x: 1.25, y: -1.25 },
      { x: -1.25, y: 1.25 },
      { x: 1.25, y: 1.25 },
    ];
  }

  const columns = Math.min(4, Math.ceil(Math.sqrt(count * 1.2)));
  const rows = Math.ceil(count / columns);
  const columnStep = count <= 6 ? 2.5 : 2.15;
  const rowStep = count <= 6 ? 2.5 : 2.2;

  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / columns);
    const rowStart = row * columns;
    const itemsInRow = Math.min(columns, count - rowStart);
    const column = index - rowStart;
    return {
      x: (column - (itemsInRow - 1) / 2) * columnStep,
      y: (row - (rows - 1) / 2) * rowStep,
    };
  });
}

function applyPlayerTokenLayout(playerPositions) {
  const tokensBySquare = new Map();
  playerPositions.forEach((squareId, playerIndex) => {
    const square = gameState.board.find((item) => item.id === squareId);
    if (!square || !document.getElementById(`token-${playerIndex}`)) return;

    if (!tokensBySquare.has(squareId)) tokensBySquare.set(squareId, []);
    tokensBySquare.get(squareId).push(playerIndex);
  });

  tokensBySquare.forEach((playerIndexes, squareId) => {
    const square = gameState.board.find((item) => item.id === squareId);
    const offsets = getTokenStackOffsets(playerIndexes.length);
    playerIndexes.forEach((playerIndex, stackIndex) => {
      const tokenEl = document.getElementById(`token-${playerIndex}`);
      const offset = offsets[stackIndex];
      tokenEl.style.left = `${square.pos.x - 1.75 + offset.x}%`;
      tokenEl.style.top = `${square.pos.y - 1.75 + offset.y}%`;
    });
  });
}

export function renderPlayerTokens() {
  document.querySelectorAll('.player-token').forEach((token) => token.remove());
  gameState.players.forEach((player, playerIndex) => {
    const tokenEl = document.createElement('div');
    tokenEl.className = 'player-token';
    tokenEl.id = `token-${playerIndex}`;
    tokenEl.setAttribute('aria-hidden', 'true');
    tokenEl.textContent = player.emoji;
    UI.boardElement.appendChild(tokenEl);
  });
  applyPlayerTokenLayout(gameState.players.map((player) => player.position));
}

/**
 * Updates the entire game UI, including the current player display, scores, and tokens.
 */
export function updateUI() {
  if (
    !gameState.players ||
    gameState.players.length === 0 ||
    !gameState.board ||
    gameState.board.length === 0
  ) {
    return;
  }

  renderCategoryLegend();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (!currentPlayer) {
    return;
  }
  const isEnglish = gameState.currentLanguage === 'en';
  UI.boardElement.setAttribute(
    'aria-label',
    isEnglish ? 'Trivia board. Choose a highlighted square after rolling.' : 'Plansza Trivia. Po rzucie wybierz podświetlone pole.'
  );
  UI.diceElement.setAttribute(
    'aria-label',
    isEnglish ? 'Roll the die to move your token' : 'Rzuć kostką, aby przesunąć pionek'
  );
  UI.currentPlayerEmojiSpan.textContent = currentPlayer.emoji;
  UI.currentPlayerNameDiv.textContent = currentPlayer.name;
  UI.currentPlayerNameDiv.style.color = currentPlayer.color;
  syncBoardSquareControls();
  UI.playerScoresContainer.setAttribute('role', 'list');
  UI.playerScoresContainer.setAttribute(
    'aria-label',
    isEnglish ? 'Player scores and collected categories' : 'Wyniki graczy i zdobyte kategorie'
  );
  UI.playerScoresContainer.innerHTML = '';

  gameState.players.forEach((player) => {
    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'p-2 rounded-lg flex items-center justify-between';
    scoreDiv.setAttribute('role', 'listitem');
    scoreDiv.style.border = `1px solid ${player.color}`;
    const earnedCategories = gameState.categories.filter((_, index) => player.wedges.includes(index));
    const isEnglish = gameState.currentLanguage === 'en';
    const missingCategories = gameState.categories.filter((_, index) => !player.wedges.includes(index));
    const progressLabel = isEnglish
      ? `${player.name}: ${earnedCategories.length} of ${gameState.categories.length} category wedges. Earned: ${earnedCategories.join(', ') || 'none'}. Still needed: ${missingCategories.join(', ') || 'none'}.`
      : `${player.name}: ${earnedCategories.length} z ${gameState.categories.length} kategorii. Zdobyte: ${earnedCategories.join(', ') || 'brak'}. Do zdobycia: ${missingCategories.join(', ') || 'brak'}.`;
    scoreDiv.setAttribute('aria-label', progressLabel);

    const playerLabel = document.createElement('p');
    playerLabel.className = 'font-semibold';
    playerLabel.style.color = player.color;
    playerLabel.textContent = `${player.emoji} ${player.name}`;
    playerLabel.setAttribute('aria-hidden', 'true');

    const wedgeList = document.createElement('div');
    wedgeList.setAttribute('aria-hidden', 'true');
    gameState.categories.forEach((cat, i) => {
      const hasWedge = player.wedges.includes(i);
      const wedge = document.createElement('span');
      wedge.className = 'category-wedge';
      wedge.style.backgroundColor = hasWedge ? CONFIG.CATEGORY_COLORS[i] : '#e5e7eb';
      wedge.title = cat;
      wedgeList.appendChild(wedge);
    });
    scoreDiv.append(playerLabel, wedgeList);
    UI.playerScoresContainer.appendChild(scoreDiv);
  });

  renderPlayerTokens();
}

/*
 * Creates a smooth dice roll animation.
 * @param {number} roll - The final dice roll result (1-6).
 */
export async function animateDiceRoll(roll) {
  // Final rotations for each face to be on top
  const rotations = {
    1: { x: 0, y: 0 },
    2: { x: -90, y: 0 },
    3: { x: 0, y: 90 },
    4: { x: 0, y: -90 },
    5: { x: 90, y: 0 },
    6: { x: 0, y: 180 },
  };

  const dice = UI.diceElement;
  const target = rotations[roll];

  // Random spin direction
  const spinDirection = Math.random() > 0.5 ? 1 : -1;

  // Add extra full rotations (2-3 spins) to make it look like a real roll
  const extraSpins = 2 + Math.floor(Math.random() * 2);
  const totalRotationY = target.y + spinDirection * extraSpins * 360;
  const totalRotationX = target.x + spinDirection * extraSpins * 360;

  // Starting position (current dice state from CSS)
  const startX = -15;
  const startY = 15;

  // Animation duration - smooth and readable
  const duration = 1200;

  // Disable CSS transitions
  dice.style.transition = 'none';

  const startTime = performance.now();

  return new Promise((resolve) => {
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing - starts fast, slows down naturally
      const eased = easeOutCubic(progress);

      // Calculate current rotation
      const currentX = startX + (totalRotationX - startX) * eased;
      const currentY = startY + (totalRotationY - startY) * eased;

      // Subtle scale effect - slight grow at start, back to normal
      const scaleProgress = Math.sin(progress * Math.PI);
      const scale = 1 + 0.08 * scaleProgress * (1 - progress);

      // Subtle lift effect
      const lift = -15 * scaleProgress * (1 - progress * 0.5);

      dice.style.transform = `
                translateY(${lift}px)
                scale(${scale})
                rotateX(${currentX}deg)
                rotateY(${currentY}deg)
            `;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Snap to final position
        dice.style.transform = `rotateX(${target.x}deg) rotateY(${target.y}deg)`;
        dice.style.transition = '';
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

// Smooth easing function - cubic ease out
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates the player's token moving along a specified path.
 * @param {number[]} path - An array of square IDs representing the movement path.
 */
export async function animatePawnMovement(path) {
  const playerIndex = gameState.currentPlayerIndex;
  const playerPositions = gameState.players.map((player) => player.position);

  for (const squareId of path) {
    playerPositions[playerIndex] = squareId;
    applyPlayerTokenLayout(playerPositions);
    await new Promise((resolve) => setTimeout(resolve, CONFIG.ANIMATION_DELAY_MS));
  }
}

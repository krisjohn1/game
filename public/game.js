/* ============================================
   LUCKY STAR CASINO - GAME LOGIC
   ============================================ */

// ============ GLOBAL STATE ============
let balance = 1_000_000;
let totalWon = 0;
let jackpotAmount = 12_847_391;
let autoSpinActive = false;
let autoSpinTimer = null;

// SLOT STATE
let currentBet = 10_000;
const betOptions = [5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000];
let betIndex = 1;
let isSpinning = false;
let lastWin = 0;
let slotRtp = 25; // 25% default chance to get a winning combo

// BLACKJACK STATE
let bjBet = 0;
let playerCards = [];
let dealerCards = [];
let bjGameActive = false;

// ROULETTE STATE
let rouBetType = null;
let rouBetMult = 0;
let rouBetAmount = 0;
let rouSpinning = false;

// ROULETTE NUMBERS CONFIG
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

const SYMBOLS = ['🍒', '💎', '🔔', '⭐', '7️⃣', '🍋', '🍇', '💰', '🃏', '🌟'];
const PAYOUTS = {
  '7️⃣7️⃣7️⃣': 100, '🌟🌟🌟': 50, '💎💎💎': 25, '💰💰💰': 20,
  '⭐⭐⭐': 15, '🔔🔔🔔': 10, '🃏🃏🃏': 8, '🍒🍒🍒': 5,
  '🍇🍇🍇': 4, '🍋🍋🍋': 3
};

// ============ UTILITIES ============
function formatRupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function updateAllBalances() {
  const displays = document.querySelectorAll(
    '#nav-balance, #slot-balance, #bj-balance, #rou-balance'
  );
  displays.forEach(el => {
    if (el) el.textContent = formatRupiah(balance);
  });
}

window.syncBalance = function (amount) {
  balance = amount;
  updateAllBalances();
}

async function addBalance(amount) {
  if (window.apiTransaction) {
    const newBal = await window.apiTransaction('win', amount);
    if (newBal !== false) {
      balance = newBal;
      updateAllBalances();
    }
  } else {
    balance += amount;
    updateAllBalances();
  }
}

async function deductBalance(amount) {
  if (window.apiTransaction) {
    const newBal = await window.apiTransaction('bet', amount);
    if (newBal !== false) {
      balance = newBal;
      updateAllBalances();
      return true;
    }
    return false;
  } else {
    if (balance < amount) return false;
    balance -= amount;
    updateAllBalances();
    return true;
  }
}

// ============ PARTICLES ============
function createParticles() {
  const container = document.getElementById('particles-container');
  const colors = ['#ffd700', '#dc143c', '#9b59b6', '#3498db', '#00c851'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

// ============ NAVIGATION ============
function initNav() {
  // Navigation is now handled by actual links to different HTML files.
  // Kept empty to avoid initialization errors if called elsewhere.
}

function switchPage(page) {
  // Obsolete
}

// ============ COUNTER ANIMATION ============
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString('id-ID');
    }, 30);
  });
}

// ============ JACKPOT TICKER ============
function startJackpotTicker() {
  setInterval(() => {
    jackpotAmount += Math.floor(Math.random() * 1000 + 100);
    const formatted = formatRupiah(jackpotAmount);
    document.getElementById('jackpot-ticker').textContent = formatted;
    document.getElementById('slot-jackpot').textContent = formatted;
  }, 1500);
}

// ============ SLOT MACHINE ============
let reelPositions = [0, 0, 0];

function initSlots() {
  updateBetDisplay();

  // Create initial 49 cells
  const grid = document.getElementById('cluster-grid');
  if (grid) {
    grid.innerHTML = '';
    const initialSymbols = ['🍩', '🍬', '🍭', '🍮', '🍉', '🍇', '🍓'];
    for (let i = 0; i < 49; i++) {
      const cell = document.createElement('div');
      cell.className = 'cluster-cell';
      cell.textContent = initialSymbols[Math.floor(Math.random() * initialSymbols.length)];
      grid.appendChild(cell);
    }
  }

  document.getElementById('bet-down')?.addEventListener('click', () => {
    if (betIndex > 0) { betIndex--; currentBet = betOptions[betIndex]; updateBetDisplay(); }
  });

  document.getElementById('bet-up')?.addEventListener('click', () => {
    if (betIndex < betOptions.length - 1) { betIndex++; currentBet = betOptions[betIndex]; updateBetDisplay(); }
  });

  document.getElementById('max-bet-btn')?.addEventListener('click', () => {
    betIndex = betOptions.length - 1;
    currentBet = betOptions[betIndex];
    updateBetDisplay();
  });

  document.getElementById('spin-btn')?.addEventListener('click', spin);

  const autoBtn = document.getElementById('auto-spin-btn');
  if (autoBtn) {
    autoBtn.addEventListener('click', () => {
      autoSpinActive = !autoSpinActive;
      autoBtn.classList.toggle('active', autoSpinActive);
      if (autoSpinActive) {
        autoBtn.textContent = '⚡ STOP';
        runAutoSpin();
      } else {
        autoBtn.textContent = '⚡ AUTO';
        clearTimeout(autoSpinTimer);
      }
    });
  }
}

function updateBetDisplay() {
  const bd = document.getElementById('bet-display');
  if (bd) bd.textContent = formatRupiah(currentBet);
}

function runAutoSpin() {
  if (!autoSpinActive) return;
  if (!isSpinning) spin();
  autoSpinTimer = setTimeout(runAutoSpin, 2500);
}

async function spin() {
  if (isSpinning) return;

  // During free spins, don't check balance
  const fsBanner = document.getElementById('free-spins-banner');
  const inFreeSpinMode = fsBanner && fsBanner.style.display !== 'none';

  if (!inFreeSpinMode && balance < currentBet) {
    showFloatingText('Saldo tidak cukup!', 'red');
    return;
  }

  isSpinning = true;
  const spinBtn = document.getElementById('spin-btn');
  if (spinBtn) {
    spinBtn.disabled = true;
    spinBtn.classList.add('spinning');
  }

  // Check Fast Spin
  const fastSpinToggle = document.getElementById('fast-spin-toggle');
  const isFastSpin = fastSpinToggle ? fastSpinToggle.checked : false;

  const delayDropOut = isFastSpin ? 150 : 350;
  const delayFall = isFastSpin ? 150 : 400;
  const delayHighlight = isFastSpin ? 150 : 400;
  const delayScatter = isFastSpin ? 300 : 800;
  const delayScatterAward = isFastSpin ? 1000 : 2000;

  // Drop all current symbols down before new spin
  const cells = document.querySelectorAll('.cluster-cell');
  cells.forEach(c => {
    c.classList.remove('win-highlight', 'falling', 'sliding-down', 'scatter-highlight');
    c.classList.add('dropping-out');
  });
  await new Promise(r => setTimeout(r, delayDropOut));

  // CALL SERVER API
  let sequence = [];
  let totalMultiplier = 0;
  let totalWinAmount = 0;
  let newBalance = balance;
  let freeSpinsAwarded = 0;
  let freeSpinsRemaining = 0;
  let scatterCount = 0;
  let wasFreeSpin = false;

  let finalFsTotalWin = 0;
  let freeSpinsFinished = false;

  try {
    const res = await window.apiCall('/game/slot/spin', 'POST', { betAmount: currentBet });
    sequence = res.sequence || [];
    totalMultiplier = res.totalMultiplier || 0;
    totalWinAmount = res.totalWinAmount || 0;
    newBalance = res.newBalance;
    freeSpinsAwarded = res.freeSpinsAwarded || 0;
    freeSpinsRemaining = res.freeSpinsRemaining || 0;
    scatterCount = res.scatterCount || 0;
    wasFreeSpin = res.isFreeSpin || false;
    freeSpinsFinished = res.freeSpinsFinished || false;
    finalFsTotalWin = res.finalFsTotalWin || 0;
    window.syncBalance(newBalance);
  } catch (e) {
    showFloatingText(e.message, 'red');
    isSpinning = false;
    if (spinBtn) {
      spinBtn.disabled = false;
      spinBtn.classList.remove('spinning');
    }
    cells.forEach(c => {
      c.classList.remove('dropping-out');
      c.classList.add('falling');
    });
    return;
  }

  // Play sequence of tumbles
  let prevClusterIndices = new Set();

  for (let step = 0; step < sequence.length; step++) {
    const { grid, clusters, spotMultipliers, winAmount, scatterIndices } = sequence[step];

    cells.forEach((c, i) => {
      c.classList.remove('falling', 'dropping-out', 'sliding-down', 'win-highlight', 'scatter-highlight');
      c.style.transform = '';

      let multEl = c.querySelector('.spot-multiplier');
      if (spotMultipliers[i] > 1) {
        if (!multEl) {
          multEl = document.createElement('div');
          multEl.className = 'spot-multiplier';
          c.appendChild(multEl);
        }
        multEl.textContent = 'x' + spotMultipliers[i];
      } else if (multEl) {
        multEl.remove();
      }

      const textNode = Array.from(c.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      const oldSymbol = textNode ? textNode.nodeValue : '';

      if (textNode) {
        textNode.nodeValue = grid[i];
      } else {
        c.insertBefore(document.createTextNode(grid[i]), c.firstChild);
      }

      if (oldSymbol !== grid[i] || prevClusterIndices.has(i)) {
        void c.offsetWidth;
        c.classList.add('falling');
      }
    });

    await new Promise(r => setTimeout(r, delayFall));

    // Highlight scatter symbols on first step
    if (step === 0 && scatterIndices && scatterIndices.length >= 3) {
      scatterIndices.forEach(idx => {
        if (cells[idx]) cells[idx].classList.add('scatter-highlight');
      });
      await new Promise(r => setTimeout(r, delayScatter));

      // Show scatter award popup
      showScatterAward(freeSpinsAwarded);
      await new Promise(r => setTimeout(r, delayScatterAward));

      scatterIndices.forEach(idx => {
        if (cells[idx]) cells[idx].classList.remove('scatter-highlight');
      });
    }

    if (clusters && clusters.length > 0) {
      clusters.forEach(c => {
        c.indices.forEach(idx => {
          if (cells[idx]) cells[idx].classList.add('win-highlight');
        });
      });

      const lw = document.getElementById('last-win');
      if (lw) lw.textContent = formatRupiah(winAmount);

      await new Promise(r => setTimeout(r, delayHighlight));

      clusters.forEach(c => {
        c.indices.forEach(idx => {
          if (cells[idx]) {
            cells[idx].classList.remove('win-highlight');
            cells[idx].classList.add('dropping-out');
          }
        });
      });

      prevClusterIndices = new Set();
      clusters.forEach(c => c.indices.forEach(idx => prevClusterIndices.add(idx)));

      await new Promise(r => setTimeout(r, delayDropOut));
    } else {
      prevClusterIndices = new Set();
    }
  }

  // Show final result
  if (totalMultiplier > 0) {
    lastWin = totalWinAmount;
    totalWon += totalWinAmount;

    const lw = document.getElementById('last-win');
    if (lw) lw.textContent = formatRupiah(totalWinAmount);

    showFloatingText(`+${formatRupiah(totalWinAmount)}`, 'green');

    if (totalMultiplier >= 10 && !wasFreeSpin) {
      showWinNotification('💎 BIG WIN!', totalWinAmount);
    } else if (!wasFreeSpin) {
      showWinNotification('🎉 MENANG!', totalWinAmount);
    }
  } else {
    const lw = document.getElementById('last-win');
    if (lw) lw.textContent = 'Rp 0';
    if (!wasFreeSpin) showFloatingText(`-${formatRupiah(currentBet)}`, 'red');
  }

  // Show Free Spins total win popup if just finished
  if (freeSpinsFinished) {
    await new Promise(r => setTimeout(r, 500));

    await new Promise(resolve => {
      const overlay = document.getElementById('fs-win-overlay');
      const prizeEl = document.getElementById('fs-win-prize');
      const closeBtn = document.getElementById('fs-win-close');

      if (overlay && prizeEl && closeBtn) {
        prizeEl.textContent = formatRupiah(finalFsTotalWin);
        overlay.classList.add('show');

        const handleClose = () => {
          overlay.classList.remove('show');
          closeBtn.removeEventListener('click', handleClose);
          setTimeout(resolve, 300);
        };
        closeBtn.addEventListener('click', handleClose);
      } else {
        resolve();
      }
    });
  }

  // Update free spins UI
  updateFreeSpinsUI(freeSpinsRemaining);

  isSpinning = false;
  if (spinBtn) {
    spinBtn.disabled = false;
    spinBtn.classList.remove('spinning');
  }

  // Auto-spin if in free spins mode
  if (freeSpinsRemaining > 0) {
    setTimeout(() => spin(), 1200);
  }
}

function showScatterAward(count) {
  const el = document.getElementById('scatter-award');
  const countEl = document.getElementById('sa-count');
  if (el && countEl) {
    countEl.textContent = count;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1800);
  }
}

function updateFreeSpinsUI(remaining) {
  const banner = document.getElementById('free-spins-banner');
  const counter = document.getElementById('fs-counter');
  const slotArea = document.getElementById('candy-slot-area');

  if (remaining > 0) {
    if (banner) { banner.style.display = 'block'; }
    if (counter) { counter.textContent = remaining; }
    if (slotArea) { slotArea.classList.add('free-spin-mode'); }
  } else {
    if (banner) { banner.style.display = 'none'; }
    if (slotArea) { slotArea.classList.remove('free-spin-mode'); }
  }
}

function showWinNotification(title, amount) {
  const notif = document.getElementById('win-notification');
  document.getElementById('win-title').textContent = title;
  document.getElementById('win-amount').textContent = formatRupiah(amount);
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 2000);
}

// ============ JACKPOT CELEBRATION ============
function showJackpot(amount) {
  const overlay = document.getElementById('jackpot-overlay');
  document.getElementById('jackpot-prize').textContent = formatRupiah(amount);
  overlay.classList.add('show');
  createConfetti();
}

function createConfetti() {
  const container = document.getElementById('confetti');
  container.innerHTML = '';
  const colors = ['#ffd700', '#dc143c', '#00c851', '#1e90ff', '#ff69b4', '#ffffff'];
  for (let i = 0; i < 150; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${Math.random() * 12 + 6}px;
      height: ${Math.random() * 12 + 6}px;
      animation-duration: ${Math.random() * 3 + 2}s;
      animation-delay: ${Math.random() * 2}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `;
    container.appendChild(c);
  }
}

function initJackpot() {
  document.getElementById('jackpot-close').addEventListener('click', () => {
    document.getElementById('jackpot-overlay').classList.remove('show');
  });
}

// ============ BLACKJACK ============
const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const CARD_SUITS = ['♠', '♥', '♦', '♣'];

function cardValue(rank) {
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  if (rank === 'A') return 11;
  return parseInt(rank);
}

function handValue(cards) {
  let val = 0;
  let aces = 0;
  cards.forEach(c => {
    if (c.hidden) return;
    val += cardValue(c.rank);
    if (c.rank === 'A') aces++;
  });
  while (val > 21 && aces > 0) { val -= 10; aces--; }
  return val;
}

function randomCard() {
  return {
    rank: CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)],
    suit: CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)]
  };
}

function renderCard(card, area) {
  const el = document.createElement('div');
  const isRed = ['♥', '♦'].includes(card.suit);
  el.className = `playing-card ${card.hidden ? 'card-back' : (isRed ? 'card-red' : 'card-black')}`;
  if (!card.hidden) {
    el.innerHTML = `<span class="card-rank">${card.rank}</span><span class="card-suit">${card.suit}</span>`;
  }
  document.getElementById(area).appendChild(el);
}

function renderAllCards() {
  document.getElementById('dealer-cards').innerHTML = '';
  document.getElementById('player-cards').innerHTML = '';
  dealerCards.forEach(c => renderCard(c, 'dealer-cards'));
  playerCards.forEach(c => renderCard(c, 'player-cards'));
  document.getElementById('player-score').textContent = handValue(playerCards);
  const dv = handValue(dealerCards.filter(c => !c.hidden));
  document.getElementById('dealer-score').textContent = bjGameActive ? `${dv}+` : handValue(dealerCards);
}

function initBlackjack() {
  document.querySelectorAll('#blackjack-section .chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.value);
      if (!bjGameActive) {
        bjBet += val;
        document.getElementById('bj-bet-display').textContent = formatRupiah(bjBet);
      }
    });
  });

  document.getElementById('bj-deal').addEventListener('click', dealBlackjack);
  document.getElementById('bj-hit').addEventListener('click', bjHit);
  document.getElementById('bj-stand').addEventListener('click', bjStand);
  document.getElementById('bj-double').addEventListener('click', bjDouble);
  document.getElementById('bj-clear').addEventListener('click', () => {
    if (!bjGameActive) { bjBet = 0; document.getElementById('bj-bet-display').textContent = 'Rp 0'; }
  });
}

async function dealBlackjack() {
  if (bjBet <= 0) { showFloatingText('Pasang taruhan dulu!', 'red'); return; }
  if (!(await deductBalance(bjBet))) { showFloatingText('Saldo tidak cukup!', 'red'); return; }

  bjGameActive = true;
  playerCards = [randomCard(), randomCard()];
  dealerCards = [randomCard(), { ...randomCard(), hidden: true }];

  renderAllCards();
  updateBJStatus('Pilih aksi Anda!');
  setBJButtons(true);

  if (handValue(playerCards) === 21) {
    bjStand();
  }
}

async function bjHit() {
  playerCards.push(randomCard());
  renderAllCards();
  const val = handValue(playerCards);
  if (val > 21) {
    await endBlackjack('bust');
  } else if (val === 21) {
    await bjStand();
  }
}

async function bjStand() {
  // Reveal dealer card
  dealerCards.forEach(c => c.hidden = false);
  // Dealer draws to 17
  while (handValue(dealerCards) < 17) {
    dealerCards.push(randomCard());
  }
  renderAllCards();

  const pv = handValue(playerCards);
  const dv = handValue(dealerCards);

  if (dv > 21 || pv > dv) await endBlackjack('win');
  else if (pv === dv) await endBlackjack('push');
  else await endBlackjack('lose');
}

async function bjDouble() {
  if (!(await deductBalance(bjBet))) { showFloatingText('Saldo tidak cukup!', 'red'); return; }
  bjBet *= 2;
  document.getElementById('bj-bet-display').textContent = formatRupiah(bjBet);
  await bjHit();
  if (handValue(playerCards) <= 21) await bjStand();
}

async function endBlackjack(result) {
  bjGameActive = false;
  setBJButtons(false);

  let payout = 0;
  let statusMsg = '';

  if (result === 'win') {
    payout = bjBet * 2;
    statusMsg = '🎉 ANDA MENANG!';
    await addBalance(payout);
    totalWon += bjBet;
    document.getElementById('bj-win').textContent = formatRupiah(bjBet);
    showFloatingText(`+${formatRupiah(bjBet)}`, 'green');
  } else if (result === 'bust') {
    statusMsg = '💥 BUST! Anda kalah!';
    showFloatingText(`-${formatRupiah(bjBet)}`, 'red');
  } else if (result === 'push') {
    await addBalance(bjBet);
    statusMsg = '🤝 SERI!';
    showFloatingText('Seri!', 'gold');
  } else {
    statusMsg = '😞 Dealer menang!';
    showFloatingText(`-${formatRupiah(bjBet)}`, 'red');
  }

  updateBJStatus(statusMsg);
  bjBet = 0;
  document.getElementById('bj-bet-display').textContent = 'Rp 0';
}

function updateBJStatus(msg) {
  document.getElementById('bj-status').textContent = msg;
}

function setBJButtons(active) {
  document.getElementById('bj-hit').disabled = !active;
  document.getElementById('bj-stand').disabled = !active;
  document.getElementById('bj-double').disabled = !active;
  document.getElementById('bj-deal').disabled = active;
}

// ============ ROULETTE ============
let rouletteAngle = 0;
let wheelCanvas, wheelCtx;

const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

function initRouletteWheel() {
  if (wheelCanvas) return;
  wheelCanvas = document.getElementById('wheel-canvas');
  wheelCtx = wheelCanvas.getContext('2d');
  drawWheel(0);
  initRouletteNumbers();
  initRouletteBetting();
}

function drawWheel(rotation) {
  const ctx = wheelCtx;
  const canvas = wheelCanvas;
  const size = canvas.width;
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 4;

  ctx.clearRect(0, 0, size, size);

  const numSlices = ROULETTE_NUMBERS.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  ROULETTE_NUMBERS.forEach((num, i) => {
    const startAngle = rotation + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();

    if (num === 0) ctx.fillStyle = '#006400';
    else if (RED_NUMBERS.includes(num)) ctx.fillStyle = '#8b0000';
    else ctx.fillStyle = '#1a1a1a';

    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Number label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.translate(r * 0.72, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size < 350 ? 9 : 11}px Orbitron, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(num.toString(), 0, 0);
    ctx.restore();
  });

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0a1e';
  ctx.fill();
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center star
  ctx.fillStyle = '#ffd700';
  ctx.font = '18px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⭐', cx, cy);
}

function initRouletteNumbers() {
  const grid = document.getElementById('numbers-grid');
  if (!grid || grid.children.length > 0) return;

  for (let n = 1; n <= 36; n++) {
    const btn = document.createElement('button');
    btn.className = `num-btn ${RED_NUMBERS.includes(n) ? 'red-num' : 'black-num'}`;
    btn.dataset.bet = `number-${n}`;
    btn.dataset.mult = '36';
    btn.textContent = n;
    btn.addEventListener('click', () => {
      selectRouletteBet(`number-${n}`, 36, `Nomor ${n}`);
      document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    grid.appendChild(btn);
  }
}

function initRouletteBetting() {
  document.querySelectorAll('.roulette-bet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const betLabels = {
        red: 'Merah', black: 'Hitam', odd: 'Ganjil', even: 'Genap',
        low: '1-18', high: '19-36', dozen1: '1st 12', dozen2: '2nd 12', dozen3: '3rd 12'
      };
      selectRouletteBet(btn.dataset.bet, parseInt(btn.dataset.mult), betLabels[btn.dataset.bet]);
      document.querySelectorAll('.roulette-bet-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('selected'));
    });
  });

  document.querySelectorAll('#roulette-section .chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!rouBetType) { showFloatingText('Pilih jenis taruhan!', 'red'); return; }
      rouBetAmount += parseInt(btn.dataset.value);
      document.getElementById('rou-bet-amount').textContent = formatRupiah(rouBetAmount);
    });
  });

  document.getElementById('spin-roulette').addEventListener('click', spinRoulette);

  document.getElementById('clear-rou-bet').addEventListener('click', () => {
    rouBetType = null; rouBetMult = 0; rouBetAmount = 0;
    document.getElementById('rou-bet-type').textContent = '-';
    document.getElementById('rou-bet-amount').textContent = 'Rp 0';
    document.querySelectorAll('.roulette-bet-btn, .num-btn').forEach(b => b.classList.remove('selected'));
  });
}

function selectRouletteBet(type, mult, label) {
  rouBetType = type;
  rouBetMult = mult;
  document.getElementById('rou-bet-type').textContent = label;
}

async function spinRoulette() {
  if (rouSpinning) return;
  if (!rouBetType) { showFloatingText('Pilih jenis taruhan!', 'red'); return; }
  if (rouBetAmount <= 0) { showFloatingText('Tambahkan jumlah taruhan!', 'red'); return; }
  if (!(await deductBalance(rouBetAmount))) { showFloatingText('Saldo tidak cukup!', 'red'); return; }

  rouSpinning = true;
  const spinBtn = document.getElementById('spin-roulette');
  spinBtn.disabled = true;

  // Pick result
  const resultNum = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];

  // Find angle for that number
  const numIndex = ROULETTE_NUMBERS.indexOf(resultNum);
  const sliceAngle = (2 * Math.PI) / ROULETTE_NUMBERS.length;

  // Spin animation
  const totalRotation = Math.PI * 2 * 8; // 8 full rotations
  const targetAngle = totalRotation + (numIndex * sliceAngle);
  const duration = 4000;
  const startTime = performance.now();
  const startAngle = rouletteAngle;

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // ease out quartic
    rouletteAngle = startAngle + targetAngle * eased;
    drawWheel(rouletteAngle);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      finishRoulette(resultNum);
    }
  }

  requestAnimationFrame(animate);
}

function finishRoulette(num) {
  const isRed = RED_NUMBERS.includes(num);
  const isBlack = BLACK_NUMBERS.includes(num);
  const colorLabel = num === 0 ? 'Hijau' : isRed ? 'Merah 🔴' : 'Hitam ⚫';

  document.getElementById('result-number').textContent = num;
  document.getElementById('result-color').textContent = colorLabel;

  // Check win
  let win = false;
  const bet = rouBetType;

  if (bet === 'red' && isRed) win = true;
  else if (bet === 'black' && isBlack) win = true;
  else if (bet === 'odd' && num !== 0 && num % 2 !== 0) win = true;
  else if (bet === 'even' && num !== 0 && num % 2 === 0) win = true;
  else if (bet === 'low' && num >= 1 && num <= 18) win = true;
  else if (bet === 'high' && num >= 19 && num <= 36) win = true;
  else if (bet === 'dozen1' && num >= 1 && num <= 12) win = true;
  else if (bet === 'dozen2' && num >= 13 && num <= 24) win = true;
  else if (bet === 'dozen3' && num >= 25 && num <= 36) win = true;
  else if (bet === `number-${num}`) win = true;

  if (win) {
    const payout = rouBetAmount * rouBetMult;
    addBalance(payout); // calling the async function but we don't need to await here strictly for UI flow
    totalWon += (payout - rouBetAmount);
    document.getElementById('rou-win').textContent = formatRupiah(payout - rouBetAmount);
    showWinNotification(`🎡 NOMOR ${num}!`, payout);
    showFloatingText(`+${formatRupiah(payout - rouBetAmount)}`, 'green');
  } else {
    showFloatingText(`-${formatRupiah(rouBetAmount)}`, 'red');
    showWinNotification(`❌ NOMOR ${num}`, 0);
    document.getElementById('win-title').textContent = `Keluar: ${num} ${colorLabel}`;
    document.getElementById('win-amount').textContent = 'Tidak menang';
    document.getElementById('win-amount').style.color = '#dc143c';
  }

  rouBetAmount = 0;
  document.getElementById('rou-bet-amount').textContent = 'Rp 0';
  rouSpinning = false;
  document.getElementById('spin-roulette').disabled = false;
}

// ============ PREVIEW REELS ANIMATION ============
function initPreviewReels() {
  const reels = [
    document.getElementById('prev-reel-1'),
    document.getElementById('prev-reel-2'),
    document.getElementById('prev-reel-3')
  ];
  if (!reels[0]) return;

  setInterval(() => {
    const reel = reels[Math.floor(Math.random() * reels.length)];
    reel.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    reel.style.transform = 'scale(1.2)';
    setTimeout(() => reel.style.transform = 'scale(1)', 200);
  }, 800);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
  if (window.apiCall) {
    try {
      const set = await window.apiCall('/settings');
      if (set.slot_rtp) slotRtp = parseInt(set.slot_rtp);
    } catch (e) { }
  }

  createParticles();
  initNav();
  animateCounters();
  startJackpotTicker();
  initSlots();
  initBlackjack();
  initJackpot();
  initPreviewReels();
  updateAllBalances();

  // Initialize slot reels to mid position
  [1, 2, 3].forEach(i => {
    const strip = document.getElementById(`strip-${i}`);
    if (strip) strip.style.transform = 'translateY(-480px)';
  });
});

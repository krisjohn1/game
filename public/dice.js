document.addEventListener('DOMContentLoaded', () => {
  const betInput = document.getElementById('dice-bet');
  const chanceInput = document.getElementById('dice-chance');
  const chanceSlider = document.getElementById('chance-slider');
  const btnUnder = document.getElementById('btn-under');
  const btnOver = document.getElementById('btn-over');
  const targetUnder = document.getElementById('target-under');
  const targetOver = document.getElementById('target-over');
  const multiplierDisplay = document.getElementById('dice-multiplier');
  const payoutDisplay = document.getElementById('dice-win-payout');
  const btnRoll = document.getElementById('btn-roll');
  const resultDisplay = document.getElementById('dice-result');

  let currentCondition = 'under'; // or 'over'

  // Update UI values
  function updateCalculations() {
    let chance = parseFloat(chanceInput.value);
    if (isNaN(chance) || chance < 1) chance = 1;
    if (chance > 98) chance = 98;
    chanceInput.value = chance;
    chanceSlider.value = chance;

    const multiplier = 99 / chance;
    multiplierDisplay.textContent = multiplier.toFixed(4) + 'x';

    let bet = parseInt(betInput.value, 10);
    if (isNaN(bet) || bet < 0) bet = 0;
    const payout = Math.floor(bet * multiplier);
    payoutDisplay.textContent = window.formatRupiah(payout);

    targetUnder.textContent = chance.toFixed(2);
    targetOver.textContent = (100 - chance).toFixed(2);
  }

  betInput.addEventListener('input', updateCalculations);
  
  chanceInput.addEventListener('input', () => {
    chanceSlider.value = chanceInput.value;
    updateCalculations();
  });

  chanceSlider.addEventListener('input', () => {
    chanceInput.value = chanceSlider.value;
    updateCalculations();
  });

  btnUnder.addEventListener('click', () => {
    currentCondition = 'under';
    btnUnder.classList.add('active');
    btnOver.classList.remove('active');
  });

  btnOver.addEventListener('click', () => {
    currentCondition = 'over';
    btnOver.classList.add('active');
    btnUnder.classList.remove('active');
  });

  // Roll Logic
  btnRoll.addEventListener('click', async () => {
    if (!window.appUser) {
      window.showFloatingText('Silakan login terlebih dahulu!', 'red');
      return;
    }

    const bet = parseInt(betInput.value, 10);
    if (bet > window.appUser.balance) {
      window.showFloatingText('Saldo tidak cukup!', 'red');
      return;
    }

    btnRoll.disabled = true;
    btnRoll.textContent = 'MENGACAK...';
    resultDisplay.classList.remove('win', 'lose');
    
    // Quick rolling animation
    let animCount = 0;
    const animInterval = setInterval(() => {
      resultDisplay.textContent = (Math.random() * 100).toFixed(2);
      animCount++;
    }, 50);

    try {
      const res = await fetch('http://localhost:3030/api/game/dice/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bet,
          chance: parseFloat(chanceInput.value),
          condition: currentCondition
        })
      });
      const data = await res.json();
      
      clearInterval(animInterval);
      
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      // Sync balance
      window.appUser.balance = data.newBalance;
      if (window.syncBalance) window.syncBalance(data.newBalance);

      // Show result
      resultDisplay.textContent = data.roll.toFixed(2);
      if (data.isWin) {
        resultDisplay.classList.add('win');
        window.showFloatingText(`MENANG ${window.formatRupiah(data.winAmount)}!`, 'green');
      } else {
        resultDisplay.classList.add('lose');
      }

    } catch (e) {
      clearInterval(animInterval);
      window.showFloatingText(e.message, 'red');
      resultDisplay.textContent = 'ERROR';
    } finally {
      btnRoll.disabled = false;
      btnRoll.textContent = '🎲 LEMPAR DADU';
    }
  });

  // Init
  updateCalculations();
});

// Balance sync for auth.js
window.syncBalance = function(balance) {
  const el = document.getElementById('nav-balance');
  if (el) el.textContent = window.formatRupiah(balance);
}

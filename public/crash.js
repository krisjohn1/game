document.addEventListener('DOMContentLoaded', () => {
  const betInput = document.getElementById('crash-bet');
  const targetInput = document.getElementById('crash-target');
  const btnPlay = document.getElementById('btn-play');
  const multiplierDisplay = document.getElementById('multiplier');
  const rocket = document.getElementById('rocket');
  const crashMsg = document.getElementById('crash-msg');

  // Utility
  window.syncBalance = function(balance) {
    const el = document.getElementById('nav-balance');
    if (el) el.textContent = window.formatRupiah(balance);
  }

  btnPlay.addEventListener('click', async () => {
    if (!window.appUser) {
      window.showFloatingText('Silakan login terlebih dahulu!', 'red');
      return;
    }

    const bet = parseInt(betInput.value, 10);
    const target = parseFloat(targetInput.value);

    if (bet > window.appUser.balance) {
      window.showFloatingText('Saldo tidak cukup!', 'red');
      return;
    }
    if (target < 1.01) {
      window.showFloatingText('Target minimum 1.01x', 'red');
      return;
    }

    // Reset UI
    btnPlay.disabled = true;
    multiplierDisplay.classList.remove('crashed', 'win');
    multiplierDisplay.textContent = '1.00x';
    multiplierDisplay.style.color = 'white';
    crashMsg.style.opacity = '0';
    rocket.style.bottom = '20px';
    rocket.style.fontSize = '3rem';
    rocket.style.transform = 'translateX(-50%) rotate(0deg)';

    try {
      const res = await fetch('http://localhost:3030/api/game/crash/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bet, targetMultiplier: target })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      // Sync balance to pre-win amount (user pays bet)
      // Actually backend returns newBalance which includes win if they won. 
      // But we don't want to show win in balance UNTIL animation finishes to keep the suspense!
      const initialBalance = window.appUser.balance - bet;
      window.appUser.balance = initialBalance;
      if (window.syncBalance) window.syncBalance(initialBalance);

      // Start Animation
      const crashPoint = data.crashPoint;
      let currentMult = 1.00;
      let startTime = performance.now();
      
      function animateMultiplier(currentTime) {
        // Calculate elapsed seconds
        let elapsed = (currentTime - startTime) / 1000;
        
        // Multiplier formula (exponential curve like real crash games)
        // m = e^(0.06 * t)
        currentMult = Math.pow(Math.E, 0.5 * elapsed);
        
        if (currentMult >= crashPoint) {
            currentMult = crashPoint;
            finishAnimation(currentMult, data);
            return;
        }

        // Check if passed target (Auto cashout success animation)
        if (currentMult >= target && !multiplierDisplay.classList.contains('win')) {
            multiplierDisplay.classList.add('win');
            window.showFloatingText('CASHOUT BERHASIL!', 'green');
        }

        multiplierDisplay.textContent = currentMult.toFixed(2) + 'x';
        
        // Visual rocket flying up
        rocket.style.bottom = (20 + (currentMult * 10)) + 'px';
        
        requestAnimationFrame(animateMultiplier);
      }
      
      requestAnimationFrame(animateMultiplier);

    } catch (e) {
      window.showFloatingText(e.message, 'red');
      btnPlay.disabled = false;
    }
  });

  function finishAnimation(finalMult, data) {
    multiplierDisplay.textContent = finalMult.toFixed(2) + 'x';
    rocket.style.fontSize = '0';
    crashMsg.style.opacity = '1';
    
    if (data.isWin) {
      // User won because crashPoint >= target
      // Already turned green during flight
      window.showFloatingText(`MENANG ${window.formatRupiah(data.winAmount)}!`, 'green');
    } else {
      multiplierDisplay.classList.add('crashed');
      rocket.style.transform = 'translateX(-50%) rotate(180deg)';
    }

    // Sync final balance
    window.appUser.balance = data.newBalance;
    if (window.syncBalance) window.syncBalance(data.newBalance);

    setTimeout(() => {
        btnPlay.disabled = false;
    }, 1500);
  }
});

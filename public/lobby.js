document.addEventListener('DOMContentLoaded', () => {
    
    // ============ PARTICLES ============
    function createParticles() {
      const container = document.getElementById('particles-container');
      if (!container) return;
      const colors = ['#ffd700', '#dc143c', '#9b59b6', '#3498db', '#00c851'];
      for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 1;
        p.style.cssText = `
          width: ${size}px; height: ${size}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: ${Math.random() * 100}%;
          animation-duration: ${Math.random() * 10 + 5}s;
          animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(p);
      }
    }
  
    // ============ COUNTER ANIMATION ============
    function animateCounters() {
      document.querySelectorAll('.counter').forEach(el => {
        const target = parseInt(el.dataset.target);
        if (isNaN(target)) return;
        let current = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { 
              current = target; 
              clearInterval(timer); 
          }
          el.textContent = Math.floor(current).toLocaleString('id-ID');
        }, 30);
      });
    }
  
    // ============ JACKPOT TICKER ============
    let jackpotAmount = 12847391;
    function startJackpotTicker() {
      setInterval(() => {
        jackpotAmount += Math.floor(Math.random() * 1000 + 100);
        const ticker = document.getElementById('jackpot-ticker');
        if (ticker) {
            ticker.textContent = window.formatRupiah ? window.formatRupiah(jackpotAmount) : 'Rp ' + jackpotAmount.toLocaleString('id-ID');
        }
      }, 1500);
    }
  
    // ============ PREVIEW REELS ANIMATION ============
    const SYMBOLS = ['🍒', '💎', '🔔', '⭐', '7️⃣', '🍋', '🍇', '💰', '🃏', '🌟'];
    function initPreviewReels() {
      const reels = [
        document.getElementById('prev-reel-1'),
        document.getElementById('prev-reel-2'),
        document.getElementById('prev-reel-3')
      ];
      if (!reels[0]) return;
  
      setInterval(() => {
        const reel = reels[Math.floor(Math.random() * reels.length)];
        if (reel) {
            reel.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            reel.style.transform = 'scale(1.2)';
            setTimeout(() => reel.style.transform = 'scale(1)', 200);
        }
      }, 800);
    }
  
    createParticles();
    animateCounters();
    startJackpotTicker();
    initPreviewReels();
  });

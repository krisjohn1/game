const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startStr = '  <!-- Slot Machine Section -->';
const endStr = '  <!-- Auth Modals -->';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Markers not found');
  process.exit(1);
}

const lobbyHtml = `
  <!-- Lobby Section -->
  <section id="lobby-section" class="page-section active" style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
    <div class="section-header" style="text-align: center; margin-bottom: 40px;">
      <h2 class="section-title" style="font-size: 2.5rem; color: white; font-family: 'Orbitron', monospace;">🎮 Pilihan Game</h2>
      <p class="section-subtitle" style="color: var(--text-secondary);">Pilih permainan favoritmu dan menangkan jutaan rupiah!</p>
    </div>
    
    <div class="games-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
      
      <!-- Slot Game Card -->
      <a href="slot.html" class="game-card" style="display: block; background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius); overflow: hidden; text-decoration: none; transition: transform 0.3s, border-color 0.3s;">
        <div class="game-card-img" style="height: 200px; background: linear-gradient(135deg, #FF6B6B, #C0392B); display: flex; align-items: center; justify-content: center; font-size: 5rem;">🎰</div>
        <div class="game-card-info" style="padding: 20px;">
          <h3 style="font-family: 'Orbitron', monospace; color: white; margin-bottom: 8px;">Candy Clusters Slot</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Game slot 7x7 dengan sistem cluster pays dan free spins berlimpah.</p>
        </div>
      </a>

      <!-- Crash Game Card -->
      <a href="crash.html" class="game-card" style="display: block; background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius); overflow: hidden; text-decoration: none; transition: transform 0.3s, border-color 0.3s;">
        <div class="game-card-img" style="height: 200px; background: linear-gradient(135deg, #1A2980, #26D0CE); display: flex; align-items: center; justify-content: center; font-size: 5rem;">🚀</div>
        <div class="game-card-info" style="padding: 20px;">
          <h3 style="font-family: 'Orbitron', monospace; color: white; margin-bottom: 8px;">Rocket Crash</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Tarik uangmu sebelum roket meledak! Perkalian tanpa batas.</p>
        </div>
      </a>

      <!-- Dice Game Card -->
      <a href="dice.html" class="game-card" style="display: block; background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius); overflow: hidden; text-decoration: none; transition: transform 0.3s, border-color 0.3s;">
        <div class="game-card-img" style="height: 200px; background: linear-gradient(135deg, #0f9b0f, #000000); display: flex; align-items: center; justify-content: center; font-size: 5rem;">🎲</div>
        <div class="game-card-info" style="padding: 20px;">
          <h3 style="font-family: 'Orbitron', monospace; color: white; margin-bottom: 8px;">Hi-Lo Dice</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Tebak dadu dengan probabilitas kemenangan yang bisa diatur sendiri.</p>
        </div>
      </a>

    </div>
  </section>
`;

const newHtml = html.substring(0, startIndex) + lobbyHtml + html.substring(endIndex);
const finalHtml = newHtml.replace('<script src="game.js"></script>', '');

fs.writeFileSync('index.html', finalHtml, 'utf8');
console.log('index.html updated successfully');

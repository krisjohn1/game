const fs = require('fs');
let html = fs.readFileSync('slot.html', 'utf8');

const startStr = '  <!-- Hero Section -->';
const endStr = '  <!-- Slot Machine Section -->';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Markers not found');
  process.exit(1);
}

const newHtml = html.substring(0, startIndex) + html.substring(endIndex);

// Also change nav links in slot.html to point back to lobby
let navFixedHtml = newHtml.replace(
  '<a href="#" class="nav-link active" data-page="home">Home</a>\n      <a href="#" class="nav-link" data-page="slots">Slots</a>\n      <a href="#" class="nav-link" data-page="blackjack">Blackjack</a>\n      <a href="#" class="nav-link" data-page="roulette">Roulette</a>',
  '<a href="index.html" class="nav-link">⬅ Kembali ke Lobby</a>'
);

fs.writeFileSync('slot.html', navFixedHtml, 'utf8');
console.log('slot.html updated successfully');

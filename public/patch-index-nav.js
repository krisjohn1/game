const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let navFixedHtml = html.replace(
  '<a href="#" class="nav-link active" data-page="home">Home</a>\n      <a href="#" class="nav-link" data-page="slots">Slots</a>\n      <a href="#" class="nav-link" data-page="blackjack">Blackjack</a>\n      <a href="#" class="nav-link" data-page="roulette">Roulette</a>',
  '<a href="index.html" class="nav-link active">Lobby Kasino</a>'
);

fs.writeFileSync('index.html', navFixedHtml, 'utf8');
console.log('index.html nav updated');

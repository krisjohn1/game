const fs = require('fs');

const slotHtml = fs.readFileSync('slot.html', 'utf8');

// Extract the full Nav and Modals from slot.html
// Nav:
const navStart = slotHtml.indexOf('<nav id="main-nav">');
const navEnd = slotHtml.indexOf('</nav>') + 6;
const fullNav = slotHtml.substring(navStart, navEnd);

// Modals (from <!-- Auth Modals --> to the end right before <script src="auth.js">)
const modalsStart = slotHtml.indexOf('<!-- Auth Modals -->');
const modalsEnd = slotHtml.indexOf('<script src="auth.js">');
let fullModals = slotHtml.substring(modalsStart, modalsEnd);

function patchFile(filename) {
    let html = fs.readFileSync(filename, 'utf8');
    
    // Replace Nav
    const nStart = html.indexOf('<nav id="main-nav">');
    const nEnd = html.indexOf('</nav>') + 6;
    if(nStart !== -1 && nEnd !== -1) {
        html = html.substring(0, nStart) + fullNav + html.substring(nEnd);
    }

    // Replace Modals
    // In crash and dice, it starts with <!-- Auth Modals (Simplified Include) --> or <!-- Auth Modals -->
    const mStart = html.indexOf('<!-- Auth Modals');
    const mEnd = html.indexOf('<script src="auth.js">');
    if(mStart !== -1 && mEnd !== -1) {
        html = html.substring(0, mStart) + fullModals + html.substring(mEnd);
    }

    // Fix the "Kembali ke Lobby" in nav if we copied from slot.html
    html = html.replace(
        '<a href="index.html" class="nav-link">⬅ Kembali ke Lobby</a>',
        '<a href="index.html" class="nav-link" style="color:var(--gold);">⬅ Lobby Kasino</a>'
    );
    // Since we copied fullNav from slot, fullNav actually has:
    // <div class="nav-links">
    //   <a href="index.html" class="nav-link">⬅ Kembali ke Lobby</a>
    // </div>
    // Which is fine for crash and dice.

    fs.writeFileSync(filename, html, 'utf8');
    console.log(filename + ' patched!');
}

patchFile('crash.html');
patchFile('dice.html');

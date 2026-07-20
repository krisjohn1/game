const fs = require('fs');

const slotHtml = fs.readFileSync('slot.html', 'utf8');

// Modals (from <!-- Auth Modals --> to the end right before <script src="auth.js">)
const modalsStart = slotHtml.indexOf('<!-- Auth Modals -->');
const modalsEnd = slotHtml.indexOf('<script src="auth.js">');
let fullModals = slotHtml.substring(modalsStart, modalsEnd);

let indexHtml = fs.readFileSync('index.html', 'utf8');
const iModalsStart = indexHtml.indexOf('<!-- Auth Modals');
const iModalsEnd = indexHtml.indexOf('<script src="auth.js">');
if(iModalsStart !== -1 && iModalsEnd !== -1) {
    indexHtml = indexHtml.substring(0, iModalsStart) + fullModals + indexHtml.substring(iModalsEnd);
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log('index.html patched with modals!');
}

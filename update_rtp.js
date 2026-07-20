const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('slot_rtp', '25')", (err) => {
    if (err) console.error(err);
    else console.log('Updated slot_rtp to 25');
    db.close();
});

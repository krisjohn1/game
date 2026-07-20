const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3030;
const SECRET_KEY = 'lucky-star-secret-key-123';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initDb();
    }
});

function initDb() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        balance INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`, () => {
        // Insert default admin if not exists
        db.get("SELECT id FROM users WHERE username = 'admin'", (err, row) => {
            if (!row) {
                const hash = bcrypt.hashSync('admin123', 10);
                db.run("INSERT INTO users (username, password_hash, role, balance) VALUES (?, ?, ?, ?)", ['admin', hash, 'admin', 100000000]);
            }
        });
        
        // Insert default settings
        db.get("SELECT key FROM settings WHERE key = 'slot_rtp'", (err, row) => {
            if (!row) {
                db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['slot_rtp', '25']);
            }
        });
    });
}

// Middleware: Authenticate Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.status(401).json({ error: 'Token missing' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Middleware: Require Admin
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// API Routes

// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    try {
        const hash = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, hash], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Registration successful', userId: this.lastID });
        });
    } catch (e) {
        res.status(500).json({ error: 'Internal error' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, balance: user.balance } });
    });
});

// Get Current User (Me)
app.get('/api/me', authenticateToken, (req, res) => {
    db.get("SELECT id, username, role, balance FROM users WHERE id = ?", [req.user.id], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    });
});

// Transaction (Topup, Withdraw, Bet, Win)
app.post('/api/transaction', authenticateToken, (req, res) => {
    const { type, amount } = req.body;
    const numAmount = parseInt(amount, 10);
    
    if (isNaN(numAmount) || numAmount < 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    db.serialize(() => {
        db.get("SELECT balance FROM users WHERE id = ?", [req.user.id], (err, row) => {
            if (err || !row) return res.status(404).json({ error: 'User not found' });

            let newBalance = row.balance;
            if (type === 'topup') {
                newBalance += numAmount;
            } else if (type === 'withdraw') {
                if (newBalance < numAmount) {
                    return res.status(400).json({ error: 'Insufficient balance' });
                }
                newBalance -= numAmount;
            } else {
                return res.status(400).json({ error: 'Invalid transaction type. Bets and wins are now handled by game APIs.' });
            }

            db.run("UPDATE users SET balance = ? WHERE id = ?", [newBalance, req.user.id], (updateErr) => {
                if (updateErr) return res.status(500).json({ error: 'Failed to update balance' });
                res.json({ success: true, newBalance, type, amount: numAmount });
            });
        });
    });
});

// Get Settings (Public)
app.get('/api/settings', (req, res) => {
    db.all("SELECT key, value FROM settings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        const settings = {};
        rows.forEach(r => settings[r.key] = r.value);
        res.json(settings);
    });
});

// --- Game Logic APIs ---
const SYMBOLS = ['🍩','🍬','🍭','🍮','🍉','🍇','🍓'];
const SCATTER = '🌟';

// Generate a random symbol (NO scatter here, scatter is injected)
function randomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// Flood fill helper to find clusters (ignores scatter)
function findClusters(grid) {
    let visited = Array(49).fill(false);
    let clusters = [];

    function dfs(r, c, symbol) {
        if (r < 0 || r >= 7 || c < 0 || c >= 7) return [];
        const idx = r * 7 + c;
        if (visited[idx] || grid[idx] !== symbol) return [];
        
        visited[idx] = true;
        let cluster = [idx];
        
        cluster = cluster.concat(dfs(r + 1, c, symbol));
        cluster = cluster.concat(dfs(r - 1, c, symbol));
        cluster = cluster.concat(dfs(r, c + 1, symbol));
        cluster = cluster.concat(dfs(r, c - 1, symbol));
        
        return cluster;
    }

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const idx = r * 7 + c;
            if (!visited[idx] && grid[idx] !== SCATTER) {
                const cluster = dfs(r, c, grid[idx]);
                if (cluster.length >= 5) {
                    clusters.push({ symbol: grid[idx], indices: cluster, size: cluster.length });
                }
            }
        }
    }
    return clusters;
}

// Count scatters in grid
function countScatters(grid) {
    let indices = [];
    grid.forEach((sym, idx) => { if (sym === SCATTER) indices.push(idx); });
    return indices;
}

// Ensure free_spins and free_spin_total_win columns exist
db.run("ALTER TABLE users ADD COLUMN free_spins INTEGER DEFAULT 0", (err) => {});
db.run("ALTER TABLE users ADD COLUMN free_spin_total_win INTEGER DEFAULT 0", (err) => {});
db.run("ALTER TABLE users ADD COLUMN rtp INTEGER DEFAULT NULL", (err) => {});

// Slot Machine Spin (7x7 Cluster Pays with Tumble + Scatter Free Spins)
app.post('/api/game/slot/spin', authenticateToken, (req, res) => {
    const { betAmount } = req.body;
    const bet = parseInt(betAmount, 10);
    if (isNaN(bet) || bet <= 0) return res.status(400).json({ error: 'Invalid bet amount' });

    db.serialize(() => {
        db.get("SELECT balance, free_spins, free_spin_total_win, rtp FROM users WHERE id = ?", [req.user.id], (err, userRow) => {
            if (err || !userRow) return res.status(404).json({ error: 'User not found' });
            
            const isFreeSpin = (userRow.free_spins || 0) > 0;
            const freeSpinsLeft = userRow.free_spins || 0;
            let fsTotalWin = userRow.free_spin_total_win || 0;
            
            // During free spins, don't check balance
            if (!isFreeSpin && userRow.balance < bet) {
                return res.status(400).json({ error: 'Insufficient balance' });
            }

            db.get("SELECT value FROM settings WHERE key = 'slot_rtp'", (err, rtpRow) => {
                // Gunakan RTP user jika ada, jika tidak gunakan RTP global
                const slotRtp = userRow.rtp !== null ? userRow.rtp : (rtpRow ? parseInt(rtpRow.value, 10) : 25);
                const winChance = Math.random() * 100;
                const shouldWin = winChance <= slotRtp;
                
                const generateGrid = () => {
                    let g = [];
                    for (let i = 0; i < 49; i++) g.push(randomSymbol());
                    return g;
                };

                let currentGrid = generateGrid();

                if (shouldWin) {
                    // Ensure it has a win. If not naturally, force one.
                    if (findClusters(currentGrid).length === 0) {
                        const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                        const startR = Math.floor(Math.random() * 3);
                        const startC = Math.floor(Math.random() * 3);
                        currentGrid[startR*7 + startC] = sym;
                        currentGrid[startR*7 + startC + 1] = sym;
                        currentGrid[(startR+1)*7 + startC] = sym;
                        currentGrid[(startR+1)*7 + startC + 1] = sym;
                        currentGrid[(startR+2)*7 + startC] = sym;
                    }
                } else {
                    // Force loss: regenerate until 0 clusters
                    while (findClusters(currentGrid).length > 0) {
                        currentGrid = generateGrid();
                    }
                }

                // Inject scatters with low probability (10% chance to appear, max 4)
                if (!isFreeSpin && Math.random() < 0.10) { 
                    const numScatters = Math.floor(Math.random() * 4) + 1; // 1 to 4 scatters
                    
                    // find available indices (not part of any cluster to avoid breaking wins)
                    let currentClusters = findClusters(currentGrid);
                    let winIndices = new Set();
                    currentClusters.forEach(c => c.indices.forEach(idx => winIndices.add(idx)));
                    
                    let availableIndices = [];
                    for (let i = 0; i < 49; i++) {
                        if (!winIndices.has(i)) availableIndices.push(i);
                    }
                    
                    // Shuffle available indices
                    for (let i = availableIndices.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
                    }
                    
                    for (let i = 0; i < numScatters && i < availableIndices.length; i++) {
                        currentGrid[availableIndices[i]] = SCATTER;
                    }
                }

                // Detect scatters in initial grid
                let scatterIndices = countScatters(currentGrid);
                let freeSpinsAwarded = 0;
                if (scatterIndices.length >= 4) freeSpinsAwarded = 10;
                else if (scatterIndices.length >= 3) freeSpinsAwarded = 5;

                // Free spin mode = 2x all wins
                const winMultiplier = isFreeSpin ? 2 : 1;

                let sequence = [];
                let totalMultiplier = 0;
                let totalWinAmount = 0;
                let spotMultipliers = Array(49).fill(0);

                let tumbling = true;
                let maxTumbles = 15;
                let tumbles = 0;

                while(tumbling && tumbles < maxTumbles) {
                    tumbles++;
                    let clusters = findClusters(currentGrid);
                    
                    if (clusters.length === 0) {
                        if (tumbles === 1) {
                            sequence.push({ 
                                grid: [...currentGrid], 
                                clusters: [], 
                                spotMultipliers: [...spotMultipliers],
                                scatterIndices: tumbles === 1 ? scatterIndices : []
                            });
                        }
                        tumbling = false;
                        break;
                    }

                    let tumbleMult = 0;
                    clusters.forEach(c => {
                        let baseMult = 0;
                        if (c.size >= 15) baseMult = 50;
                        else if (c.size >= 10) baseMult = 10;
                        else if (c.size >= 7) baseMult = 5;
                        else if (c.size >= 5) baseMult = 1;
                        
                        let spotMultSum = 0;
                        c.indices.forEach(idx => {
                            if (spotMultipliers[idx] > 0) spotMultSum += spotMultipliers[idx];
                        });
                        
                        tumbleMult += baseMult * (spotMultSum > 0 ? spotMultSum : 1);
                    });

                    // Apply 2x during free spins
                    tumbleMult *= winMultiplier;
                    totalMultiplier += tumbleMult;
                    
                    sequence.push({
                        grid: [...currentGrid],
                        clusters: clusters,
                        spotMultipliers: [...spotMultipliers],
                        winAmount: bet * tumbleMult,
                        scatterIndices: tumbles === 1 ? scatterIndices : []
                    });

                    clusters.forEach(c => {
                        c.indices.forEach(idx => {
                            if (spotMultipliers[idx] === 0) spotMultipliers[idx] = 2;
                            else spotMultipliers[idx] *= 2;
                            if (spotMultipliers[idx] > 128) spotMultipliers[idx] = 128;
                        });
                    });

                    let nextGrid = [...currentGrid];
                    let clusterIndices = new Set();
                    clusters.forEach(c => c.indices.forEach(idx => clusterIndices.add(idx)));

                    for (let c = 0; c < 7; c++) {
                        let colSymbols = [];
                        for (let r = 0; r < 7; r++) {
                            const idx = r * 7 + c;
                            if (!clusterIndices.has(idx)) {
                                colSymbols.push(nextGrid[idx]);
                            }
                        }
                        while (colSymbols.length < 7) {
                            colSymbols.unshift(randomSymbol());
                        }
                        for (let r = 0; r < 7; r++) {
                            nextGrid[r * 7 + c] = colSymbols[r];
                        }
                    }
                    currentGrid = nextGrid;
                }

                totalWinAmount = bet * totalMultiplier;
                
                // Calculate balance and free spins logic
                let newBalance = userRow.balance;
                let newFreeSpins = freeSpinsLeft;
                let freeSpinsFinished = false;
                let finalFsTotalWin = 0;

                if (isFreeSpin) {
                    fsTotalWin += totalWinAmount;
                    newBalance += totalWinAmount;
                    newFreeSpins = freeSpinsLeft - 1 + freeSpinsAwarded;
                    
                    if (newFreeSpins <= 0) {
                        freeSpinsFinished = true;
                        finalFsTotalWin = fsTotalWin;
                        fsTotalWin = 0; // reset
                    }
                } else {
                    newBalance = userRow.balance - bet + totalWinAmount;
                    if (freeSpinsAwarded > 0) {
                        newFreeSpins = freeSpinsAwarded;
                        fsTotalWin = totalWinAmount; // start accumulating
                    }
                }

                db.run("UPDATE users SET balance = ?, free_spins = ?, free_spin_total_win = ? WHERE id = ?", 
                    [newBalance, newFreeSpins, fsTotalWin, req.user.id], (updateErr) => {
                    if (updateErr) return res.status(500).json({ error: 'Failed to update balance' });
                    res.json({ 
                        success: true, 
                        sequence, 
                        totalMultiplier, 
                        totalWinAmount, 
                        newBalance,
                        isFreeSpin,
                        freeSpinsAwarded,
                        freeSpinsRemaining: newFreeSpins,
                        scatterCount: scatterIndices.length,
                        freeSpinsFinished,
                        finalFsTotalWin
                    });
                });
            });
        });
    });
});
// ==========================================
// NEW GAMES: CRASH & DICE
// ==========================================

// Crash Game
app.post('/api/game/crash/play', authenticateToken, (req, res) => {
    const bet = parseInt(req.body.bet, 10);
    const target = parseFloat(req.body.targetMultiplier);
    
    if (isNaN(bet) || bet <= 0) return res.status(400).json({ error: 'Invalid bet amount' });
    if (isNaN(target) || target < 1.01) return res.status(400).json({ error: 'Invalid target multiplier (min 1.01)' });

    db.serialize(() => {
        db.get("SELECT balance, rtp FROM users WHERE id = ?", [req.user.id], (err, userRow) => {
            if (err || !userRow) return res.status(404).json({ error: 'User not found' });
            if (userRow.balance < bet) return res.status(400).json({ error: 'Insufficient balance' });

            db.get("SELECT value FROM settings WHERE key = 'slot_rtp'", (err, rtpRow) => {
                const globalRtp = rtpRow ? parseInt(rtpRow.value, 10) : 25;
                const rtp = userRow.rtp !== null ? userRow.rtp : globalRtp;
                const winChance = Math.random() * 100;
                
                let crashPoint = 1.00;
                
                // If user should win based on RTP, ensure crashPoint is AT LEAST their target.
                // Otherwise, normal distribution.
                if (winChance <= rtp) {
                    // Win: Crash point will be target + some random extra
                    crashPoint = target + (Math.random() * 2);
                } else {
                    // Loss: Crash point will be strictly BELOW their target
                    crashPoint = 1.00 + (Math.random() * (target - 1.01));
                }
                
                // 3% absolute instant crash (house edge absolute)
                if (Math.random() < 0.03) {
                    crashPoint = 1.00;
                }

                crashPoint = parseFloat(crashPoint.toFixed(2));

                const isWin = crashPoint >= target;
                const winAmount = isWin ? Math.floor(bet * target) : 0;
                const newBalance = userRow.balance - bet + winAmount;

                db.run("UPDATE users SET balance = ? WHERE id = ?", [newBalance, req.user.id], (updateErr) => {
                    if (updateErr) return res.status(500).json({ error: 'Failed to update balance' });
                    res.json({ success: true, crashPoint, target, isWin, winAmount, newBalance });
                });
            });
        });
    });
});

// Dice Game
app.post('/api/game/dice/play', authenticateToken, (req, res) => {
    const bet = parseInt(req.body.bet, 10);
    const chance = parseFloat(req.body.chance); 
    const condition = req.body.condition; 
    
    if (isNaN(bet) || bet <= 0) return res.status(400).json({ error: 'Invalid bet amount' });
    if (isNaN(chance) || chance < 1 || chance > 98) return res.status(400).json({ error: 'Chance must be between 1 and 98' });
    if (condition !== 'under' && condition !== 'over') return res.status(400).json({ error: 'Invalid condition' });

    db.serialize(() => {
        db.get("SELECT balance, rtp FROM users WHERE id = ?", [req.user.id], (err, userRow) => {
            if (err || !userRow) return res.status(404).json({ error: 'User not found' });
            if (userRow.balance < bet) return res.status(400).json({ error: 'Insufficient balance' });

            db.get("SELECT value FROM settings WHERE key = 'slot_rtp'", (err, rtpRow) => {
                const globalRtp = rtpRow ? parseInt(rtpRow.value, 10) : 25;
                const rtp = userRow.rtp !== null ? userRow.rtp : globalRtp;
                const winChance = Math.random() * 100;
                
                let roll = 0;
                const shouldWin = winChance <= rtp;
                
                let targetNumber = condition === 'under' ? chance : (100 - chance);
                
                if (shouldWin) {
                    if (condition === 'under') {
                        roll = Math.random() * targetNumber; // strictly under target
                    } else {
                        roll = targetNumber + (Math.random() * (100 - targetNumber)); // strictly over target
                    }
                } else {
                    if (condition === 'under') {
                        roll = targetNumber + (Math.random() * (100 - targetNumber)); // strictly over target (loss)
                    } else {
                        roll = Math.random() * targetNumber; // strictly under target (loss)
                    }
                }

                roll = parseFloat(roll.toFixed(2));
                const isWin = condition === 'under' ? (roll <= targetNumber) : (roll >= targetNumber);
                
                // Multiplier formula for dice (99 / chance = 1% house edge)
                const multiplier = 99 / chance;
                const winAmount = isWin ? Math.floor(bet * multiplier) : 0;
                const newBalance = userRow.balance - bet + winAmount;

                db.run("UPDATE users SET balance = ? WHERE id = ?", [newBalance, req.user.id], (updateErr) => {
                    if (updateErr) return res.status(500).json({ error: 'Failed to update balance' });
                    res.json({ success: true, roll, targetNumber, condition, multiplier, isWin, winAmount, newBalance });
                });
            });
        });
    });
});
// Admin: Get Users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    db.all("SELECT id, username, role, balance, rtp FROM users ORDER BY balance DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Admin: Update User RTP
app.put('/api/admin/users/:id/rtp', authenticateToken, requireAdmin, (req, res) => {
    const { rtp } = req.body;
    let rtpValue = rtp === '' || rtp === null ? null : parseInt(rtp, 10);
    
    db.run("UPDATE users SET rtp = ? WHERE id = ?", [rtpValue, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update user RTP' });
        res.json({ success: true });
    });
});

// Admin: Update Setting
app.post('/api/admin/settings', authenticateToken, requireAdmin, (req, res) => {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: 'Key and value required' });

    db.run("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", [key, value], (err) => {
        if (err) {
            // Older sqlite might not support ON CONFLICT for non-unique constraints, but key is PRIMARY KEY so it should work.
            // Let's use INSERT OR REPLACE for safety with older SQLite versions.
            db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value], (err2) => {
                 if (err2) return res.status(500).json({ error: 'Database error' });
                 res.json({ success: true });
            });
            return;
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

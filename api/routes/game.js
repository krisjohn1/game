const express = require('express');
const supabase = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

const SYMBOLS = ['🍩','🍬','🍭','🍮','🍉','🍇','🍓'];
const SCATTER = '🌟';

function randomSymbol() { return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]; }

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
                if (cluster.length >= 5) clusters.push({ symbol: grid[idx], indices: cluster, size: cluster.length });
            }
        }
    }
    return clusters;
}

function countScatters(grid) {
    let indices = [];
    grid.forEach((sym, idx) => { if (sym === SCATTER) indices.push(idx); });
    return indices;
}

// SLOT MACHINE
router.post('/slot/spin', authenticateToken, async (req, res) => {
    const bet = parseInt(req.body.betAmount, 10);
    if (isNaN(bet) || bet <= 0) return res.status(400).json({ error: 'Invalid bet amount' });

    try {
        const { data: userRow, error: userErr } = await supabase
            .from('users')
            .select('balance, free_spins, free_spin_total_win, rtp')
            .eq('id', req.user.id)
            .single();

        if (userErr || !userRow) return res.status(404).json({ error: 'User not found' });
        
        const isFreeSpin = (userRow.free_spins || 0) > 0;
        const freeSpinsLeft = userRow.free_spins || 0;
        let fsTotalWin = userRow.free_spin_total_win || 0;
        
        if (!isFreeSpin && userRow.balance < bet) return res.status(400).json({ error: 'Insufficient balance' });

        const { data: rtpRow } = await supabase.from('settings').select('value').eq('key', 'slot_rtp').single();
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
            while (findClusters(currentGrid).length > 0) currentGrid = generateGrid();
        }

        if (!isFreeSpin && Math.random() < 0.10) { 
            const numScatters = Math.floor(Math.random() * 4) + 1;
            let currentClusters = findClusters(currentGrid);
            let winIndices = new Set();
            currentClusters.forEach(c => c.indices.forEach(idx => winIndices.add(idx)));
            
            let availableIndices = [];
            for (let i = 0; i < 49; i++) if (!winIndices.has(i)) availableIndices.push(i);
            
            for (let i = availableIndices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
            }
            
            for (let i = 0; i < numScatters && i < availableIndices.length; i++) {
                currentGrid[availableIndices[i]] = SCATTER;
            }
        }

        let scatterIndices = countScatters(currentGrid);
        let freeSpinsAwarded = 0;
        if (scatterIndices.length >= 4) freeSpinsAwarded = 10;
        else if (scatterIndices.length >= 3) freeSpinsAwarded = 5;

        const winMultiplier = isFreeSpin ? 2 : 1;
        let sequence = [];
        let totalMultiplier = 0;
        let spotMultipliers = Array(49).fill(0);
        let tumbling = true;
        let tumbles = 0;

        while(tumbling && tumbles < 15) {
            tumbles++;
            let clusters = findClusters(currentGrid);
            
            if (clusters.length === 0) {
                if (tumbles === 1) {
                    sequence.push({ 
                        grid: [...currentGrid], clusters: [], spotMultipliers: [...spotMultipliers],
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
                c.indices.forEach(idx => { if (spotMultipliers[idx] > 0) spotMultSum += spotMultipliers[idx]; });
                tumbleMult += baseMult * (spotMultSum > 0 ? spotMultSum : 1);
            });

            tumbleMult *= winMultiplier;
            totalMultiplier += tumbleMult;
            
            sequence.push({
                grid: [...currentGrid], clusters: clusters, spotMultipliers: [...spotMultipliers],
                winAmount: bet * tumbleMult, scatterIndices: tumbles === 1 ? scatterIndices : []
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
                    if (!clusterIndices.has(idx)) colSymbols.push(nextGrid[idx]);
                }
                while (colSymbols.length < 7) colSymbols.unshift(randomSymbol());
                for (let r = 0; r < 7; r++) nextGrid[r * 7 + c] = colSymbols[r];
            }
            currentGrid = nextGrid;
        }

        const totalWinAmount = bet * totalMultiplier;
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
                fsTotalWin = 0; 
            }
        } else {
            newBalance = userRow.balance - bet + totalWinAmount;
            if (freeSpinsAwarded > 0) {
                newFreeSpins = freeSpinsAwarded;
                fsTotalWin = totalWinAmount;
            }
        }

        const { error: updateErr } = await supabase
            .from('users')
            .update({ balance: newBalance, free_spins: newFreeSpins, free_spin_total_win: fsTotalWin })
            .eq('id', req.user.id);

        if (updateErr) return res.status(500).json({ error: 'Failed to update balance' });
        
        res.json({ 
            success: true, sequence, totalMultiplier, totalWinAmount, newBalance,
            isFreeSpin, freeSpinsAwarded, freeSpinsRemaining: newFreeSpins,
            scatterCount: scatterIndices.length, freeSpinsFinished, finalFsTotalWin
        });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// CRASH GAME
router.post('/crash/play', authenticateToken, async (req, res) => {
    const bet = parseInt(req.body.bet, 10);
    const target = parseFloat(req.body.targetMultiplier);
    
    if (isNaN(bet) || bet <= 0) return res.status(400).json({ error: 'Invalid bet amount' });
    if (isNaN(target) || target < 1.01) return res.status(400).json({ error: 'Invalid target multiplier' });

    try {
        const { data: userRow, error: userErr } = await supabase
            .from('users')
            .select('balance, rtp')
            .eq('id', req.user.id)
            .single();

        if (userErr || !userRow) return res.status(404).json({ error: 'User not found' });
        if (userRow.balance < bet) return res.status(400).json({ error: 'Insufficient balance' });

        const { data: rtpRow } = await supabase.from('settings').select('value').eq('key', 'slot_rtp').single();
        const globalRtp = rtpRow ? parseInt(rtpRow.value, 10) : 25;
        const rtp = userRow.rtp !== null ? userRow.rtp : globalRtp;
        const winChance = Math.random() * 100;
        
        let crashPoint = 1.00;
        if (winChance <= rtp) crashPoint = target + (Math.random() * 2);
        else crashPoint = 1.00 + (Math.random() * (target - 1.01));
        
        if (Math.random() < 0.03) crashPoint = 1.00;

        crashPoint = parseFloat(crashPoint.toFixed(2));
        const isWin = crashPoint >= target;
        const winAmount = isWin ? Math.floor(bet * target) : 0;
        const newBalance = userRow.balance - bet + winAmount;

        const { error: updateErr } = await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', req.user.id);

        if (updateErr) return res.status(500).json({ error: 'Failed to update balance' });
        res.json({ success: true, crashPoint, target, isWin, winAmount, newBalance });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DICE GAME
router.post('/dice/play', authenticateToken, async (req, res) => {
    const bet = parseInt(req.body.bet, 10);
    const chance = parseFloat(req.body.chance); 
    const condition = req.body.condition; 
    
    if (isNaN(bet) || bet <= 0) return res.status(400).json({ error: 'Invalid bet amount' });
    if (isNaN(chance) || chance < 1 || chance > 98) return res.status(400).json({ error: 'Chance must be between 1 and 98' });
    if (condition !== 'under' && condition !== 'over') return res.status(400).json({ error: 'Invalid condition' });

    try {
        const { data: userRow, error: userErr } = await supabase
            .from('users')
            .select('balance, rtp')
            .eq('id', req.user.id)
            .single();

        if (userErr || !userRow) return res.status(404).json({ error: 'User not found' });
        if (userRow.balance < bet) return res.status(400).json({ error: 'Insufficient balance' });

        const { data: rtpRow } = await supabase.from('settings').select('value').eq('key', 'slot_rtp').single();
        const globalRtp = rtpRow ? parseInt(rtpRow.value, 10) : 25;
        const rtp = userRow.rtp !== null ? userRow.rtp : globalRtp;
        const winChance = Math.random() * 100;
        
        let roll = 0;
        const shouldWin = winChance <= rtp;
        let targetNumber = condition === 'under' ? chance : (100 - chance);
        
        if (shouldWin) {
            if (condition === 'under') roll = Math.random() * targetNumber; 
            else roll = targetNumber + (Math.random() * (100 - targetNumber)); 
        } else {
            if (condition === 'under') roll = targetNumber + (Math.random() * (100 - targetNumber)); 
            else roll = Math.random() * targetNumber; 
        }

        roll = parseFloat(roll.toFixed(2));
        const isWin = condition === 'under' ? (roll <= targetNumber) : (roll >= targetNumber);
        const multiplier = 99 / chance;
        const winAmount = isWin ? Math.floor(bet * multiplier) : 0;
        const newBalance = userRow.balance - bet + winAmount;

        const { error: updateErr } = await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', req.user.id);

        if (updateErr) return res.status(500).json({ error: 'Failed to update balance' });
        res.json({ success: true, roll, targetNumber, condition, multiplier, isWin, winAmount, newBalance });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// MINES GAME (Simple client-trust model for demonstration)
router.post('/mines/result', authenticateToken, async (req, res) => {
    const bet = parseInt(req.body.bet, 10);
    const winAmount = parseInt(req.body.winAmount, 10);
    
    if (isNaN(bet) || bet < 0 || isNaN(winAmount) || winAmount < 0) {
        return res.status(400).json({ error: 'Invalid bet or win amount' });
    }

    try {
        const { data: userRow, error: userErr } = await supabase
            .from('users')
            .select('balance')
            .eq('id', req.user.id)
            .single();

        if (userErr || !userRow) return res.status(404).json({ error: 'User not found' });
        
        // We assume the game deducts the bet and adds the winAmount
        const newBalance = userRow.balance - bet + winAmount;
        if (newBalance < 0) return res.status(400).json({ error: 'Insufficient balance' });

        const { error: updateErr } = await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', req.user.id);

        if (updateErr) return res.status(500).json({ error: 'Failed to update balance' });
        res.json({ success: true, newBalance });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

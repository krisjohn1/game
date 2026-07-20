const express = require('express');
const supabase = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

router.get('/settings', async (req, res) => {
    try {
        const { data, error } = await supabase.from('settings').select('key, value');
        if (error) throw error;
        
        const settings = {};
        data.forEach(r => settings[r.key] = r.value);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/settings', authenticateToken, requireAdmin, async (req, res) => {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: 'Key and value required' });

    try {
        const { error } = await supabase
            .from('settings')
            .upsert({ key, value }, { onConflict: 'key' });

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, username, role, balance, rtp')
            .order('balance', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/users/:id/rtp', authenticateToken, requireAdmin, async (req, res) => {
    const { rtp } = req.body;
    let rtpValue = rtp === '' || rtp === null ? null : parseInt(rtp, 10);
    
    try {
        const { error } = await supabase
            .from('users')
            .update({ rtp: rtpValue })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user RTP' });
    }
});

module.exports = router;

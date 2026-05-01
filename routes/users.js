const express = require('express');
const router = express.Router();

const users = new Map();

// Get user profile
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const user = users.get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { username, bio } = req.body;
        const user = users.get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (username) user.username = username;
        if (bio) user.bio = bio;
        res.json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get favorites
router.get('/:userId/favorites', (req, res) => {
    try {
        const { userId } = req.params;
        const user = users.get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ userId, favorites: user.favorites || [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

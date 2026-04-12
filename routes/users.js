const express = require('express');
const router = express.Router();

// Mock user database
const users = new Map();

// Get user profile
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const user = users.get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user data without sensitive info
        const { password, ...userDataWithoutPassword } = user;
        res.json(userDataWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { username, bio, avatar } = req.body;

        const user = users.get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (username) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (avatar) user.avatar = avatar;
        user.updatedAt = new Date();

        res.json({
            message: 'Profile updated successfully',
            user: { ...user }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user favorites
router.get('/:userId/favorites', (req, res) => {
    try {
        const { userId } = req.params;
        const user = users.get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            userId,
            favorites: user.favorites || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add favorite
router.post('/:userId/favorites/:trackId', (req, res) => {
    try {
        const { userId, trackId } = req.params;
        const user = users.get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.favorites) {
            user.favorites = [];
        }

        if (!user.favorites.includes(trackId)) {
            user.favorites.push(trackId);
        }

        res.json({
            message: 'Track added to favorites',
            favorites: user.favorites
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove favorite
router.delete('/:userId/favorites/:trackId', (req, res) => {
    try {
        const { userId, trackId } = req.params;
        const user = users.get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.favorites) {
            user.favorites = user.favorites.filter(t => t !== trackId);
        }

        res.json({
            message: 'Track removed from favorites',
            favorites: user.favorites || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user listening history
router.get('/:userId/history', (req, res) => {
    try {
        const { userId } = req.params;
        const user = users.get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            userId,
            history: user.history || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add to listening history
router.post('/:userId/history', (req, res) => {
    try {
        const { userId } = req.params;
        const { trackId, playedAt } = req.body;

        const user = users.get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.history) {
            user.history = [];
        }

        user.history.unshift({
            trackId,
            playedAt: playedAt || new Date()
        });

        // Keep only last 100 entries
        if (user.history.length > 100) {
            user.history = user.history.slice(0, 100);
        }

        res.json({
            message: 'Added to history',
            history: user.history
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user statistics
router.get('/:userId/stats', (req, res) => {
    try {
        const { userId } = req.params;
        const user = users.get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const stats = {
            userId,
            favoriteCount: user.favorites ? user.favorites.length : 0,
            historyCount: user.history ? user.history.length : 0,
            accountCreatedAt: user.createdAt,
            lastActive: user.updatedAt
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
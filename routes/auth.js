const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = new Map();

// Register
router.post('/register', (req, res) => {
    try {
        const { username, telegramId } = req.body;

        if (users.has(telegramId)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = {
            id: telegramId,
            username,
            createdAt: new Date()
        };

        users.set(telegramId, user);

        const token = jwt.sign({ userId: telegramId }, process.env.JWT_SECRET || 'secret');
        res.json({ message: 'User registered successfully', token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', (req, res) => {
    try {
        const { telegramId } = req.body;
        const user = users.get(telegramId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const token = jwt.sign({ userId: telegramId }, process.env.JWT_SECRET || 'secret');
        res.json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Telegram Auth
router.post('/telegram-login', (req, res) => {
    try {
        const { telegramId, username, firstName } = req.body;

        let user = users.get(telegramId);
        if (!user) {
            user = {
                id: telegramId,
                username: username || `user_${telegramId}`,
                firstName: firstName || 'User',
                createdAt: new Date()
            };
            users.set(telegramId, user);
        }

        const token = jwt.sign({ userId: telegramId }, process.env.JWT_SECRET || 'secret');
        res.json({ message: 'Telegram login successful', token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

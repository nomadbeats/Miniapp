const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Telegram Bot Setup
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Sample music data
const musicDatabase = [
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', duration: 354, image: 'https://via.placeholder.com/200?text=Queen' },
    { id: 2, title: 'Imagine', artist: 'John Lennon', album: 'Imagine', genre: 'Pop', duration: 183, image: 'https://via.placeholder.com/200?text=Lennon' },
    { id: 3, title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', duration: 391, image: 'https://via.placeholder.com/200?text=Eagles' },
    { id: 4, title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', genre: 'Pop', duration: 294, image: 'https://via.placeholder.com/200?text=Jackson' },
    { id: 5, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synthwave', duration: 200, image: 'https://via.placeholder.com/200?text=Weeknd' },
    { id: 6, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Disco-Pop', duration: 203, image: 'https://via.placeholder.com/200?text=DuaLipa' },
    { id: 7, title: 'As It Was', artist: 'Harry Styles', album: 'Harry\'s House', genre: 'Indie-Pop', duration: 167, image: 'https://via.placeholder.com/200?text=HarryStyles' },
    { id: 8, title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', genre: 'Psychedelic Pop', duration: 239, image: 'https://via.placeholder.com/200?text=GlassAnimals' }
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// API: Get all music
app.get('/api/music', (req, res) => {
    res.json(musicDatabase);
});

// API: Get music by ID
app.get('/api/music/:id', (req, res) => {
    const track = musicDatabase.find(t => t.id == req.params.id);
    if (track) {
        res.json(track);
    } else {
        res.status(404).json({ error: 'Track not found' });
    }
});

// API: Search music
app.get('/api/search', (req, res) => {
    const query = req.query.q.toLowerCase();
    const results = musicDatabase.filter(track => 
        track.title.toLowerCase().includes(query) || 
        track.artist.toLowerCase().includes(query)
    );
    res.json(results);
});

// API: Get music by genre
app.get('/api/genre/:genre', (req, res) => {
    const genre = req.params.genre.toLowerCase();
    const results = musicDatabase.filter(track => 
        track.genre.toLowerCase().includes(genre)
    );
    res.json(results);
});

// API: Get top tracks
app.get('/api/top', (req, res) => {
    const top = musicDatabase.slice(0, 5);
    res.json(top);
});

// Telegram webhook endpoint
app.post('/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Telegram Bot Commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const webAppUrl = process.env.WEB_APP_URL || 'https://yourdomain.com/app';
    
    bot.sendMessage(chatId, '🎵 Welcome to Music Player!', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🎧 Open Music Player',
                        web_app: { url: webAppUrl }
                    }
                ]
            ]
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Music API available at http://localhost:${PORT}/api/music`);
});
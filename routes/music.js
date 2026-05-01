const express = require('express');
const router = express.Router();

const musicTracks = [
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', duration: 354, image: 'https://via.placeholder.com/200?text=Queen' },
    { id: 2, title: 'Imagine', artist: 'John Lennon', album: 'Imagine', genre: 'Pop', duration: 183, image: 'https://via.placeholder.com/200?text=Lennon' },
    { id: 3, title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', duration: 391, image: 'https://via.placeholder.com/200?text=Eagles' },
    { id: 4, title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', genre: 'Pop', duration: 294, image: 'https://via.placeholder.com/200?text=Jackson' },
    { id: 5, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synthwave', duration: 200, image: 'https://via.placeholder.com/200?text=Weeknd' },
    { id: 6, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Disco-Pop', duration: 203, image: 'https://via.placeholder.com/200?text=DuaLipa' },
    { id: 7, title: 'As It Was', artist: 'Harry Styles', album: 'Harry\'s House', genre: 'Indie-Pop', duration: 167, image: 'https://via.placeholder.com/200?text=HarryStyles' },
    { id: 8, title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', genre: 'Psychedelic Pop', duration: 239, image: 'https://via.placeholder.com/200?text=GlassAnimals' }
];

// Get all tracks
router.get('/', (req, res) => {
    res.json(musicTracks);
});

// Get track by ID
router.get('/:id', (req, res) => {
    const track = musicTracks.find(t => t.id == req.params.id);
    if (track) {
        res.json(track);
    } else {
        res.status(404).json({ error: 'Track not found' });
    }
});

// Search tracks
router.get('/search/:query', (req, res) => {
    const query = req.params.query.toLowerCase();
    const results = musicTracks.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
    );
    res.json(results);
});

module.exports = router;

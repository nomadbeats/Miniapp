const express = require('express');
const router = express.Router();

const playlists = new Map();

// Create playlist
router.post('/', (req, res) => {
    try {
        const { name, userId } = req.body;
        const id = Date.now().toString();
        const playlist = {
            id,
            name,
            userId,
            tracks: [],
            createdAt: new Date()
        };
        playlists.set(id, playlist);
        res.json({ message: 'Playlist created', playlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get playlists
router.get('/', (req, res) => {
    const allPlaylists = Array.from(playlists.values());
    res.json(allPlaylists);
});

// Get playlist by ID
router.get('/:id', (req, res) => {
    const playlist = playlists.get(req.params.id);
    if (playlist) {
        res.json(playlist);
    } else {
        res.status(404).json({ error: 'Playlist not found' });
    }
});

// Add track to playlist
router.post('/:id/tracks', (req, res) => {
    try {
        const { trackId } = req.body;
        const playlist = playlists.get(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        playlist.tracks.push(trackId);
        res.json({ message: 'Track added to playlist', playlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove track from playlist
router.delete('/:id/tracks/:trackId', (req, res) => {
    try {
        const playlist = playlists.get(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        playlist.tracks = playlist.tracks.filter(t => t !== req.params.trackId);
        res.json({ message: 'Track removed from playlist', playlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    owner: { type: String, required: true },
    tracks: { type: [String], default: [] },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;

const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, default: '' },
    genre: { type: String, default: 'Pop' },
    duration: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    favorites: { type: [String], default: [] },
    history: { type: [String], default: [] },
    playlists: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
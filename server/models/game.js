const mongoose = require('mongoose');

let GameSchema = new mongoose.Schema({
    players: Number,
    date: { type: Date, default: Date.now }
});

let Game = mongoose.model('game', GameSchema);

module.exports = {
    Game: Game
};

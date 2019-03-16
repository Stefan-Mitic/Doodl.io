const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    players: [String],      // list of participating players (username)
    winner: String,         // username of winning player
    images: [String],       // list of images (id) used in the game
    rounds: Number,         // number of rounds played
    status: Number,         // status of the game
    date: {
        type: Date,
        default: Date.now
    }                       // date of when game was played
});

const Game = mongoose.model('Game', GameSchema);
module.export = Game;

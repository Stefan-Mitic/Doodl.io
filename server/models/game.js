const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    _id: { // game/socket id
        type: String,
    },
    players: { // list of participating players (username)
        type: [String],
        default: [],
    },
    winner: { // username of winning player
        type: String,
        required: false,
        default: '',
    },
    images: { // list of images (id) used in the game
        type: [String],
        default: [],
    },
    rounds: { // total rounds
        type: Number,
        required: false,
        default: 1,
    },
    currRound: {
        type: Number,
        required: false,
        default: 0
    },
    started: { // false when created, true when game starts 
        type: Boolean,
        required: false,
        default: false,
    }
});

const Game = mongoose.model('Game', GameSchema);
module.export = Game;
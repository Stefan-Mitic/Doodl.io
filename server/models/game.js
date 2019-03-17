const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    _id: String, // game/socket id
    players: [String], // list of participating players (username)
    winner: String, // username of winning player
    images: [String], // list of images (id) used in the game
    rounds: Number, // number of rounds played
    started: Boolean // False when created, True when game starts 
});

const Game = mongoose.model('Game', GameSchema);
module.export = Game;
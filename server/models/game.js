const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema and model

const GameSchema = new Schema({
    players: Number
});

const Game = mongoose.model('game', GameSchema);

module.exports = Game;

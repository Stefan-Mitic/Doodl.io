const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    game: String,       // id of game played
    player: String,     // player username
    score: Number,      // player's score
});

const Score = mongoose.model('Score', ScoreSchema);
module.export = Score;

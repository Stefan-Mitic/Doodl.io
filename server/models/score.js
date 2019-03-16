const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    gameId: { // id of game played
        type: String,
        required: true,
        index: true
    },
    player: { // player username
        type: String,
        required: true,
        index: true
    },
    score: { // player's score
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Score = mongoose.model('Score', ScoreSchema);
module.export = Score;

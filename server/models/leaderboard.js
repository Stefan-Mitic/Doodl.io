const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    _id: { // _id is the username
        type: String,
        required: true,
    },
    score: { // player's total number of wins
        type: Number,
        default: 0,
        index: true
    }
}, {
    timestamps: true
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);
module.export = Leaderboard;
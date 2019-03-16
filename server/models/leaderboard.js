const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    _id: { // _id is the username
        type: String,
        required: true,
        index: true
    },
    score: { // player's total score
        type: Number,
        default: 0,
        index: true
    }
}, {
    timestamps: true
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);
module.export = Leaderboard;

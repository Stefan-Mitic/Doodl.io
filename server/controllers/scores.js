/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const ScoreModel = mongoose.model('Score');
const LeaderboardModel = mongoose.model('Leaderboard');

/**
 * Exported functions.
 */

// gets top 10 players
exports.getTopPlayers = function (req, res) {
    LeaderboardModel.find({}, { _id: 0 })
        .sort({ score: -1 })
        .limit(10)
        .exec(function (err, players) {
            if (err) res.status(500).end(err);
            return res.json(players);
        });
};

// gets given player's score and position on the leaderboard
exports.getPlayerLeaderboard = function (req, res) {
    let username = req.params.username;
    LeaderboardModel.findById(username, function (err, player) {
        if (err) res.status(500).end(err);
        if (!player) res.status(404).end(`player ${player} does not exist on leaderboard`);
        LeaderboardModel.find({ score: { $gte: player.score }})
            .count(function (err, position) {
                if (err) res.status(500).end(err);
                return res.json({
                    player: username,
                    score: player.score,
                    position: position
                });
            });
    });
};

const GAME_HISTORY_PAGE_SIZE = 10;

// gets given player's game history
exports.getPlayerHistory = function (req, res) {
    let page = parseInt(req.query.page) || 0;
    let username = req.params.username;
    ScoreModel.find({ player: username })
        .sort({ createdAt: -1 })
        .skip(page * GAME_HISTORY_PAGE_SIZE)
        .limit(GAME_HISTORY_PAGE_SIZE)
        .exec(function (err, history) {
            if (err) res.status(500).end(err);
            return res.json(history);
        });  
};
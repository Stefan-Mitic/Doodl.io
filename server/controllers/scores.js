/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const ScoreModel = mongoose.model('Score');
// const LeaderboardModel = mongoose.model('Leaderboard');

/**
 * Exported functions.
 */

// gets top 10 players
exports.getTopPlayers = function(req, res) {
    UserModel.find({})
    .sort({ score: -1 })
    .limit(10)
    .exec(function(err, players) {
        if (err) return res.status(500).end(err);
        return res.json(players);
    });
};

// gets given player's wins and position on the leaderboard
exports.getPlayerLeaderboard = function(req, res) {
    let username = req.username.toLowerCase();
    UserModel.findById(username, function(err, player) {
        if (err) return res.status(500).end(err);
        if (!player) res.status(404).end(`player ${player} does not exist on leaderboard`);
        UserModel.find({ wins: { $gte: player.wins } })
            .countDocuments(function(err, position) {
                if (err) return res.status(500).end(err);
                return res.json({
                    player: username,
                    wins: player.wins,
                    position: position
                });
            });
    });
};

// increment to total number of wins
exports.incrementPlayerLeaderboard = function (req, res) {
    let username = req.params.username.toLowerCase();
    UserModel.findByIdAndUpdate(username, { $inc: { wins: 1 } }, function(err, result) {
        if (err) return res.status(500).end(err);
        res.json(result);
    });
};

const GAME_HISTORY_PAGE_SIZE = 10;

// gets given player's game history
exports.getPlayerHistory = function(req, res) {
    let page = parseInt(req.query.page) || 0;
    let username = req.username.toLowerCase();
    ScoreModel.find({ player: username })
        .sort({ createdAt: -1 })
        .skip(page * GAME_HISTORY_PAGE_SIZE)
        .limit(GAME_HISTORY_PAGE_SIZE)
        .exec(function(err, history) {
            if (err) return res.status(500).end(err);
            return res.json(history);
        });
};

// adds player score
exports.addPlayerScore = function(req, res) {
    let player = req.params.username.toLowerCase();
    let gameId = req.params.gameId;
    let score = parseInt(req.body.score);
    ScoreModel.create({ player, gameId, score }, function(err, result) {
        if (err) return res.status(500).end(err);
        UserModel.findOneAndUpdate(player, { $inc: { score: score } }, function (err, result) {
            return res.json(result);
        });
    });
};

exports.getScore = function(req, res) {
    let username = req.params.username.toLowerCase();
    let gameId = req.params.gameId;
    ScoreModel.findOne({ player: username, gameId: gameId }, function(err, result) {
        if (err) return res.status(500).end(err);
        return res.json(result.score);
    });
};
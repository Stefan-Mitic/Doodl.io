/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const GameModel = mongoose.model('Game');
const UserModel = mongoose.model('User');
const crypto = require("crypto");
//TODO: Delete game, update score



exports.createGame = function(req, res) {
    let id = crypto.randomBytes(15).toString('hex');
    GameModel.create({
        _id: id,
        rounds: req.body.rounds,
        started: false
    }).then(function(game) {
        return res.json(game._id);
    }).catch(function(err) {
        return res.status(500).end(err);
    });
};

exports.startGame = function(req, res) {
    GameModel.findOne({ _id: req.body.id }, function(err, game) {
        if (err) return res.status(500).end(err);
        GameModel.updateOne({ _id: req.body.id }, { $set: { started: true } },
            function(err, result) {
                if (err) return res.status(500).end(err);
                res.json(result);
            });
    });
};

exports.addPlayer = function(req, res) {
    GameModel.findOne({ _id: req.body.id }, function(err, game) {
        if (err) return res.status(500).end(err);
        let players = game.players;
        players.push(req.body.username);
        // Won't allow more than 4 players
        if (game.players.length > 4) return res.status(409).end("Lobby full");
        GameModel.updateOne({ _id: req.body.id }, { $set: { players: players } },
            function(err, result) {
                if (err) return res.status(500).end(err);
                res.json(result);
            });
    });
};

exports.removePlayer = function(req, res) {
    GameModel.findOne({ _id: req.body.id }, function(err, game) {
        if (err) return res.status(500).end(err);
        let players = game.players;
        let index = players.indexOf(req.username);
        if (index !== -1) players.splice(index, 1);
        GameModel.updateOne({ _id: req.body.id }, { $set: { players: players } },
            function(err, result) {
                if (err) return res.status(500).end(err);
                res.json(result);
            });
    });
};

exports.getPlayers = function(req, res) {
    GameModel.findOne({ _id: req.params.id }, function(err, game) {
        if (err) return res.status(500).end(err);
        res.json(game.players);
    });
};
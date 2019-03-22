/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const GameModel = mongoose.model('Game');
const UserModel = mongoose.model('User');
const ImageModel = mongoose.model('Image');
const crypto = require("crypto");
//TODO: Delete game, update score

exports.createGame = function(req, res) {
    let id = crypto.randomBytes(15).toString('hex');
    GameModel.create({
        _id: id,
        players: [req.body.username],
        started: false
    }).then(function(game) {
        return res.json(game._id);
    }).catch(function(err) {
        return res.status(500).end(err);
    });
};

exports.startGame = function(req, res) {
    let rounds = parseInt(req.body.rounds);
    ImageModel.aggregate([{ $sample: { size: rounds } }], function(err, images) {
        if (err) return res.status(500).end(err);
        images = images.map(image => image._id);
        GameModel.findOne({ _id: req.body.id }, function(err, game) {
            if (err) return res.status(500).end(err);
            GameModel.updateOne({ _id: req.body.id }, { $set: { started: true, images: images, rounds: rounds } },
                function(err, result) {
                    if (err) return res.status(500).end(err);
                    res.json(result);
                });
        });
    });

};

exports.getNextImage = function(req, res) {
    GameModel.findOne({ _id: req.params.id }, function(err, game) {
        if (err) return res.status(500).end(err);
        let currRound = game.currRound;
        GameModel.updateOne({ _id: req.params.id }, { $inc: { currRound: 1 } }, function(err, result) {
            if (err) return res.status(500).end(err);
            res.json(game.images[currRound]);
        });
    });
};

exports.addPlayer = function(req, res) {
    GameModel.findOne({ _id: req.body.gameId }, function(err, game) {
        if (err) return res.status(500).end(err);
        let players = game.players;
        players.push(req.body.username);
        // Won't allow more than 4 players
        if (game.players.length > 4) return res.status(409).end("Lobby full");
        GameModel.updateOne({ _id: req.body.gameId }, { $set: { players: players } },
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

exports.getGame = function(req, res) {
    GameModel.findOne({ _id: req.params.id }, function(err, game) {
        if (err) return res.status(500).end(err);
        res.json(game);
    });
};
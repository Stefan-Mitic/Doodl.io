/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const auth = require('../middlewares/authentication');
const crypto = require('../middlewares/cryptography');
const GameRequestModel = mongoose.model('GameRequest');

/**
 * Exported functions.
 */

// gets a specific user by username
exports.getUser = function(req, res) {
    let username = req.params.username.toLowerCase();
    UserModel.findById(username, { hash: 0, salt: 0, friends: 0 }, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(404).end(`username ${username} does not exist`);
        return res.json(user);
    });
};

const USER_PAGE_SIZE = 10;

// gets a paginated list of usernames
exports.getUsers = function(req, res) {
    let page = parseInt(req.params.page) || 0;
    UserModel.distinct("_id", {})
        .sort({ createdAt: -1 })
        .skip(page * USER_PAGE_SIZE)
        .limit(USER_PAGE_SIZE)
        .exec(function(err, users) {
            if (err) return res.status(500).end(err);
            return res.json(users.map(user => user._id));
        });
};

// creates a new user
exports.signup = function(req, res) {
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    // check if username already exists
    UserModel.findById(username, function(err, user) {
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end(`username ${username} already exists`);
        let salt = crypto.generateSalt();
        let hash = crypto.generateHash(password, salt);
        // insert new user into database
        UserModel.updateOne({ _id: username }, { _id: username, name: username, salt, hash }, { upsert: true }, function(err) {
            if (err) return res.status(500).end(err);
            // start a session
            req.session.username = username;
            res.setHeader('Set-Cookie', auth.setCookie(username));
            return res.json(username);
        });
    });
};

// authenticates a user into the application
exports.signin = function(req, res) {
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    // retrieve user from the database
    UserModel.findById(username, { name: 1, hash: 1, salt: 1 }, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("access denied");
        let hash = crypto.generateHash(password, user.salt);
        if (user.hash !== hash) return res.status(401).end("access denied"); // invalid password
        // start a session
        req.session.username = user._id;
        res.setHeader('Set-Cookie', auth.setCookie(user._id));
        return res.json({ username: username, name: user.name });
    });
};

// signs the user out of the application
exports.signout = function(req, res) {
    req.session.destroy();
    res.setHeader('Set-Cookie', auth.setCookie(''));
    return res.json('successful');
};

// updates the user's display name
exports.updateName = function(req, res) {
    let username = req.username;
    let new_name = req.body.name;
    // check if the new name is not already used
    UserModel.findOne({ name: new_name }, { _id: 1, name: 1 }, function(err, user) {
        if (err) return res.status(500).end(err);
        if (user !== null && user._id === username) return res.status(204);
        if (user) return res.status(409).end(`name ${new_name} is already used`);
        // update name
        UserModel.updateOne({ _id: username }, { $set: { name: new_name } }, function(err, result) {
            if (err) return res.status(500).end(err);
            res.json(result);
        });
    });
};

// updates the user's password
exports.updatePassword = function(req, res) {
    let username = req.username;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    // retrieve user from the database
    UserModel.findById(username, { hash: 1, salt: 1 }, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("access denied");
        let hash = crypto.generateHash(oldPassword, user.salt);
        if (user.hash !== hash) return res.status(401).end("access denied"); // invalid password
        // create new salt and hash password
        let salt = crypto.generateSalt();
        let newHash = crypto.generateHash(newPassword, salt);
        UserModel.findByIdAndUpdate(username, { $set: { hash: newHash, salt } }, function(err, result) {
            if (err) return res.status(500).end(err);
            return res.json(result);
        });
    });
};

exports.sendGameRequest = function(req, res) {
    let requester = req.username;
    let gameId = req.body.gameId;
    let recipient = req.query.target;

    // check if recipient exists
    UserModel.findById(recipient, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end(`User ${recipient} does not exist`);
        GameRequestModel.updateOne({}, { requester, recipient, gameId }, { upsert: true }, function(err, raw) {
            if (err) return res.status(500).end(err);
            return res.json(raw);
        });
    });
};

exports.getGameRequests = function(req, res) {
    let username = req.params.username;
    GameRequestModel
        .find({ recipient: username }, { _id: 0, __v: 0 })
        .exec(function(err, results) {
            if (err) return res.status(500).end(err);
            res.json(results);
        });
};
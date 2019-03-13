/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const auth = require('../middlewares/authentication');
const crypto = require('../middlewares/cryptography');

/**
 * Exported functions.
 */

const USER_PAGE_SIZE = 10;

exports.getUsers = function (req, res) {
    let page = parseInt(req.params.page) || 0;
    UserModel.find({})
        .skip(page * USER_PAGE_SIZE)
        .limit(USER_PAGE_SIZE)
        .exec(function (err, users) {
            if (err) return res.status(500).end(err);
            return res.json(users.map(user => user.username));
        });
};

exports.signup = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    UserModel.findOne({ username }, function (err, user) {
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end("username " + username + " already exists");
        let salt = crypto.generateSalt();
        let hash = crypto.generateHash(password, salt);
        UserModel.updateOne({ username: username }, { username: username, salt, hash }, { upsert: true }, function (err) {
            if (err) return res.status(500).end(err);
            return res.json("user " + username + " signed up");
        });
    });
};

exports.login = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // retrieve user from the database
    UserModel.findOne({ username: username }, function (err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("access denied");
        let hash = crypto.generateHash(password, user.salt);
        if (user.hash !== hash) return res.status(401).end("access denied"); // invalid password
        // start a session
        req.session.username = user.username;
        res.setHeader('Set-Cookie', auth.setCookie(user.username));
        return res.json("user " + username + " signed in");
    });
};

exports.logout = function (req, res) {
    req.session.destroy();
    res.setHeader('Set-Cookie', auth.setCookie(''));
    res.redirect('/');
};

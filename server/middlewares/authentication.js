/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const session = require('express-session');
const cookie = require('cookie');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/doodlio', { useNewUrlParser: true });

/**
 * Exported helper functions
 */

 // session authentication settings
exports.sessionSettings = session({
    secret: 'It really do be like that.',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    }
});

// returns cookie settings for cookie header
exports.setCookie = function (username) {
    if (!username) username = '';
    return cookie.serialize('username', username, {
        path : '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    });
};

/**
 * Exported middleware functions
 */

exports.setUsername = function (req, res, next) {
    req.username = (req.session.username) ? req.session.username : null;
    if (req.body.dataURL) {
        let smallbody = { imageId: req.body.imageId, gameId: req.body.gameId };
        console.log("HTTP request", req.username, req.method, req.url, smallbody);
    } else {
        console.log("HTTP request", req.username, req.method, req.url, req.body);
    }
    next();
};

exports.isAuthenticated = function (req, res, next) {
    if (!req.username) return res.status(401).end("Access denied");
    next();
};

exports.isUnauthenticated = function (req, res, next) {
    if (req.username) return res.status(401).end("User must be logged out");
    next();
};

exports.isOwnUser = function (req, res, next) {
    let current = req.username;
    let target = req.params.username;
    if (current !== target) return res.status(401).end("Access denied");
    next();
};

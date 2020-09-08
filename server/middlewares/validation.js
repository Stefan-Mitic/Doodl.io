/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const isValidId = require('mongodb').ObjectID.isValid;
const validator = require('validator');

/**
 * Exported middleware functions
 */

// checks if username is valid
exports.checkUsername = function (req, res, next) {
    let username = req.body.username;
    if (!username) return res.status(400).end("bad input");
    let valid = validator.isAlphanumeric(username) &&
        username.length >= 3;
    if (!valid) return res.status(400).end("username is not valid");
    next();
};

// checks if password is valid
exports.checkPassword = function (req, res, next) {
    let password = req.body.password;
    if (!password) return res.status(400).end("bad input");
    let valid = password.length >= 6;
    if (!valid) return res.status(400).end("password is not valid");
    next();
};

// checks if display name is valid
exports.checkDisplayName = function (req, res, next) {
    let displayname = req.body.name;
    if (!displayname) return res.status(400).end("bad input");
    let valid = validator.isAlphanumeric(displayname) &&
        displayname.length >= 3;
    if (!valid) return res.status(400).end("display name is not valid");
    next();
};

// checks if email is valid
exports.checkEmail = function(req, res, next) {
    let email = req.body.email;
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) return res.status(400).end("email is not valid");
    next();
};

// modifies the input to ensure that it is valid, prevents frontend attacks
exports.sanitizeContent = function (req, res, next) {
    req.body.content = validator.escape(req.body.content);
    next();
};

// checks if id is a valid MongoDB id
exports.checkId = function (req, res, next) {
    let objectId = req.params.id;
    if (!objectId) return res.status(400).end("id is required");
    let validId = isValidId(objectId);
    if (!validId) return res.status(400).end("id is not a valid object id");
    next();
};

// checks if id in JSON body is a valid MongoDB id
exports.checkBodyId = function (req, res, next) {
    let objectId = req.body.id;
    if (!objectId) return res.status(400).end("id is required");
    let validId = isValidId(objectId);
    if (!validId) return res.status(400).end("id is not a valid object id");
    next();
};

// checks if game id is valid
exports.checkGameId = function (req, res, next) {
    let gameId = req.body.id;
    if (!gameId) return res.status(400).end("game id is required");
    let validId = validator.isAlphanumeric(gameId) && gameId.length >= 24;
    if (!validId) return res.status(400).end("game id is not valid");
    next();
};

// checks if game id in JSON body is valid
exports.checkBodyGameId = function (req, res, next) {
    let gameId = req.body.id;
    if (!gameId) return res.status(400).end("game id is required");
    let validId = validator.isAlphanumeric(gameId) && gameId.length >= 24;
    if (!validId) return res.status(400).end("game id is not valid");
    next();
};

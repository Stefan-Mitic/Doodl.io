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
    let validUsername = validator.isAlphanumeric(username);
    validUsername = validUsername && username.length >= 3;
    if (!validUsername) return res.status(400).end("username too short");
    next();
};

// checks if password is valid
exports.checkPassword = function (req, res, next) {
    let password = req.body.password;
    if (!password) return res.status(400).end("bad input");
    next();
};

// checks if display name is valid
exports.checkDisplayName = function (req, res, next) {
    let displayname = req.body.name;
    if (!displayname) return res.status(400).end("bad input");
    let validName = validator.isAlphanumeric(displayname);
    validName = validName && displayname.length >= 3;
    if (!validName) return res.status(400).end("display name too short"); 
    next();
};

// modifies the input to ensure that it is valid, prevents frontend attacks
exports.sanitizeContent = function (req, res, next) {
    req.body.content = validator.escape(req.body.content);
    next();
};

// checks if id is valid
exports.checkId = function (req, res, next) {
    let validId = isValidId(req.params.id);
    if (!validId) return res.status(400).end("bad input");
    next();
};

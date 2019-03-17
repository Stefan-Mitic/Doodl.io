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
exports.checkPassword = function (field) {
    if (!field) field = "password";
    return function (req, res, next) {
        let password = req.body[field];
        if (!password) return res.status(400).end("bad input");
        let valid = password.length <= 6;
        if (!valid) return res.status(400).end("password is not valid");
        next();
    }
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

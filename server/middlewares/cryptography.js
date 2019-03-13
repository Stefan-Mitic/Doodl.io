/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const crypto = require('crypto');

exports.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

exports.generateHash = function (plaintext, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(plaintext);
    return hash.digest('base64');
};

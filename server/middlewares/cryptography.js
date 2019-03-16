/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const crypto = require('crypto');

// generates a random salt of 16 bytes
exports.generateSalt = function () {
    return crypto.randomBytes(16)
        .toString('base64');
};

// generates a SHA-512 hash encoded in base64
exports.generateHash = function (plaintext, salt) {
    return crypto.createHmac('sha512', salt)
        .update(plaintext)
        .digest('base64');
};

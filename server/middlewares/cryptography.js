/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const crypto = require('crypto');

/**
 * Exported helper functions
 */

// generates a random string in hex
exports.generateRandomBytes = function (bytes) {
    return crypto.randomBytes(bytes)
        .toString('hex');
};

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

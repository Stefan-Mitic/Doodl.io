/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const FriendRequestModel = mongoose.model('FriendRequest');

// sends a new friend request
exports.send = function (req, res) {
    let requester = req.username;
    let recipient = req.params.recipient;
};

// get sent friend requests
exports.getSentRequests = function (req, res) {
    let username = req.username;
};

// get recieved friend requests
exports.getRecievedRequests = function (req, res) {
    let username = req.username;
};

// removes a sent friend request
exports.removeRequest = function (req, res) {
    let requester = req.username;
    let recipient = req.params.recipient;
};

// accept a friend request
exports.acceptRequest = function (req, res) {
    let requester = req.username;
    let recipient = req.params.recipient;
};

// reject a friend request
exports.rejectRequest = function (req, res) {
    let requester = req.username;
    let recipient = req.params.recipient;
};

const FRIENDS_PAGE_SIZE = 10;

// get paginated list of friends
exports.getFriends = function (req, res) {
    let username = req.username;
};

// remove a friend
exports.removeFriend = function (req, res) {
    let username = req.username;
    let friend = req.params.friend;
};

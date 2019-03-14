/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const FriendRequestModel = mongoose.model('FriendRequest');


const checkUserExists = function (username) {
    return new Promise(function (resolve, reject) {
        UserModel.findOne({ username: username }, function (err, user) {
            if (err) return reject(err);
            if (!user) return reject(`User ${username} does not exist`);
            return resolve(user);
        });
    });
};

const checkRequestExists = function (requester, recipient) {
    return new Promise(function (resolve, reject) {
        FriendRequestModel.findOne({ requester, recipient }, function (err, result) {
            if (err) return reject(err);
            if (!result) return reject (`Friend request from ${requester} to ${recipient} does not exist`);
            return resolve(result);
        });
    });
};

// sends a new friend request (TODO: fix callback hell)
exports.send = function (req, res) {
    let requester = req.username;
    let recipient = req.params.recipient;

    // check if recipient exists
    UserModel.findOne({ username: recipient }, function (err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end(`User ${recipient} does not exist`);

        // check if requester is already friends with recipient
        if (user.friends.includes(recipient)) return res.status(401).end(`User ${recipient} is already a friend`);

        // check if friend request was already sent
        FriendRequestModel.findOne({ requester, recipient }, function (err, freq) {
            if (err) return res.status(500).end(err);
            if (freq) return res.status(401).end(`Friend request for ${recipient} already exists`);

            FriendRequestModel.updateOne({}, { requester, recipient }, { upsert: true }, function (err, raw) {
                if (err) return res.status(500).end(err);
                return res.json(raw);
            });

        });

    });

};

// get sent friend requests (TODO: pagination)
exports.getSentRequests = function (req, res) {
    let username = req.username;
    FriendRequestModel.findOne({ requester: username }, function (err, results) {
        if (err) return res.status(500).end(err);
        res.json(results);
    });
};

// get recieved friend requests (TODO: pagination)
exports.getRecievedRequests = function (req, res) {
    let username = req.username;
    FriendRequestModel.findOne({ recipient: username }, function (err, results) {
        if (err) return res.status(500).end(err);
        res.json(results);
    });
};

// removes a sent friend request
exports.removeRequest = function (req, res) {
    let requester = req.username;
    let recipient = req.params.recipient;

    FriendRequestModel.findOne({ requester, recipient }, function (err, freq) {
        if (err) return res.status(500).end(err);
        if (!freq) return res.status(401).end(`Friend request for ${recipient} does not exist`);

        FriendRequestModel.findOneAndRemove({ requester, recipient }, function (err, freq) {
            if (err) return res.status(500).end(err);
            return res.json(freq);
        });

    });

};

// accept a friend request
exports.acceptRequest = function (req, res) {
    let requester = req.username;
    let recipient = req.params.recipient;

    FriendRequestModel.findOne({ requester, recipient }, function (err, freq) {
        if (err) return res.status(500).end(err);
        if (!freq) return res.status(401).end(`Friend request for ${recipient} does not exist`);

        // TODO: find both users and add friends to each other

        FriendRequestModel.findOneAndRemove({ requester, recipient }, function (err, freq) {
            if (err) return res.status(500).end(err);
            return res.json(freq);
        });

    });
};

// reject a friend request
exports.rejectRequest = function (req, res) {
    let requester = req.params.requester;
    let recipient = req.username;

    FriendRequestModel.findOne({ requester, recipient }, function (err, freq) {
        if (err) return res.status(500).end(err);
        if (!freq) return res.status(401).end(`Friend request for ${recipient} does not exist`);

        FriendRequestModel.findOneAndRemove({ requester, recipient }, function (err, freq) {
            if (err) return res.status(500).end(err);
            return res.json(freq);
        });

    });
};

// get list of friends
exports.getFriends = function (req, res) {
    let username = req.username;
    UserModel.findOne({ username: username }, function (err, user) {
        if (err) return res.status(500).end(err);
        res.json(user.friends);
    });
};

// remove a friend
exports.removeFriend = function (req, res) {
    let username = req.username;
    let friend = req.params.friend;

    

};

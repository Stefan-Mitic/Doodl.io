/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const FriendRequestModel = mongoose.model('FriendRequest');

// TODO: fix callback hells with promises

const getUser = function (username) {
    return new Promise(function (resolve, reject) {
        UserModel.findById(username, function (err, user) {
            if (err) return reject(err);
            if (!user) return reject(`User ${username} does not exist`);
            return resolve(user);
        });
    });
};

const addFriend = function (username, friend) {
    return new Promise(function (resolve, reject) {
        UserModel.updateOne({ _id: username }, { $push: { friends: friend } }, function (err, result) {
            if (err) return reject(err);
            return resolve(result);
        });
    });
};

const removeFriend = function (username, friend) {
    return new Promise(function (resolve, reject) {
        UserModel.updateOne({ _id: username }, { $pull: { friends: friend } }, function (err, result) {
            if (err) return reject(err);
            return resolve(result);
        });
    });
};

const getFriendRequest = function (requester, recipient) {
    return new Promise(function (resolve, reject) {
        FriendRequestModel.findOne({ requester, recipient }, function (err, result) {
            if (err) return reject(err);
            if (!result) return reject (`Friend request from ${requester} to ${recipient} does not exist`);
            return resolve(result);
        });
    });
};

// sends a new friend request (TODO: fix callback hell)
exports.sendRequest = function (req, res) {
    let requester = req.username;
    let recipient = req.query.target;

    // check if recipient exists
    UserModel.findById(recipient, function (err, user) {
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

const FR_PAGE_SIZE = 5;

// get sent friend requests (TODO: pagination)
exports.getSentRequests = function (req, res) {
    let page = parseInt(req.query.page) || 0;
    let username = req.username;
    FriendRequestModel
        .find({ requester: username }, { _id: 0, __v: 0 })
        .skip(page * FR_PAGE_SIZE)
        .limit(FR_PAGE_SIZE)
        .exec(function (err, results) {
            if (err) return res.status(500).end(err);
            res.json(results);
        });
};

// get recieved friend requests (TODO: pagination)
exports.getRecievedRequests = function (req, res) {
    let page = parseInt(req.query.page) || 0;
    let username = req.username;
    FriendRequestModel
        .find({ recipient: username }, { _id: 0, __v: 0 })
        .skip(page * FR_PAGE_SIZE)
        .limit(FR_PAGE_SIZE)
        .exec(function (err, results) {
            if (err) return res.status(500).end(err);
            res.json(results);
        });
};

// removes a sent friend request
exports.removeRequest = function (req, res) {
    let requester = req.username;
    let recipient = req.query.target;

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
    let recipient = req.username;
    let requester = req.query.target;

    // check if friend request exists
    FriendRequestModel.findOne({ requester, recipient }, function (err, freq) {
        if (err) return res.status(500).end(err);
        if (!freq) return res.status(404).end(`Friend request for ${recipient} does not exist`);

        // remove friend request from database
        FriendRequestModel.findOneAndRemove({ requester, recipient }, function (err, freq) {
            if (err) return res.status(500).end(err);
            
            // add to user's friend list
            UserModel.updateOne({ _id: requester }, { $push: { friends: recipient } }, function (err, raw) {
                if (err) return res.status(500).end(err);

                // add to from target's friend list
                UserModel.updateOne({ _id: recipient }, { $push: { friends: requester }}, function (err, raw) {
                    if (err) return res.status(500).end(err);
                    return res.json(`User ${recipient} is now friends with ${requester}.`);
                });

            });
            
        });

    });
};

// reject a friend request
exports.rejectRequest = function (req, res) {
    let requester = req.query.target;
    let recipient = req.username;

    // check if friend request exists
    FriendRequestModel.findOne({ requester, recipient }, function (err, freq) {
        if (err) return res.status(500).end(err);
        if (!freq) return res.status(401).end(`Friend request for ${recipient} does not exist`);

        // remove friend request from database
        FriendRequestModel.findOneAndRemove({ requester, recipient }, function (err, freq) {
            if (err) return res.status(500).end(err);
            return res.json(freq);
        });

    });
};

const FRIENDS_PAGE_SIZE = 5;

// get list of friends
exports.getFriends = function (req, res) {
    let page = parseInt(req.query.page) || 0;
    let username = req.username;
    let si0 = page * FRIENDS_PAGE_SIZE;
    let si1 = si0 + FRIENDS_PAGE_SIZE;
    UserModel.findById({ _id: username },{ _id: 0, friends: { $slice: [si0, si1] } }, function (err, user) {
        if (err) return res.status(500).end(err);
        return res.json(user.friends);
    });
};

// remove a friend
exports.unfriend = function (req, res) {
    let username = req.username;
    let friend = req.query.target;

    // check if the friend exists as a user in first place
    UserModel.findById(username, function (err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(404).end(`User ${username} does not exist.`);

        // check if user is friends with target in first place
        UserModel.findOne({ _id: username, friends: friend }, function (err, user) {
            if (err) return res.status(500).end(err);
            if (!user) return res.status(404).end(`User ${username} is not friends with ${friend}.`);

            // remove from user's friend list
            UserModel.updateOne({ _id: username }, { $pull: { friends: friend }}, function (err, raw) {
                if (err) return res.status(500).end(err);

                // remove user from target's friend list
                UserModel.updateOne({ _id: friend }, { $pull: { friends: username }}, function (err, raw) {
                    if (err) return res.status(500).end(err);
                    return res.json(`User ${username} ended friendship with ${friend}.`);
                });

            });

        });

    });
};

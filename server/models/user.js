const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: { // _id is the username
        type: String,
        required: true,
    },
    name: { // user's player display name
        type: String,
        default: ''
    },
    email: { // user's email
        type: String,
        default: ''
    },
    hash: { // salted hashed password
        type: String,
        required: true
    },
    salt: { // random salt of generated bytes
        type: String,
        required: true
    },
    friends: { // list of friends (usernames)
        type: [String],
        default: []
    },
    games: { // number of games played
        type: Number,
        default: 0
    },
    wins: { // number of games won
        type: Number,
        default: 0
    },
    score: { // total score this user has earned
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);
module.export = User;

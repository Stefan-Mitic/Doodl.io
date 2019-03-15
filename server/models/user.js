const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    username: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    friends: [String], // list of friends (usernames)
    games: { type: Number, default: 0 }, // number of games played
    wins: { type: Number, default: 0 },  // number of games won
});

const User = mongoose.model('User', UserSchema);
module.export = User;

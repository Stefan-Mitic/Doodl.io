const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    hash: {
        type: String
    },
    salt: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

let User = mongoose.model("User", UserSchema);

module.exports = {
    User: User
};

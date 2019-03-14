const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    username: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    friends: [String]
});

const User = mongoose.model('User', UserSchema);
module.export = User;

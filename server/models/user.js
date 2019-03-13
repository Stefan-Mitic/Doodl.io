const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    username: { type: String, default: '' },
    hash: { type: String, default: '' },
    salt: { type: String, default: '' }
});

const User = mongoose.model('User', UserSchema);
module.export = User;

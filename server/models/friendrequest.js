const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
    requester: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    }
});

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
module.export = FriendRequest;

const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
    requester: { // username of who sent the FR
        type: String,
        required: true,
        index: true,
    },
    recipient: { // username of who recieved the FR
        type: String,
        required: true,
        index: true,
    }
}, {
    timestamps: true
});

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
module.export = FriendRequest;

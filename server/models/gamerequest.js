const mongoose = require('mongoose');

const GameRequestSchema = new mongoose.Schema({
    requester: { // username of who sent the GR
        type: String,
        required: true,
        index: true,
    },
    recipient: { // username of who recieved the GR
        type: String,
        required: true,
        index: true,
    }
}, {
    timestamps: true
});

const GameRequest = mongoose.model('GameRequest', GameRequestSchema);
module.export = GameRequest;
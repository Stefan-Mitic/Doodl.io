const mongoose = require('mongoose');

const DrawingSchema = new mongoose.Schema({
    imageId: { // image that this drawing is based off of
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    gameId: { // game that this drawing is from
        type: String
    },
    player: { // username of player that drew the image
        type: String,
        required: true
    },
    file: { // contains the canvas drawing file metadata
        type: Object,
        required: true
    }
}, {
    timestamps: true
});

const Drawing = mongoose.model('Drawing', DrawingSchema);
module.export = Drawing;

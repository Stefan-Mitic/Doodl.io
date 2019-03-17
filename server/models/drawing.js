const mongoose = require('mongoose');

const DrawingSchema = new mongoose.Schema({
    imageId: { // image that this drawing is based off of
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    player: { // username of player that drew this
        type: String,
        required: true
    },
    // file: contains the actual canvas drawing image file
}, {
    timestamps: true
});

const Drawing = mongoose.model('Drawing', DrawingSchema);
module.export = Drawing;

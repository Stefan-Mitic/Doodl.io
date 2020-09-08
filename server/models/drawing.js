const mongoose = require('mongoose');

const DrawingSchema = new mongoose.Schema({
    gameId: { // game that this drawing is from
        type: String,
        default: '',
    },
    player: { // username of player that drew the image
        type: String,
        default: '',
    },
    file: { // contains the canvas drawing file metadata
        type: Object
    }
}, {
    timestamps: true
});

const Drawing = mongoose.model('Drawing', DrawingSchema);
module.export = Drawing;

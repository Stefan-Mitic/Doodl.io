const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    _id: { // Name of image
        type: String
    },
    isTrace: { // True if trace file, False if clipart
        type: Boolean,
        required: true
    },
    file: { // contains the image file metadata
        type: Object,
        required: true
    }
}, {
    timestamps: true
});

const Image = mongoose.model('Image', ImageSchema);
module.export = Image;
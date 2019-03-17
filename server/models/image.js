const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name: {
        type: String,
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

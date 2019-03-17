const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name: {
        type: String
    },
    // file: contains the actual image file
}, {
    timestamps: true
});

const Image = mongoose.model('Image', ImageSchema);
module.export = Image;

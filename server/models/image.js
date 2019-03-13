const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name: String,
    date: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', ImageSchema);
module.export = Image;

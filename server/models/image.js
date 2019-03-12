const mongoose = require("mongoose");

let ImageSchema = new mongoose.Schema({
    name: String,
    date: { type: Date, default: Date.now }
});

let Image = mongoose.model("Image", ImageSchema);

module.exports = {
    Image: Image
};

/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ImageModel = mongoose.model('Image');

// initialize database if empty
ImageModel.count(function (err, count) {
    if (err) return console.log(err);
    if (count === 0) {
        populateImageDB();
        console.log("Image database initialized");
    }
});

// populates the clipart image database
function populateImageDB() {
    let clipartsPath = path.join(__dirname, '../assets/cliparts');
    // read through each clipart
    fs.readdir(clipartsPath, function (err, filenames) {
        if (err) return console.log(err);
        filenames.forEach(function (filename, index) {
            let name = filename.split('.').slice(0, -1).join('.');
            let filepath = path.join(clipartsPath, filename);
            let imagedata = {
                name: name,
                file: { mimetype: 'image/png', destination: clipartsPath, filename: filename, path: filepath }
            };
            ImageModel.create(imagedata, function (err, raw) {
                if (err) return console.log(err);
                return console.log(raw);
            });
        });
    });
}

exports.addImage = function (req, res) {
    ImageModel.create({
        name: req.body.name,
        file: req.file
    }).then(function (image) {
        return res.json(image);
    }).catch(function (err) {
        return res.status(500).end(err);
    });
};

exports.deleteImage = function (req, res) {
    let imageId = req.params.id;
    // check if image exists
    ImageModel.findById(imageId, function (err, image) {
        if (err) return res.status(500).end(err);
        if (!image) return res.status(404).end(`Image id: ${imageId} does not exist`);
        ImageModel.findByIdAndRemove(imageId, function(err, num) {
            if (err) return res.status(500).end(err);
            fs.unlink(image.file.path, function (err) {
                if (err) return res.status(500).end(err);
                return res.json(image);
            });
        });
    });
};

exports.compare = function (req, res) {
    let imageId = req.params.id;
    // TODO: insert image comparison API here!
};

// gets a specific image file by id
exports.getImageById = function (req, res) {
    let imageId = req.params.id;
    ImageModel.findById(imageId, function (err, image) {
        if (err) return res.status(500).end(err);
        if (!image) return res.status(404).end("Image does not exist");
        let file = image.file;
        res.setHeader('Content-Type', file.mimetype);
        return res.sendFile(file.path);
    });
};

// gets a list of random image ids from the server (default 5)
exports.getRandomImages = function (req, res) {
    let num = parseInt(req.query.num) || 5;
    ImageModel.aggregate([{ $sample: { size: num } }], function (err, images) {
        if (err) return res.status(500).end(err);
        return res.json(images.map(image => image._id));
    });
};

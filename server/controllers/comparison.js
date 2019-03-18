// TODO: clean up file

/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ImageModel = mongoose.model('Image');
const DrawingModel = mongoose.model('Drawing');

const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const readImage = function (filepath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filepath, function (err, data) {
            if (err) return reject(err);
            return resolve(data);
        });
    });
};

exports.compareImages = function (req, res) {
    let filename1 = req.body.filename1;
    let filename2 = req.body.filename2;
    fs.readFile(filename1, function (err, data1) {
        if (err) res.status(500).end(err);
        let img1 = new PNG(data1);
        fs.readFile(filename2, function (err, data2) {
            if (err) res.status(500).end(err);
            let img2 = new PNG(data2);
            let diff = new PNG({width: img1.width, height: img1.height});
            let pixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
            res.json({
                image1: img1,
                image2: img2,
                difference: pixels,
            });
        });
    });
};

// TODO: get ready for some EXTREME CALLBACK HELL!
exports.gameCompare = function (req, res) {
    let imageId = req.params.id;
    let drawingId = req.body.drawingId;

    // find clipart image
    ImageModel.findById(imageId, function (err, image) {
        if (err) return res.status(500).end(err);
        if (!image) return res.status(404).end(`image id ${imageId} cannot be found`);

        // find drawing image
        DrawingModel.findById(drawingId, function (err, drawing) {
            if (err) return res.status(500).end(err);
            if (!drawing) return res.status(404).end(`drawing id ${drawingId} cannot be found`);

            // read clipart and drawing images into pngjs
            let img1 = fs.createReadStream(image.file.path).pipe(new PNG()).on('parsed', doneReading);
            let img2 = fs.createReadStream(drawing.file.path).pipe(new PNG()).on('parsed', doneReading);
            let filesRead = 0;

            // if both are done reading, compare for number of different pixels
            function doneReading() {
                if (++filesRead < 2) return;
                let diff = new PNG({width: img1.width, height: img1.height});
                let pixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
                return res.json({
                    imageId: image._id,
                    drawingId: drawing._id,
                    difference: pixels
                });
            }
        });

    });

};

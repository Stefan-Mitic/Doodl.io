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

    ImageModel.findById(imageId, function (err, image) {
        if (err) return res.status(500).end(err);

        fs.readFile(image.file.path, function (err, data1) {
            if (err) return res.status(500).end(err);
            let png1 = new PNG(data1);

            DrawingModel.findById(drawingId, function (err, drawing) {
                if (err) return res.status(500).end(err);

                fs.readFile(drawing.file.path, function (err, data2) {
                    if (err) return res.status(500).end(err);
                    let png2 = new PNG(data2);

                    let diff = new PNG({width: png1.width, height: png1.height});
                    let pixels = pixelmatch(png1.data, png2.data, diff.data, png1.width, png1.height, {threshold: 0.1});
                    return res.json({ image1: png1, image2: png2, difference: pixels, });

                });

            });

        });

    });
};

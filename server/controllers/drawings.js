/* jshint node: true */
"use strict";

/**
 * Module dependencies.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const DrawingModel = mongoose.model('Drawing');

const crypto = require("crypto");
function generateRandomBytes() {
    return crypto.randomBytes(20).toString('hex');
}

exports.addDrawing = function (req, res) {
    // generate filename and path
    let filename = generateRandomBytes();
    let drawingspath = path.join(__dirname, '../usersubmit/drawings');
    let filepath = path.join(drawingspath, filename);
    // create canvas drawing object to store
    let drawingdata = {
        player: req.username,
        imageId: req.body.imageId,
        gameId: req.body.gameId,
        file: { mimetype: 'image/png', destination: drawingspath, filename: filename, path: filepath }
    };
    // store canvas drawing object to DB
    DrawingModel.create(drawingdata, function (err, result) {
        if (err) return res.status(drawingdata);
        return res.json(result);
    });
    // save the drawing file to backend
    let dataURL = req.body.dataURL;
    let pngdata = dataURL.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFile(filepath, new Buffer(pngdata, 'base64')); 
};

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

// get drawing by id (TODO: authorization, right now any user can get a drawing)
exports.getDrawing = function (req, res) {
    let drawingId = req.params.id;
    DrawingModel.findById(drawingId, { __v: 0, file: 0 }, function (err, drawing) {
        if (err) return res.status(500).end(err);
        if (!drawing) return res.status(404).end(`drawing id ${drawingId} does not exist`);
        return res.json(drawing);
    });
};

// get drawing file by id (TODO: authorization, right now any user can get a drawing)
exports.getDrawingFile = function (req, res) {
    let drawingId = req.params.id;
    DrawingModel.findById(drawingId, function (err, drawing) {
        if (err) return res.status(500).end(err);
        if (!drawing) return res.status(404).end(`drawing id ${drawingId} does not exist`);
        res.setHeader('Content-Type', drawing.file.mimetype);
        return res.sendFile(drawing.file.path);
    });
};

// add a new drawing
exports.addDrawing = function (req, res) {
    // extract request values
    let player = req.username || "";
    let imageId = req.body.imageId;
    let gameId = req.body.gameId;
    let dataURL = req.body.dataURL;
    // generate filename and path
    let filename = generateRandomBytes();
    let drawingspath = path.join(__dirname, '../usersubmit/drawings');
    let filepath = path.join(drawingspath, filename);
    // create canvas drawing object to store
    let drawingdata = {
        player, imageId, gameId,
        file: { mimetype: 'image/png', destination: drawingspath, filename, path: filepath }
    };
    // store canvas drawing object to DB
    DrawingModel.create(drawingdata, function (err, result) {
        if (err) return res.status(500).end(err);
        // save the drawing file to backend
        let pngdata = dataURL.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFile(filepath, new Buffer(pngdata, 'base64'), function (err) {
            if (err) return res.status(500).end(err);
            return res.json(result);
        }); 
    });
};

// remove drawing by id (TODO: authorization, right now any user can delete a drawing)
exports.removeDrawing = function (req, res) {
    let drawingId = req.params.id;
    // check if drawing exists
    DrawingModel.findById(drawingId, function (err, drawing) {
        if (err) return res.status(500).end(err);
        if (!drawing) return res.status(404).end(`drawing id ${drawingId} does not exist`); 
        // remove drawing from db
        DrawingModel.findByIdAndRemove(drawingId, function(err, result) {
            if (err) return res.status(500).end(err);
            // delete drawing from filesystem
            fs.unlink(drawing.file.path, function (err) {
                if (err) return res.status(500).end(err);
                return res.json(result);
            });
        });
    });
};

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// mongodb middleware
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/doodlio', { useNewUrlParser: true });
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// entry for game image
const ImageModel = mongoose.model('image', new Schema({
    name: String,
    date: { type: Date, default: Date.now }
}));

// middleware module to handle multipart/form-data 
const multer = require('multer');
let upload = multer({
    dest: path.join(__dirname, 'uploads')
});

// middleware module to handle HTTP POST data
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// display requests
app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

/* CREATE */

// add an image
app.post('/api/game/images/', upload.single('picture'), function (req, res, next) {
    console.log(req.file);
    ImageModel.create({
        name: req.body.name,
        file: req.file
    });
});

// post image to compare
app.post('/api/game/images/:id/compare/', upload.single('picture'), function (req, res, next) {
    let imageId = req.params.id;
    let file = req.file;
    // insert image comparison API here!
});

/* READ */

// get specific main image
app.get('/api/game/images/:id/', function (req, res, next) {
    let imageId = req.params.id;
    if (!mongodb.ObjectID.isValid(imageId)) return res.status(404).end("invalid id");
    ImageModel.findById(imageId, function (err, image) {
        if (err) return res.status(500).end(err);
        if (!image) return res.status(404).end("Image does not exist");
        res.setHeader('Content-Type', file.mimetype);
        return res.sendFile(file.path);
    });
});

// get set of random image ids of given size of num
app.get('/api/game/images/', function (req, res, next) {
    let num = parseInt(req.query.num) || 5;
    ImageModel.aggregate([{ $sample: { size: num } }], function (err, images) {
        if (err) return res.status(500).end(err);
        return res.json(images.map(image => image._id));
    });
});

// setup server
const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});

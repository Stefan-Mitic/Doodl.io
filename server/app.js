/* jshint node: true */
"use strict";

const path = require("path");
const fs = require("fs");
const bodyParser = require('body-parser');
const express = require("express");
const app = express();

// middleware dependencies
const validator = require('./middlewares/validation');
const auth = require('./middlewares/authentication');

// middleware module to handle multipart/form-data 
const multer  = require('multer');
let upload = multer({
    dest: path.join(__dirname, 'assets')
});

// setup middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(auth.sessionSettings);
app.use(auth.setUsername);

// connect to db
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/doodlio', { useNewUrlParser: true });

// initialize all models
const models = path.join(__dirname, './models');
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^.].*\.js$/))
    .forEach(file => require(path.join(models, file)));

// module dependencies
const users = require('./controllers/users');
const gameImages = require('./controllers/images');

// user authentication routes
app.post('/login', validator.checkUsername, users.login);
app.post('/signup', validator.checkUsername, validator.checkPassword, users.signup);
app.get('/logout', auth.isAuthenticated, users.logout);

// game image routes
app.get('/api/game/images/:id/compare/', validator.checkId, gameImages.compare);
app.get('/api/game/images/:id/', validator.checkId, gameImages.getImageById);
app.get('/api/game/images/', gameImages.getRandomImages);
app.post('/api/game/images/', upload.single('picture'), gameImages.addImage);
app.delete('/api/game/images/:id/', validator.checkId, gameImages.deleteImage);

// setup server
const http = require('http');
const PORT = 3000;
const server = http.createServer(app);
server.listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on https://localhost:%s", PORT);
});

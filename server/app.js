/* jshint node: true */
'use strict';

const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const socketIO = require('socket.io');

// middleware dependencies
const validator = require('./middlewares/validation');
const auth = require('./middlewares/authentication');

// middleware module to handle multipart/form-data
const multer = require('multer');
let upload = multer({ dest: path.join(__dirname, 'assets') });

// setup global middlewares
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
const friends = require('./controllers/friends');
const gameImages = require('./controllers/images');

// user authentication routes
app.post('/signin/', validator.checkUsername, users.signin);
app.post(
    '/signup/', validator.checkUsername, validator.checkPassword, users.signup);
app.get('/signout/', auth.isAuthenticated, users.signout);
app.get('/api/users/:username/', users.getUser);
app.get('/api/users/', users.getUsers);

// friend system routes
app.post('/api/users/friend/', auth.isAuthenticated, friends.sendRequest);
app.post(
    '/api/users/acceptrequest/', auth.isAuthenticated, friends.acceptRequest);
app.post(
    '/api/users/rejectrequest/', auth.isAuthenticated, friends.rejectRequest);
app.post('/api/users/unfriend/', auth.isAuthenticated, friends.unfriend);
app.get(
    '/api/users/:username/sentrequests/', auth.isAuthenticated, auth.isOwnUser,
    friends.getSentRequests);
app.get(
    '/api/users/:username/recievedrequests/', auth.isAuthenticated,
    auth.isOwnUser, friends.getRecievedRequests);
app.get(
    '/api/users/:username/friends/', auth.isAuthenticated, friends.getFriends);

// game image routes
app.get('/api/game/images/:id/compare/', validator.checkId, gameImages.compare);
app.get('/api/game/images/:id/', validator.checkId, gameImages.getImageById);
app.get('/api/game/images/', gameImages.getRandomImages);
app.post('/api/game/images/', upload.single('picture'), gameImages.addImage);
app.delete('/api/game/images/:id/', validator.checkId, gameImages.deleteImage);

// setup server
const http = require('http');
const PORT = 5000;
const server = http.createServer(app);
const io = socketIO(server);

// SOCKETIO ===================================================================

// Dependencies
const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/realstring');

let lobbies = {};

io.on('connection', function(socket) {
    console.log('User connected');
    let sessionid = socket.id;

    socket.on('join', function(params, callback) {
        // room id
        if (!isRealString(params.gameId)) {
            callback('Username and game id are required.');
        }
        socket.join(params.room);
        callback();
    });

    socket.on('createMessage', function(message, callback) {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
});

server.listen(PORT, function(err) {
    if (err)
        console.log(err);
    else
        console.log('HTTP server on https://localhost:%s', PORT);
});
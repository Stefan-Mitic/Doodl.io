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
const gameImages = require('./controllers/images');

// user authentication routes
app.post('/login', validator.checkUsername, users.login);
app.post(
    '/signup', validator.checkUsername, validator.checkPassword, users.signup);
app.get('/logout', auth.isAuthenticated, users.logout);
app.get('/api/users', users.getUsers);

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
const io = socketIO(server);

// SOCKETIO ===================================================================

let lobbies = {};

io.on('connection', socket => {
    console.log('User connected');
    let sessionid = socket.id;

    socket.on('join', (params, callback) => {
        // username and room id
        if (!isRealString(params.user) || !isRealString(params.gameId)) {
            callback('Username and game id are required.');
        }

        socket.emit(
            'newMessage', generateMessage('Admin', 'Successfully joined game.'));
        socket.broadcast.to(params.room)
            .emit(
                'newMessage',
                generateMessage('Admin', `${params.user} has joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, function(err) {
    if (err)
        console.log(err);
    else
        console.log('HTTP server on https://localhost:%s', PORT);
});
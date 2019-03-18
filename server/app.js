/* jshint node: true */
'use strict';

const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
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
app.use(cors());
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
const drawings = require('./controllers/drawings');
const games = require('./controllers/game');
const scores = require('./controllers/scores');
const comparison = require('./controllers/comparison');

// user authentication routes
app.post('/signin/', validator.checkUsername, users.signin);
app.post('/signup/', validator.checkUsername, validator.checkPassword, users.signup);
app.get('/signout/', auth.isAuthenticated, users.signout);
app.get('/api/users/:username/', users.getUser);
app.get('/api/users/', users.getUsers);
app.patch('/api/users/name/', auth.isAuthenticated, validator.checkDisplayName, users.updateName);
app.patch('/api/users/password/', auth.isAuthenticated, users.updatePassword);

// friend system routes
app.post('/api/users/friend/', auth.isAuthenticated, friends.sendRequest);
app.post('/api/users/acceptrequest/', auth.isAuthenticated, friends.acceptRequest);
app.post('/api/users/rejectrequest/', auth.isAuthenticated, friends.rejectRequest);
app.post('/api/users/unfriend/', auth.isAuthenticated, friends.unfriend);
app.get('/api/users/:username/sentrequests/', auth.isAuthenticated, auth.isOwnUser, friends.getSentRequests);
app.get('/api/users/:username/recievedrequests/', auth.isAuthenticated, auth.isOwnUser, friends.getRecievedRequests);
app.get('/api/users/:username/friends/', auth.isAuthenticated, friends.getFriends);

// leaderboard score routes
app.get('/api/leaderboard/', scores.getTopPlayers);
app.get('/api/leaderboard/me/', auth.isAuthenticated, scores.getPlayerLeaderboard);
app.get('/api/leaderboard/history/', auth.isAuthenticated, scores.getPlayerHistory);

// game image routes
app.get('/api/game/images/:id/', validator.checkId, gameImages.getImageById);
app.get('/api/game/images/', gameImages.getRandomImages);

// canvas drawing image routes
app.post('/api/drawings/', auth.isAuthenticated, drawings.addDrawing);
app.get('/api/drawings/:id/', auth.isAuthenticated, validator.checkId, drawings.getDrawing);
app.delete('/api/drawings/:id/', auth.isAuthenticated, validator.checkId, drawings.removeDrawing);

// image comparison routes
app.post('/api/game/images/:id/compare/', validator.checkId, comparison.gameCompare);

// game routes
app.post('/api/game/', games.createGame);
app.post('/api/game/start/', games.startGame);
app.patch('/api/game/join/', games.addPlayer);
app.get('/api/game/:id/players/', games.getPlayers);
app.get('/api/game/:id/', games.getGame);

// setup server
const http = require('http');
const PORT = 5000;
const server = http.createServer(app);
const io = socketIO(server);

// SOCKETIO ===================================================================

// Dependencies
const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/realstring');

io.on('connection', function(socket) {
    console.log('User connected ' + socket.id);
    socket.on('join', function(params, callback) {
        console.log("GameID: " + params.gameId);
        // room id
        if (!isRealString(params.gameId)) {
            callback('Game id is required');
        }
        socket.join(params.gameId);
        io.to(params.gameId).emit('updateUserList');
        socket.broadcast.to(params.gameId).emit('newMessage', generateMessage(`${params.username} has joined.`));
        callback();
    });

    socket.on('startGame', function(callback) {

    });

    socket.on('roundStart', function(params, counter) {
        let room = params.gameId;
        let countdown = setInterval(function() {
            io.to(room).emit('counter', counter);
            counter--;
            if (counter === 0) {
                io.to(room).emit('counter', "Time's up!");
                clearInterval(countdown);
            }
        }, 1000);
    });

    socket.on('createMessage', function(message, callback) {
        console.log('createMessage', message);
        io.to(params.gameId).emit('newMessage', generateMessage(message.from, message.text));
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
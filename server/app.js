/* jshint node: true */
'use strict';

const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const sharedsession = require('express-socket.io-session');

// server settings
const keys = require('./config/keys');

// connect to db
const mongoose = require('mongoose');
// keys.mongoURI
mongoose.connect('mongodb://localhost/doodlio', { useNewUrlParser: true, useCreateIndex: true });

// initialize all models
const models = path.join(__dirname, './models');
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^.].*\.js$/))
    .forEach(file => require(path.join(models, file)));

// middleware dependencies
const validator = require('./middlewares/validation');
const auth = require('./middlewares/authentication');

// setup global middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(auth.sessionSettings);
app.use(auth.setUsername);

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
app.get('/api/users/:username/', auth.isAuthenticated, users.getUser);
app.get('/api/users/', auth.isAuthenticated, users.getUsers);
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
app.get('/api/leaderboard/', auth.isAuthenticated, scores.getTopPlayers);
app.get('/api/leaderboard/me/', auth.isAuthenticated, scores.getPlayerLeaderboard);
app.get('/api/leaderboard/history/', auth.isAuthenticated, scores.getPlayerHistory);
app.patch('/api/leaderboard/:username/', auth.isAuthenticated, scores.incrementPlayerLeaderboard);
app.post('/api/leaderboard/:gameId/:username/', auth.isAuthenticated, scores.addPlayerScore);
app.get('/api/leaderboard/:gameId/:username/', auth.isAuthenticated, scores.getScore);

// game image routes
app.get('/api/game/images/:id/', auth.isAuthenticated, gameImages.getImage);
app.get('/api/game/images/:id/file/', auth.isAuthenticated, gameImages.getImageFile);

// canvas drawing image routes
app.post('/api/drawings/', auth.isAuthenticated,
    drawings.addDrawing);
app.get('/api/drawings/:id/', auth.isAuthenticated, validator.checkId, drawings.getDrawing);
app.get('/api/drawings/:id/file/', auth.isAuthenticated, validator.checkId, drawings.getDrawingFile);
app.delete('/api/drawings/:id/', auth.isAuthenticated, validator.checkId, drawings.removeDrawing);

// image comparison routes
app.post('/api/game/images/:id/compare/', auth.isAuthenticated, comparison.gameCompare);

// game routes
app.post('/api/game/', auth.isAuthenticated, games.createGame);
app.post('/api/game/start/', auth.isAuthenticated, games.startGame);
app.patch('/api/game/join/', auth.isAuthenticated, games.addPlayer);
app.get('/api/game/:id/players/', auth.isAuthenticated, games.getPlayers);
app.get('/api/game/:id/', auth.isAuthenticated, games.getGame);
app.get('/api/game/:id/nextImage/', auth.isAuthenticated, games.getNextImage);
app.patch('/api/game/nextRound/', auth.isAuthenticated, games.incrementRound);
app.patch('/api/game/removePlayer/', auth.isAuthenticated, games.removePlayer);
app.delete('/api/game/:id/', auth.isAuthenticated, games.deleteGame);

// Game Request routes
app.get('/api/users/:username/gamerequests/', auth.isAuthenticated, users.getGameRequests);
app.post('/api/users/gamerequest/', auth.isAuthenticated, users.sendGameRequest);

// setup server
const http = require('http');
const PORT = 5000;
const server = http.createServer(app);
const io = socketIO(server);

// SOCKETIO ===================================================================

// Dependencies
const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/realstring');

// use shared session middleware for socket.io
io.use(sharedsession(auth.sessionSettings, {
    autoSave: true
}));

io.on('connection', function(socket) {
    console.log('User connected ' + socket.id);
    socket.on('join', function(params, callback) {
        let gameId = params.gameId;
        let username = params.username;
        if (!isRealString(gameId)) {
            callback('Game id is required');
        }
        socket.join(gameId);
        socket.in(gameId).emit('updateUserList');
        io.in(gameId).emit('newMessage', generateMessage(username, `Joined room`));
        callback();
    });

    socket.on('startGame', function(gameId, callback) {
        socket.to(gameId).emit('gameStart');
    });

    socket.on('roundStart', function(room, counter) {
        let countdown = setInterval(function() {
            io.to(room).emit('counter', counter);
            counter--;
            if (counter === -1) {
                io.to(room).emit('counter', -1);
                clearInterval(countdown);
            }
        }, 1000);
    });

    socket.on('createMessage', function(params, callback) {
        let message = params.message;
        io.to(params.gameId).emit('newMessage', generateMessage(params.username, params.message));
    });

    socket.on('mouse', function(gameId, username, data) {
        io.in(gameId).emit('streamMouse', username, data);
    });

    socket.on('disconnect', function(gameId) {
        socket.to(gameId).emit('userLeft');
        console.log('User disconnected');
    });

});

server.listen(PORT, function(err) {
    if (err)
        console.log(err);
    else
        console.log('HTTP server on http://localhost:%s', PORT);
});
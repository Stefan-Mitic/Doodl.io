const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const socketIO = require('socket.io');
const crypto = require('crypto');
const bodyParser = require('body-parser');
app.use(bodyParser.json());


const PORT = 3000;
const mongoose = require('mongoose');

// connect to mongodb
mongoose.connect('mongodb://localhost/doodlio');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ImageModel = mongoose.model('image', new Schema({
  title: String
}));

const GameModel = mongoose.model('game', new Schema({
  players: Number,
  date: Date,
  images: [Image]
}));

// just listen to event
mongoose.connection.once('open', function () {
  console.log('Connection has been made, now make fireworks...');
}).on('error', function (err) {
  console.log('Connection error:', err);
});


// allow cors
app.use(cors());
// parse request body
app.use(express.json());

/* Create */

// user uploads an image to the server
app.post('/api/game/images/usrsubmit/:id/', function (req, res, next) {
  let gameId = req.params.id;
});

// create a new game
app.post('/api/newgame/', function (req, res, next) {
  crypto.randomBytes(12, function(err, buffer) {
    let token = buffer.toString('hex');
    lobbies[token] = {
      pictures: [],
      rounds: 5,
      players: []
    };
    res.json(lobbies);
  });
});

/* Read */

// get a set of random images for a new game (n = 5)
app.get('/api/game/images/main/random/', function (req, res, next) {
  let numImages = req.query.num || 5;

});


// get specific image for game
app.get('/api/game/images/main/:id/', function (req, res, next) {
  let imageId = req.params.id;

});


// setup server
const server = http.createServer(app);
const io = socketIO(server);

let lobbies = {};

io.on('connection', socket => {
  console.log('User connected');
  let sessionid = socket.id;
  
  socket.on('join', (params, callback) => {
    // username and room id
    if(!isRealString(params.user) || !isRealString(params.gameId)) {
      callback('Username and game id are required.');
    }

    socket.emit('newMessage', generateMessage('Admin', 'Successfully joined game.'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.user} has joined.`));
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

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

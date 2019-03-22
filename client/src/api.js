import axios from 'axios';
import openSocket from "socket.io-client";

const socket = openSocket('http://localhost:5000');

function subscribeToUpdateUserList(updateList) {
    socket.on('updateUserList', function() {
        updateList();
    });
}

function subscribeToGameStart(startGame) {
    socket.on('gameStart', function() {
        startGame();
    });
}

function emitJoin(params) {
    socket.emit('join', params, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("joined successfully");
        }
    });
}

function emitStartGame(gameId) {
    socket.emit('startGame', gameId);
}

function emitRoundStart(gameId, counter) {
    socket.emit('roundStart', gameId, counter);
}


export default axios.create({
    baseURL: `http://localhost:5000/`
});

export { subscribeToUpdateUserList, subscribeToGameStart, emitJoin, emitStartGame };
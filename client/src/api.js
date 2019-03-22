import axios from 'axios';
import openSocket from "socket.io-client";
axios.defaults.baseURL = 'http://localhost:5000/';

export function createGame(config, callback, errorcallback) {
    axios.post('/api/game/', config)
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        })
        .catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        });
}

export function joinGame(config, callback, errorcallback) {
    axios.patch('/api/game/join/', config)
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        })
        .catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        });
}

export function getPlayers(gameId, callback, errorcallback) {
    axios.get('/api/game/' + gameId + '/players/')
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        })
        .catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        });
}

export function startGame(gameId, callback, errorcallback) {
    axios.get('/api/game/start/', { id: gameId })
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        })
        .catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        });
}

export function saveDrawing(config, callback, errorcallback) {
    axios.post('/api/drawings/', config)
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        })
        .catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        });
}

export function imageCompare(imageId, drawingId, callback, errorcallback) {
    axios.post('/api/game/images/' + imageId + '/compare/', { drawingId: drawingId })
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        })
        .catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        });
}

// SOCKETIO ===================================================================

const socket = openSocket('http://localhost:5000');

export function subscribeToUpdateUserList(updateList) {
    socket.on('updateUserList', function () {
        updateList();
    });
}

export function subscribeToGameStart(startGame) {
    socket.on('gameStart', function () {
        startGame();
    });
}

export function emitJoin(params) {
    socket.emit('join', params, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("joined successfully");
        }
    });
}

export function emitStartGame(gameId) {
    socket.emit('startGame', gameId);
}


export default axios.create({
    baseURL: `http://localhost:5000/`
});
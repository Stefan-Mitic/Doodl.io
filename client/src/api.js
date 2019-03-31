import axios from 'axios';
import openSocket from "socket.io-client";
// axios.defaults.baseURL = 'http://localhost:5000/';

export function signin(user, callback, errorcallback) {
    axios.post('/signin/', user)
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        }).catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        })
}

export function signup(user, callback, errorcallback) {
    axios.post('/signup/', user)
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        }).catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        })
}

export function signout(callback, errorcallback) {
    axios.get('/signout/')
        .then(res => {
            if (callback != null) {
                callback(res);
            }
        }).catch(err => {
            if (errorcallback != null) {
                errorcallback(err);
            }
        })
}

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

export function startGame(gameId, rounds, callback, errorcallback) {
    axios.post('/api/game/start/', { id: gameId, rounds: rounds })
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

export function getImageId(gameId, callback, errorcallback) {
    axios.get('/api/game/' + gameId + '/nextImage/')
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

export function getImage(imageId, callback, errorcallback) {
    axios.get('/api/game/images/' + imageId + '/file/')
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

export function addPlayerScore(username, gameId, score, callback, errorcallback) {
    axios.post('/api/leaderboard/' + gameId + '/' + username + '/', { score: score })
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

export function getPlayerScore(gameId, username, callback, errorcallback) {
    axios.get('/api/leaderboard/' + gameId + '/' + username + '/')
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

export function updateName(newname, callback, errorcallback) {
    axios.patch('/api/users/name/', { name: newname })
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

export function updatePassword(oldPassword, newPassword, callback, errorcallback) {
    axios.patch('/api/users/password/', { oldPassword: oldPassword, newPassword: newPassword })
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

export function incrementPlayerLeaderboard(username, callback, errorcallback) {
    axios.patch('/api/leaderboard/' + username + '/')
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

export function getTopPlayers(callback, errorcallback) {
    axios.get('/api/leaderboard/')
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

export function getPlayerLeaderboard(callback, errorcallback) {
    axios.get('/api/leaderboard/me/')
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

export function getPlayerHistory(page, callback, errorcallback) {
    axios.get('/api/leaderboard/history/', { params: { page: page } })
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

export function sendFriendRequest(username, callback, errorcallback) {
    axios.post('/api/users/friend/', null, { params: { target: username } })
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

export function getSentFriendRequests(username, page, callback, errorcallback) {
    axios.get('/api/users/' + username + '/sentrequests/', { params: { page: page } })
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

export function getReceivedFriendRequests(username, page, callback, errorcallback) {
    axios.get('/api/users/' + username + '/recievedrequests/', { params: { page: page } })
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

export function acceptFriendRequests(requester, callback, errorcallback) {
    axios.post('/api/users/acceptrequest/', null, { params: { target: requester } })
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

export function rejectFriendRequests(requester, callback, errorcallback) {
    axios.post('/api/users/rejectrequest/', null, { params: { target: requester } })
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

export function getFriends(username, page, callback, errorcallback) {
    axios.get('/api/users/' + username + '/friends/', { params: { page: page } })
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

export function unfriend(friend, callback, errorcallback) {
    axios.post('/api/users/unfriend/', null, { params: { target: friend } })
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

export function getGameRequests(username, callback, errorcallback) {
    axios.get('/api/users/' + username + '/gamerequests/')
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

export function sendGameRequest(username, gameId, callback, errorcallback) {
    axios.post('/api/users/gamerequest/', { gameId: gameId }, { params: { target: username } })
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

export function subscribeToNewMessage() {
    socket.on('newMessage', function (message) {
        // TODO: Add new message to chat
    });
}

export function subscribeToUserLeft() {
    socket.on('userLeft', function (user) {
        // TODO: Remove user from the game
    });
}

export function subscribeToCounter(updateCounter) {
    socket.on('counter', function (counter) {
        updateCounter(counter);
    });
}

export function unsubscribeFromCounter() {
    socket.off('counter');
}

export function unsubscribeFromUpdateUserList(updateList) {
    socket.off('updateUserList');
}

export function unsubscribeFromGameStart(startGame) {
    socket.off('gameStart');
}

export function unsubscribeFromNewMessage() {
    socket.off('newMessage');
}

export function unsubscribeFromUserLeft() {
    socket.off('userLeft');
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

export function emitRoundStart(gameId, counter) {
    socket.emit('roundStart', gameId, counter);
}

export function emitMessage(gameId, username, message) {
    let params = {
        gameId: gameId,
        username: username,
        message: message
    };
    socket.emit('createMessage', params);
}

// WEB RTC: mostly references https://github.com/anoek/webrtc-group-chat-example.git

const ICE_SERVERS = [{
    url: "stun:stun.l.google.com:19302"
}];
let peers = {};
let peer_media_elements = {};

export function subscribeToAddPeer(local_media_stream, connectToStream) {
    socket.on('addPeer', function (config) {
        console.log('Signaling server said to add peer:', config);
        let peer_id = config.peer_id;
        let peer_connection = new RTCPeerConnection({
            "iceServers": ICE_SERVERS
        }, {
                "optional": [{
                    "DtlsSrtpKeyAgreement": true
                }]
            });

        peers[peer_id] = peer_connection;

        peer_connection.onicecandidate = function (event) {
            if (event.candidate) {
                socket.emit('relayICECandidate', {
                    'peer_id': peer_id,
                    'ice_candidate': {
                        'sdpMLineIndex': event.candidate.sdpMLineIndex,
                        'candidate': event.candidate.candidate
                    }
                });
            }
        };

        peer_connection.ontrack = function (event) {
            console.log("onAddStream", event);
            connectToStream(event.streams[0]);
        };

        peer_connection.addStream(local_media_stream);

        if (config.should_create_offer) {
            // console.log("Creating RTC offer to ", peer_id);
            peer_connection.createOffer(
                function (local_description) {
                    // console.log("Local offer description is: ", local_description);
                    peer_connection.setLocalDescription(local_description,
                        function () {
                            socket.emit('relaySessionDescription', {
                                'peer_id': peer_id,
                                'session_description': local_description
                            });
                            console.log("Offer setLocalDescription succeeded");
                        },
                        function () {
                            console.log("Offer setLocalDescription failed!");
                        }
                    );
                },
                function (error) {
                    console.log("Error sending offer: ", error);
                });
        }

        socket.on('sessionDescription', function (config) {
            console.log('Remote description received: ', config);
            let peer_id = config.peer_id;
            let peer = peers[peer_id];
            let remote_description = config.session_description;
            // console.log(config.session_description);

            let desc = new RTCSessionDescription(remote_description);
            let stuff = peer.setRemoteDescription(desc,
                function () {
                    console.log("setRemoteDescription succeeded");
                    if (remote_description.type === "offer") {
                        // console.log("Creating answer");
                        peer.createAnswer(
                            function (local_description) {
                                // console.log("Answer description is: ", local_description);
                                peer.setLocalDescription(local_description,
                                    function () {
                                        socket.emit('relaySessionDescription', {
                                            'peer_id': peer_id,
                                            'session_description': local_description
                                        });
                                        console.log("Answer setLocalDescription succeeded");
                                    },
                                    function () {
                                        console.log("Answer setLocalDescription failed!");
                                    }
                                );
                            },
                            function (error) {
                                console.log("Error creating answer: ", error);
                                console.log(peer);
                            });
                    }
                },
                function (error) {
                    console.log("setRemoteDescription error: ", error);
                }
            );
            console.log("Description Object: ", desc);

        });

    });
}

export function subscribeToIceCandidate() {
    socket.on('iceCandidate', function (config) {
        let peer = peers[config.peer_id];
        let ice_candidate = config.ice_candidate;
        peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
    });
}

export function subscribeToRemovePeer() {
    socket.on('removePeer', function (config) {
        console.log('Signaling server said to remove peer:', config);
        let peer_id = config.peer_id;
        if (peer_id in peer_media_elements) {
            peer_media_elements[peer_id].remove();
        }
        if (peer_id in peers) {
            peers[peer_id].close();
        }

        delete peers[peer_id];
        delete peer_media_elements[config.peer_id];
    });
}

// SHOULD REMOVE LATER
export default axios.create({
    baseURL: `http://localhost:5000/`
});
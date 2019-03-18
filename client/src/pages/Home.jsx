import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header, {socket} from '../components/Header';
import api from '../api';
import history from '../history';

class Home extends Component {
    constructor(props) {
        super(props);
        this.signout = this.signout.bind(this);
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.inputRef = React.createRef();
    }

    signout = event => {
        event.preventDefault();

        api.post(`/signout/`)
            .then(res => {
                console.log(res);
                history.push("/login");
            }).catch(err => {
                console.log(err);
            });
    };

    createGame = event => {
        event.preventDefault();
        let username = localStorage.getItem('username');
        const gameSettings = {
            rounds: 1,
            username: username
        };
        api.post(`/api/game/`, gameSettings)
            .then(res => {
                let id = res.data;
                const params = {
                    username: username,
                    gameId: id
                };
                socket.emit('join', params, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("joined successfully");
                    }
                });
                history.push({ pathname: "/lobby/" + id, state: { host: true }});
            }).catch(err => {
                console.log(err);
            });
        
    };

    joinGame = event => {
        event.preventDefault();
        var gameId = this.inputRef.current.value;
        console.log(gameId);
        let username = localStorage.getItem('username');
        const params = {
            username: username,
            gameId: gameId
        };
        api.patch(`/api/game/join/`, params).then(res => {
            socket.emit('join', params, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("joined successfully");
                }
            });
            history.push({ pathname: "/lobby/" + gameId, state: { host: false }});
        }).catch(err => {
            console.log(err);
        });
    };

    render() {
        return (
            <div className="background">
                <Header></Header>
                <div className="row offset-sm-10">
                    <button className="btn btn-success header_btn" onClick={this.signout}>Signout</button>
                </div>
                <div className="row offset-sm-4 col-sm-5">
                    <button className="btn btn-success btn-lg btn-block" onClick={this.createGame}>Create Game</button>
                </div>
                <div className="row">
                    <input className="offset-sm-4" ref={this.inputRef} type="text" maxLength="30" placeholder="Enter Game ID"></input>
                    <button className="offset-sm-1 col-sm-6" className="btn btn-success btn-lg" onClick={this.joinGame}>Join Game</button>
                </div>
            </div>
        );
    }
}

export default Home;
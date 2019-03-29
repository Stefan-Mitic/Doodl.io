import React, { Component } from 'react';
import Header from '../components/Header';
import { emitJoin, createGame, joinGame } from '../api';
import history from '../history';

class Home extends Component {
    constructor(props) {
        super(props);
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.inputRef = React.createRef();
    }

    createGame(e) {
        e.preventDefault();
        let username = localStorage.getItem('username');
        const gameSettings = {
            rounds: 1,
            username: username
        };
        createGame(gameSettings, (res) => {
            let id = res.data;
            const params = {
                username: username,
                gameId: id
            };
            emitJoin(params);
            history.push({ pathname: "/lobby/" + id, state: { host: true } });
        }, (err) => {
            alert(err);
        });
    };

    joinGame(e) {
        e.preventDefault();
        var gameId = this.inputRef.current.value;
        let username = localStorage.getItem('username');
        const params = {
            username: username,
            gameId: gameId
        };
        joinGame(params, (res) => {
            emitJoin(params);
            history.push({ pathname: "/lobby/" + gameId, state: { host: false } });
        }, (err) => {
            alert(err);
        });
    };

    render() {
        return (
            <div>
                <Header></Header>
                <div className="title">Main Menu</div>
                <div className="row">
                    <button className="offset-sm-4 col-sm-4 btn btn-success btn-lg btn-block" onClick={(e) => this.createGame(e)}>Create Game</button>
                </div>
                <div className="row">
                    <input className="offset-sm-4 col-sm-2" ref={this.inputRef} type="text" maxLength="30" placeholder="Enter Game ID"></input>
                    <button className="col-sm-2 btn btn-success btn-lg" onClick={(e) => this.joinGame(e)}>Join Game</button>
                </div>
            </div>
        );
    }
}

export default Home;
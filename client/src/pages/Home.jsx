import React, { Component } from 'react';
import Header from '../components/Header';
import api, {emitJoin} from '../api';
import history from '../history';

class Home extends Component {
    constructor(props) {
        super(props);
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.inputRef = React.createRef();
    }

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
                emitJoin(params);
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
            emitJoin(params);
            history.push({ pathname: "/lobby/" + gameId, state: { host: false }});
        }).catch(err => {
            console.log(err);
        });
    };

    render() {
        return (
            <div>
                <Header></Header>
                <div className="title">Main Menu</div>
                <div className="row">
                    <button className="offset-sm-4 col-sm-4 btn btn-success btn-lg btn-block" onClick={this.createGame}>Create Game</button>
                </div>
                <div className="row">
                    <input className="offset-sm-4 col-sm-2" ref={this.inputRef} type="text" maxLength="30" placeholder="Enter Game ID"></input>
                    <button className="col-sm-2 btn btn-success btn-lg" onClick={this.joinGame}>Join Game</button>
                </div>
            </div>
        );
    }
}

export default Home;
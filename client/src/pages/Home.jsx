import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'
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
            })
    }

    createGame = event => {
        event.preventDefault();
        const gameSettings = {
            rounds: 1
        };
        api.post(`/api/game/`, gameSettings)
            .then(res => {
                console.log(res);
                console.log(res.data);
                history.push("/lobby/" + res.data);
            }).catch(err => {
                console.log(err);
            })
    }

    joinGame = event => {
        event.preventDefault();

        var gameId = this.inputRef.current;

        // socket emit
    }

    render() {
        return (
            <div className="background">
                <Header></Header>
                <div className="row offset-sm-10">
                    <button className="btn btn-success header_btn" onClick={this.signout}>Signout</button>
                </div>
                <div id="homeButton">
                    <button className="btn btn-success btn-lg btn-block" onClick={this.createGame}>Create Game</button>
                </div>
                <div className="row">
                    <input className="offset-sm-3" ref={this.inputRef} type="text" maxLength="15"></input>
                    <button className="offset-sm-1 col-sm-6" className="btn btn-success btn-lg" onClick={this.joinGame}>Join Game</button>
                </div>
            </div>
        );
    }
}

export default Home;
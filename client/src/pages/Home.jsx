import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'
import api from '../api';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

class Home extends Component {

    signout = event => {
        event.preventDefault();

        api.post(`/signout/`)
            .then(res => {
                console.log(res);
                this.props.history.push("/login");
            }).catch(err => {
                console.log(err);
            });
    };

    createGame = event => {
        event.preventDefault();
        const gameSettings = {
            rounds: 1
        };
        api.post(`/api/game/`, gameSettings)
            .then(res => {
                let id = res.data;
                console.log(id);
                socket.emit('join', id, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("joined successfully");
                    }
                });
                this.props.history.push("/lobby");
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
                <div id="homeButton">
                    <button className="btn btn-success btn-lg btn-block" onClick={this.createGame}>Create Game</button>
                </div>
            </div>
        );
    }
}

export default Home;
import React, { Component } from 'react';
import api from '../api';
import history from '../history';
import Header from '../components/Header';

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
        this.urlRef = React.createRef();
        this.getPlayers = this.getPlayers.bind(this);
        this.copyText = this.copyText.bind(this);
        this.host = this.props.location.state.host;
        this.gameId = this.props.match.params.id;
        this.startGame = this.startGame.bind(this);
    }

    getPlayers() {
        var rows = [];
        var players = [];
        api.get(`/api/game/players/`, { id: this.gameId })
            .then(res => {
                console.log(res);
                players = res;
            }).catch(err => {
                console.log(err);
            });
        players.forEach(function (player) {
            rows.push(<tr key={player}><td>{player}</td></tr>);
        });
        return (
            <tbody>{rows}</tbody>
        );
    }

    copyText() {
        var copyText = this.urlRef.current;
        copyText.select();
        document.execCommand('copy');
        this.setState({ show: true });
    }

    startGame = event => {
        event.preventDefault();

        api.post(`/api/game/start/`, { id: this.gameId })
            .then(res => {
                console.log(res);
                // socket emit code here
                history.push({ pathname: "/game/" + this.gameId});
            }).catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <Header></Header>
                <div className="title">Lobby</div>
                <div className="row">
                    <table id="playerTable" className="offset-sm-2 col-sm-3 table table-bordered table-dark">
                        <thead>
                            <tr>
                                <th>Players</th>
                            </tr>
                        </thead>
                        {this.getPlayers()}
                    </table>
                    <div className="offset-sm-1 col-sm-5">
                        <div>Share this ID:</div>
                        <input ref={this.urlRef} type="text" readOnly value={this.gameId}></input>
                        <button className="btn btn-success" onClick={this.copyText}>Copy text</button>
                        {
                            this.state.show ?
                                <div className="alert alert-primary" role="alert">Copied!</div>
                                : null
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="offset-sm-6 col-sm-3" style={{visibility: !this.host ? 'visible' : 'hidden' }}>
                        Cannot start, not host!
                    </div>
                    <button type="button" className="col-sm-2 btn btn-success" disabled={!this.host} onClick={this.startGame}>Start Game</button>
                </div>
            </div>
        );
    }
}

export default Lobby;
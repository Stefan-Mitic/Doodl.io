import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = { show : false };
        this.urlRef = React.createRef();
        this.getPlayers = this.getPlayers.bind(this);
        this.copyText = this.copyText.bind(this);
    }

    getPlayers() {
        var rows = [];
        var players = ['Player 1', 'Player 2', 'Player 3']; // API CALL
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
        this.setState({ show : true } );
    }

    render() {
        return (
            <div className="background">
                <Header></Header>
                <div className="title">Lobby</div>
                <div id="playerTable" className="row">
                    <table className="offset-sm-1 col-sm-3 table table-bordered table-dark">
                        <thead>
                            <tr>
                                <th>Player</th>
                            </tr>
                        </thead>
                        {this.getPlayers()}
                    </table>
                    <div className="offset-sm-1 col-sm-4" style={{padding: '30px'}}>
                        <div>Share this link:</div>
                        <input ref={this.urlRef} type="text" readOnly value="url.com"></input>
                        <button onClick={this.copyText}>Copy text</button>
                        {
                            this.state.show ?
                            <div className="alert alert-primary" role="alert">Copied!</div>
                            :null
                        }
                    </div>
                </div>
                <Link to="/game">
                <button type="button" className="btn btn-success">Start Game</button>
                </Link>
            </div>
        );
    }
}

export default Lobby;
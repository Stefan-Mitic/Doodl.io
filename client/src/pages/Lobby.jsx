import React, { Component } from 'react';
import { subscribeToUpdateUserList, subscribeToGameStart, emitStartGame, getPlayers, startGame} from '../api';
import history from '../history';
import Header from '../components/Header';
import ReactTable from "react-table";
import "react-table/react-table.css";

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false, data: [] };
        this.urlRef = React.createRef();
        this.getPlayers = this.getPlayers.bind(this);
        this.copyText = this.copyText.bind(this);
        this.host = this.props.location.state.host;
        this.gameId = this.props.match.params.id;
        this.startGame = this.startGame.bind(this);
        this.redirectToGame = this.redirectToGame.bind(this);
    }

    componentDidMount() {
        this.getPlayers();
        subscribeToGameStart(this.redirectToGame);
        subscribeToUpdateUserList(this.getPlayers);
    }

    getPlayers() {
        getPlayers(this.gameId, (res) => {
            const players = [];
            for (const name of res.data) {
                const newRecord = { name: name };
                players.push(newRecord);
            }
            this.setState({ data: players });
        }, (err) => {
            alert(err);
        });
    }

    copyText() {
        var copyText = this.urlRef.current;
        copyText.select();
        document.execCommand('copy');
        this.setState({ show: true });
    }

    redirectToGame() {
        startGame(this.gameId, 1, (res) => {
            history.push({
              pathname: "/game/" + this.gameId,
              state: { players: this.state.data }
            });
        }, (err) => {
            alert(err);
        });
    }

    startGame = event => {
        event.preventDefault();
        if (this.host) emitStartGame(this.gameId);
        this.redirectToGame();
    }

    render() {
        const columns = [{
            Header: 'Players',
            accessor: 'name'
        }]

        return (
            <div>
                <Header></Header>
                <div className="title">Lobby</div>
                <div className="row">
                    <ReactTable className="offset-sm-2 col-sm-3 table"
                        data={this.state.data}
                        columns={columns}
                        loadingText={''}
                        showPagination={false}
                        defaultPageSize={4}
                    />

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
                    <div className="offset-sm-6 col-sm-3" style={{ visibility: !this.host ? 'visible' : 'hidden' }}>
                        Cannot start, not host!
                    </div>
                    <button type="button" className="col-sm-2 btn btn-success" disabled={!this.host} onClick={this.startGame}>Start Game</button>
                </div>
            </div>
        );
    }
}

export default Lobby;
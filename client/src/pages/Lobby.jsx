import React, { Component } from 'react';
import api, { subscribeToUpdateUserList, subscribeToGameStart, emitStartGame} from '../api';
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
        subscribeToGameStart(this.redirectToGame);
        subscribeToUpdateUserList(this.getPlayers);
    }

    componentDidMount() {
        this.getPlayers();
    }

    async getPlayers() {
        let res = await api.get(`/api/game/` + this.gameId + `/players/`);
        let data = await res.data;
        const players = [];
        for (const name of data) {
            const newRecord = { name: name };
            players.push(newRecord);
        }
        this.setState({ data: players });
    }

    copyText() {
        var copyText = this.urlRef.current;
        copyText.select();
        document.execCommand('copy');
        this.setState({ show: true });
    }

    redirectToGame() {
        let images = [];
        api
          .get(`/api/game/images/`)
          .then(res => {
            console.log(res.data);
            images = res.data;
          })
          .catch(err => {
            console.log(err);
          });

        api
          .post(`/api/game/start/`, { id: this.gameId })
          .then(res => {
            console.log(res);
            history.push({
              pathname: "/game/" + this.gameId,
              state: { images: images, players: this.state.data }
            });
          })
          .catch(err => {
            console.log(err);
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
                    <ReactTable id="playerTable" className="offset-sm-2 col-sm-3 table table-bordered table-dark"
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
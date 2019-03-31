import React, { Component } from 'react';
import { subscribeToUpdateUserList, subscribeToGameStart, emitStartGame, getPlayers, startGame, getFriends, sendGameRequest, unsubscribeFromGameStart, unsubscribeFromUpdateUserList, unsubscribeFromUserLeft, emitRoundStart } from '../api';
import history from '../history';
import Header from '../components/Header';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false, data: [], friends: [], friendsPage: 0 };
        this.urlRef = React.createRef();
        this.getPlayers = this.getPlayers.bind(this);
        this.copyText = this.copyText.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.getFriends = this.getFriends.bind(this);
        this.host = this.props.location.state.host;
        this.gameId = this.props.match.params.id;
        this.startGame = this.startGame.bind(this);
        this.redirectToGame = this.redirectToGame.bind(this);
    }

    componentDidMount() {
        this.getPlayers();
        this.getFriends();
        subscribeToGameStart(this.redirectToGame);
        subscribeToUpdateUserList(this.getPlayers);
    }

    componentWillUnmount() {
        unsubscribeFromGameStart();
        unsubscribeFromUpdateUserList();
        unsubscribeFromUserLeft();
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

    startGame(e) {
        e.preventDefault();
        if (this.host) {
            emitStartGame(this.gameId);
            emitRoundStart(this.gameId, 10);
        }
        this.redirectToGame();
    }

    sendRequest(e, row) {
        e.preventDefault();

        sendGameRequest(row.name, this.gameId, (res) => {
            console.log(res);
            alert('Game Request sent to: ' + row.name);
        }, (err) => {
            alert(err);
        });
    }

    getFriends(e, isNext) {
        if (e) e.preventDefault();
        let page = this.state.friendsPage;
        if (isNext)
            page = page + 1;
        else if (page !== 0) {
            page = page - 1;
        }

        getFriends(cookies.get('username'), page, (res) => {
            console.log(res);
            const friends = [];
            for (const friend of res.data) {
                const newRecord = { name: friend };
                friends.push(newRecord);
            }
            if (res.data && res.data.length > 0)
                this.setState({ friends: friends, friendsPage: page });
        }, (err) => {
            alert(err);
        });
    }

    render() {
        const playerCols = [{
            Header: 'Players',
            accessor: 'name'
        }];

        const friendCols = [{
            Header: 'Friends List',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                width: 100,
                Header: '',
                style: {
                    textAlign: 'center',
                },
                Cell: ({ row }) => (<button onClick={(e) => this.sendRequest(e, row)}>Invite</button>)
            }]
        }];

        return (
            <div>
                <Header></Header>
                <div className="title">Lobby</div>
                <div className="row">
                    <div className="offset-sm-2 col-sm-3">
                        <ReactTable className="table"
                            data={this.state.data}
                            columns={playerCols}
                            loadingText={''}
                            showPagination={false}
                            defaultPageSize={4}
                        />
                        <div>OR share this ID:</div>
                        <input ref={this.urlRef} type="text" size="15" readOnly value={this.gameId}></input>
                        <button className="btn btn-success" onClick={this.copyText}>Copy text</button>
                        {
                            this.state.show ?
                                <div className="alert alert-primary" role="alert">Copied!</div>
                                : null
                        }
                    </div>
                    <div className="offset-sm-1 col-sm-5">
                        <div className="custom-table">
                            <ReactTable className="table center"
                                data={this.state.friends}
                                columns={friendCols}
                                loadingText={''}
                                showPagination={false}
                                pageSize={5}
                            />
                            <div className="center">
                                <button
                                    onClick={(e) => this.getFriends(e, false)}>
                                    Prev
                                </button>
                                <button
                                    onClick={(e) => this.getFriends(e, true)}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="offset-sm-6 col-sm-3" style={{ visibility: !this.host ? 'visible' : 'hidden' }}>
                        Cannot start, not host!
                    </div>
                    <button type="button" className="col-sm-2 btn btn-success" disabled={!this.host} onClick={(e) => this.startGame(e)}>Start Game</button>
                </div>
            </div>
        );
    }
}

export default Lobby;
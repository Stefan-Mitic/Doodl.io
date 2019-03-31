import React, { Component } from 'react';
import { subscribeToUpdateUserList, subscribeToGameStart, emitStartGame, getPlayers, startGame, getFriends, sendGameRequest, unsubscribeFromGameStart, unsubscribeFromUpdateUserList, unsubscribeFromUserLeft, emitRoundStart, emitMessage, subscribeToNewMessage, unsubscribeFromNewMessage } from '../api';
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
        this.msgRef = React.createRef();
        this.getPlayers = this.getPlayers.bind(this);
        this.copyText = this.copyText.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.getFriends = this.getFriends.bind(this);
        this.getMsgs = this.getMsgs.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
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
        subscribeToNewMessage(this.getMsgs);
    }

    componentWillUnmount() {
        unsubscribeFromGameStart();
        unsubscribeFromUpdateUserList();
        unsubscribeFromUserLeft();
        unsubscribeFromNewMessage();
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
            console.log(err);
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
            console.log(err);
        });
    }

    startGame(e) {
        e.preventDefault();
        if (this.host) {
            emitStartGame(this.gameId);
            emitRoundStart(this.gameId, 20);
        }
        this.redirectToGame();
    }

    sendRequest(e, row) {
        e.preventDefault();

        sendGameRequest(row.name, this.gameId, (res) => {
            console.log(res);
            alert('Game Request sent to: ' + row.name);
        }, (err) => {
            alert('Error: username ' + row.name + ' does not exist');
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
            console.log(err);
        });
    }

    getMsgs(msg) {
        let date = new Date(msg.createdAt);
        let hours = date.getHours();
        let mins = date.getMinutes();
        if (hours < 10) hours = "0" + hours;
        if (mins < 10) mins = "0" + mins;
        let time = hours + ":" + mins;

        let chat = document.getElementById('chat');
        let divMsg = document.createElement('div');
        let newMsg = "[" + time + "] " + msg.from + ": " + msg.text + "\n";
        divMsg.append(newMsg);
        chat.append(divMsg);
    }

    sendMsg() {
        let msg = this.msgRef.current.value;
        emitMessage(this.gameId, cookies.get('username'), msg);
        this.msgRef.current.value = '';
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
                <div className="row">
                    <div className="offset-sm-2 col-sm-8">
                        <div>Live Chat</div>
                        <div className="chat">
                            <div id="chat">
                                {/* <div>Username - hello there</div> */}
                            </div>
                            <div className="chat-box">
                                <input ref={this.msgRef} type="text" size="40" placeholder="Enter Message"></input>
                                <button onClick={this.sendMsg}>Send</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Lobby;
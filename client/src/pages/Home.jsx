import React, { Component } from 'react';
import Header from '../components/Header';
import { emitJoin, createGame, joinGame, getGameRequests } from '../api';
import history from '../history';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { invites: [] }
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.getGameRequests = this.getGameRequests.bind(this);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.getGameRequests();
    }

    createGame(e) {
        e.preventDefault();
        let username = cookies.get('username');
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

    joinGame(e, row) {
        e.preventDefault();

        var gameId = row ? row._original.gameId
            : this.inputRef.current.value;
        let username = cookies.get('username');
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

    getGameRequests() {
        getGameRequests(cookies.get('username'), (res) => {
            const invites = [];
            for (const request of res.data) {
                const newRecord = { name: request.requester, gameId: request.gameId };
                invites.push(newRecord);
            }
            this.setState({ invites: invites });
        }, (err) => {
            alert(err);
        });
    }

    render() {
        const requestCols = [{
            Header: 'Game Requests',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                width: 100,
                Header: '',
                style: {
                    textAlign: 'center',
                },
                Cell: ({ row }) => (<button onClick={(e) => this.joinGame(e, row)}>Join</button>)
            }]
        }];

        return (
            <div>
                <Header></Header>
                <div className="title">Main Menu</div>
                <div className="row">
                    <div className="offset-sm-2 col-sm-3">
                        <ReactTable className="table"
                            data={this.state.invites}
                            columns={requestCols}
                            loadingText={''}
                            showPagination={true}
                            defaultPageSize={5}
                        />
                    </div>
                    <div className="offset-sm-1 col-sm-4">
                        <div className="row">
                            <button className="col-sm-12 btn btn-success btn-lg btn-block" onClick={(e) => this.createGame(e)}>Create Game</button>
                        </div>
                        <div className="row">
                            <input ref={this.inputRef} className="col-sm-8" type="text" maxLength="30" placeholder="Enter Game ID"></input>
                            <button className="col-sm-4 btn btn-success btn-lg" onClick={(e) => this.joinGame(e)}>Join Game</button>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default Home;
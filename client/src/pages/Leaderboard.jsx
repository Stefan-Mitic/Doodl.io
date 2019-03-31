import React, { Component } from 'react';
import Header from '../components/Header';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getTopPlayers, getPlayerLeaderboard } from '../api';

class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = { rank: -1, player: null, wins: -1, data: [] };
        this.getPlayerData = this.getPlayerData.bind(this);
        this.getTopPlayers = this.getTopPlayers.bind(this);
    }

    componentDidMount() {
        this.getPlayerData();
        this.getTopPlayers();
    }

    getPlayerData() {
        getPlayerLeaderboard((res) => {
            console.log(res);
            this.setState({
                rank: res.data.position,
                player: res.data.player,
                wins: res.data.wins
            });
        }, (err) => {
            alert(err);
        });
    }

    getTopPlayers() {
        getTopPlayers((res) => {
            console.log(res);
            const players = [];
            let i = 1;
            for (const player of res.data) {
                const newRecord = { rank: i, name: player._id, wins: player.wins };
                players.push(newRecord);
                i++;
            }
            this.setState({ data: players });
        }, (err) => {
            alert(err);
        });
    }

    render() {
        const columns = [{
            Header: 'Ranking',
            accessor: 'rank'
        }, {
            Header: 'Player',
            accessor: 'name'
        }, {
            Header: 'Wins',
            accessor: 'wins'
        }]

        return (
            <div>
                <Header></Header>
                <div className="title">Leaderboard</div>
                <div className="row">
                    <div className="player-leaderboard offset-sm-3 col-sm-2">{this.state.rank}</div>
                    <div className="player-leaderboard col-sm-2">{this.state.player}</div>
                    <div className="player-leaderboard col-sm-2">{this.state.wins}</div>
                </div>
                <div className="row">
                    <ReactTable className="offset-sm-3 col-sm-6 table center"
                        data={this.state.data}
                        columns={columns}
                        loadingText={''}
                        showPagination={false}
                        defaultPageSize={10}
                    />
                </div>
            </div>
        );
    }
}

export default Leaderboard;
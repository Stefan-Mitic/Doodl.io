import React, { Component } from 'react';
import Profile from '../../components/Profile';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getPlayerHistory } from '../../api';

class GameHistory extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.getHistory = this.getHistory.bind(this);
    }

    componentDidMount() {
        this.getHistory();
    }

    getHistory() {
        getPlayerHistory(0, (res) => {
            const games = [];
            for (const game of res.data) {
                let date = new Date(game.createdAt);
                const newRecord = { name: game.player, score: game.score, time: date.getDate() + '/' + date.getDay() + ' - ' + date.getHours() + ':' + date.getMinutes() };
                games.push(newRecord);
            }
            this.setState({ data: games });
        }, (err) => {
            alert(err);
        });
    }

    render() {
        const columns = [{
            Header: 'Player',
            accessor: 'name'
        }, {
            Header: 'Score',
            accessor: 'score'
        }, {
            Header: 'Time',
            accessor: 'time'
        }]

        return (
            <div>
                <Profile></Profile>
                <div className="row">
                    <ReactTable className="offset-sm-3 col-sm-6 table"
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

export default GameHistory;
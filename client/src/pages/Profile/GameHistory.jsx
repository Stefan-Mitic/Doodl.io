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
                const newRecord = { name: game.player, score: game.score, time: game.createdAt };
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
                    <ReactTable className="offset-sm-4 col-sm-4 table"
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
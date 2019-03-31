import React, { Component } from 'react';
import Profile from '../../components/Profile';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getPlayerHistory } from '../../api';

class GameHistory extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], historyPage: 0 };
        this.getHistory = this.getHistory.bind(this);
    }

    componentDidMount() {
        this.getHistory();
    }

    getHistory(e, isNext) {
        if (e) e.preventDefault();
        let page = this.state.historyPage;
        if (isNext)
            page = page + 1;
        else if (page !== 0) {
            page = page - 1;
        }

        getPlayerHistory(page, (res) => {
            const games = [];
            console.log(res);
            for (const game of res.data) {
                let date = new Date(game.createdAt);
                const newRecord = { name: game.player, score: game.score, time: date.getDate() + '/' + date.getDay() + ' - ' + date.getHours() + ':' + date.getMinutes() };
                games.push(newRecord);
            }
            if (res.data && res.data.length > 0)
                this.setState({ data: games, historyPage: page });
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
                    <div className="offset-sm-3 col-sm-6">
                        <div className="custom-table">
                            <ReactTable className="table"
                                data={this.state.data}
                                columns={columns}
                                loadingText={''}
                                showPagination={false}
                                defaultPageSize={10}
                            />
                            <div className="center">
                                <button
                                    onClick={(e) => this.getHistory(e, false)}>
                                    Prev
                                </button>
                                <button
                                    onClick={(e) => this.getHistory(e, true)}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GameHistory;
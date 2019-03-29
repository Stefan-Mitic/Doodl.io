import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getPlayers, getPlayerScore, incrementPlayerLeaderboard } from '../api';

class PostGame extends Component {
    constructor(props) {
        super(props);
        this.getResults = this.getResults.bind(this);
        this.getWinner = this.getWinner.bind(this);
        this.gameId = this.props.match.params.id;
        this.state = { data: [], winner: null };
    }

    componentDidMount() {
        this.getResults();
    }

    getResults() {
        getPlayers(this.gameId, (res) => {
            const results = [];
            let bestScore = -1;
            for (const player of res.data) {
                getPlayerScore(this.gameId, player, (score) => {
                    const newRecord = { name: player, score: score.data };
                    results.push(newRecord);
                    this.setState({ data: results });

                    // find winner
                    if (bestScore === -1 || bestScore > score.data) {
                        bestScore = score.data;
                        this.winner = player;
                    }

                    // if on last player
                    if (res.data.slice(-1)[0]  === player) {
                        this.getWinner();
                    }
                }, (err) => {
                    alert(err);
                });
            }
        }, (err) => {
            alert(err);
        });
    }

    getWinner() {
        incrementPlayerLeaderboard(this.winner, (res) => {
            console.log(res);
        }, (err) => {
            alert(err);
        });
    }

    render() {
        const columns = [{
            Header: 'Players',
            accessor: 'name'
        }, {
            Header: 'Scores',
            accessor: 'score'
        }];

        return (
            <div>
                <Header></Header>
                <div className="title">Results</div>
                <div className="row">
                    <ReactTable className="offset-sm-2 col-sm-4 table table-bordered table-dark"
                        data={this.state.data}
                        columns={columns}
                        loadingText={''}
                        showPagination={false}
                        defaultPageSize={4}
                    />
                </div>
                <div className="row offset-sm-8">
                    <Link to="/">
                        <button type="button" className="btn btn-success">Return to Main Menu</button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default PostGame;
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
        this.getPlayerScore = this.getPlayerScore.bind(this);
        this.gameId = this.props.match.params.id;
        this.host = this.props.location.state.host;
        this.state = { data: [], winner: null, bestScore: -1 };
    }

    componentDidMount() {
        this.getResults();
    }

    getResults() {
        getPlayers(this.gameId, (res) => {
            for (const player of res.data) {
                this.getPlayerScore(player, res.data);
            }
        }, (err) => {
            console.log(err);
        });
    }

    getPlayerScore(player, players) {
        getPlayerScore(this.gameId, player, (score) => {
            const newRecord = { name: player, score: score.data };
            let results = this.state.data;
            results.push(newRecord);
            this.setState({
                data: results.sort((a, b) =>
                    (a.score > b.score) ? 1 : -1)
            });

            if (this.host) {
                // find winner
                if (this.state.bestScore === -1
                    || this.state.bestScore > score.data) {
                    this.setState({ winner: player, bestScore: score.data });
                }

                // if on last player
                if (players.slice(-1)[0] === player) {
                    this.getWinner();
                }
            }
        }, (err) => {
            console.log(err);
        });
    }

    getWinner() {
        incrementPlayerLeaderboard(this.state.winner, (res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });
    }

    render() {
        const columns = [{
            Header: "",
            id: "i",
            maxWidth: 50,
            filterable: false,
            Cell: (row) => {
                return <div>{row.index + 1}</div>;
            }
        }, {
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
                    <ReactTable className="offset-sm-2 col-sm-4 table table-bordered table-dark center"
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
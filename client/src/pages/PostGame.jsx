import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getPlayers, getPlayerScore } from '../api';

class PostGame extends Component {
    constructor(props) {
        super(props);
        this.getResults = this.getResults.bind(this);
        this.gameId = this.props.match.params.id;
        this.state = { data: [] };
    }

    componentDidMount() {
        this.getResults();
    }

    getResults() {
        getPlayers(this.gameId, (res) => {
            const results = [];
            console.log(res.data);
            for (const player of res.data) {
                getPlayerScore(this.gameId, player, (score) => {
                    console.log(score.data);
                    const newRecord = { name: player, score: score.data };
                    console.log(newRecord);
                    results.push(newRecord);
                    this.setState({ data: results });
                }, (err) => {
                    alert(err);
                });
            }
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
                        defaultPageSize={1}
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
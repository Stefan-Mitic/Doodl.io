import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ReactTable from "react-table";
import "react-table/react-table.css";

class PostGame extends Component {
    constructor(props) {
        super(props);
        this.getResults = this.getResults.bind(this);
        this.state = { players: this.props.location.state.players, data: [] };
        console.log(this.state.players);
    }

    componentDidMount() {
        this.getResults();
    }

    getResults() {
        // API Scores Call

        const results = [];
        for (const player of this.state.players) {
            const newRecord = { name: player.name, score: 0 };
            results.push(newRecord);
        }
        this.setState({ data: results });
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
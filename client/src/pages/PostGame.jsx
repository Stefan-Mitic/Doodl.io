import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

class PostGame extends Component {
    // constructor(props) {
    //     super(props);
    // }

    getResults() {
        var rows = [];
        var players = ['Player 1', 'Player 2', 'Player 3']; // API CALL
        players.forEach(function (player) {
            rows.push(<tr key={player}><td>{player}</td><td>0</td></tr>);
        });
        return (
            <tbody>{rows}</tbody>
        );
    }

    render() {
        return (
            <div>
                <Header></Header>
                <div className="title">Results</div>
                <div className="row">
                    <table id="resultsTable" className="offset-sm-2 col-sm-3 table table-bordered table-dark">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        {this.getResults()}
                    </table>
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
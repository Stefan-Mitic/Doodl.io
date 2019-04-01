import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

class Credits extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <div className="title">Credits</div>
                <div className="row offset-sm-8">
                    <Link to="/">
                        <button type="button" className="btn btn-success">Return to Main Menu</button>
                    </Link>
                </div>
                <div className="credits">
                    <h2>HTML, CSS and Javascript code</h2>
                    <ul>
                        <li>What would I do without <a href="http://stackoverflow.com/">Stackoverflow</a></li>
                        <li>In addition to stackoverflow <a href="https://www.w3schools.com/">w3schools</a></li>
                        <li>nodejs.org <a href="https://nodejs.org/">nodejs</a>
                        </li>
                        <li>socket.io <a href="https://socket.io/">socket.io</a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Credits;
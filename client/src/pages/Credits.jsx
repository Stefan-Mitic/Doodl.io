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
                    doodl.io was developed as a MERN stack (MongoDB, Express.js, React.js, Node.js) application. Developed for Hack the Valley III and CSCC09: Programming on the Web, Winter 2019.
                    <h2>J.A.S. Team</h2>
                    <ul>
                        <li><b>Jeffrey Li</b>: back-end (authentication, database logic)</li>
                        <li><b>Alexei Coreiba</b>: back-end (game, socket logic)</li>
                        <li><b>Stefan Mitic</b>: front-end (React)</li>
                    </ul>
                    <h2>HTML, CSS and Javascript code</h2>
                    <ul>
                        <li>What would I do without <a href="http://stackoverflow.com/">Stack Overflow</a></li>
                        <li>In addition to Stack Overflow: <a href="https://www.w3schools.com/">W3Schools</a></li>
                        <li><a href="https://nodejs.org/">Node.js</a></li>
                        <li><a href="https://socket.io/">Socket.io</a></li>
                        <li><a href="https://www.mongodb.com/">MongoDB</a></li>
                        <li><a href="https://github.com/mapbox/pixelmatch">pixelmatch</a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Credits;
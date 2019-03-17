import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'

class Home extends Component {
    render() {
        return (
            <div className="background">
                <Header></Header>
                <div className="row offset-sm-10">
                    <a href="/signout/" id="signout_button" class="btn btn-success header_btn">Signout</a>
                </div>
                <div id="homeButton">
                    <Link to="/lobby"><button type="button" className="btn btn-success btn-lg btn-block">Create Game</button></Link>
                </div>
            </div>
        );
    }
}

export default Home;
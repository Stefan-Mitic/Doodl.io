import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'
import api from '../api';

class Home extends Component {

    signout = event => {
        event.preventDefault();

        api.post(`/signout/`)
        .then(res => {
            console.log(res);
            this.props.history.push("/login");
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <div className="background">
                <Header></Header>
                <div className="row offset-sm-10">
                    <button href="/signout/" id="signout_button" className="btn btn-success header_btn" onClick={this.signout}>Signout</button>
                </div>
                <div id="homeButton">
                    <Link to="/lobby"><button type="button" className="btn btn-success btn-lg btn-block">Create Game</button></Link>
                </div>
            </div>
        );
    }
}

export default Home;
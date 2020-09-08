import React, { Component } from 'react';
import Header from './Header';

class Profile extends Component {

    render() {
        return (
            <div>
                <Header></Header>
                <div className="title">Profile</div>
            </div>
        );
    }
}

export default Profile;
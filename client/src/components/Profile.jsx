import React, { Component } from 'react';
import Header from './Header';

class Profile extends Component {
    constructor(props) {
        super(props);
    }

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
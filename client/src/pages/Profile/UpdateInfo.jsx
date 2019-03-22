import React, { Component } from 'react';
import api from '../../api';
import Profile from '../../components/Profile';

class UpdateInfo extends Component {
    constructor(props) {
        super(props);
        this.newName = React.createRef();
        this.newPwd = React.createRef();
        this.updateName = this.updateName.bind(this);
        this.updatePwd = this.updatePwd.bind(this);
    }

    updateName = event => {
        event.preventDefault();

        let username = this.newName.current.value;
        api.patch(`/api/users/` + username + `/`)
            .then(res => {
                console.log(res);
                localStorage.setItem('username', username);
                this.newName.current.value = '';
            }).catch(err => {
                console.log(err);
            });
    };

    updatePwd = event => {
        event.preventDefault();

        let password = this.newPwd.current.value;
        api.patch(`/api/users/` + password + `/`)
            .then(res => {
                console.log(res);
                this.newPwd.current.value = '';
            }).catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <Profile></Profile>
                <div className="row">
                    <input className="offset-sm-4 col-sm-3" ref={this.newName} type="text" maxLength="30" placeholder="enter new username"></input>
                    <button className="col-sm-2 btn btn-success" onClick={this.updateName}>Update</button>
                </div>
                <div className="row">
                    <input className="offset-sm-4 col-sm-3" ref={this.newPwd} type="text" maxLength="30" placeholder="enter new password"></input>
                    <button className="col-sm-2 btn btn-success" onClick={this.updatePwd}>Update</button>
                </div>
            </div>
        );
    }
}

export default UpdateInfo;
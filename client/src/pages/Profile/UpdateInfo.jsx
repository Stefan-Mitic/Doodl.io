import React, { Component } from 'react';
import { updateName, updatePassword } from '../../api';
import Profile from '../../components/Profile';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class UpdateInfo extends Component {
    constructor(props) {
        super(props);
        this.newName = React.createRef();
        this.oldPwd = React.createRef();
        this.newPwd = React.createRef();
        this.updateName = this.updateName.bind(this);
        this.updatePwd = this.updatePwd.bind(this);
    }

    updateName(e) {
        e.preventDefault();

        let newname = this.newName.current.value;
        updateName(newname, (res) => {
            console.log(res);
            this.newName.current.value = '';
            let cookieOptions = { path: '/', httpOnly: false, maxAge: 60 * 60 * 24 * 7 };
            cookies.set('name', newname, cookieOptions);
        }, (err) => {
            console.log(err);
        });
    };

    updatePwd(e) {
        e.preventDefault();

        let oldPassword = this.oldPwd.current.value;
        let newPassword = this.newPwd.current.value;
        updatePassword(oldPassword, newPassword, (res) => {
            console.log(res);
            this.oldPwd.current.value = '';
            this.newPwd.current.value = '';
        }, (err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <Profile></Profile>
                <div className="row">
                    <input className="offset-sm-4 col-sm-3" ref={this.newName} type="text" maxLength="30" placeholder="enter new name"></input>
                    <button className="col-sm-2 btn btn-success" onClick={(e) => this.updateName(e)}>Update</button>
                </div>
                <div className="row">
                    <input className="offset-sm-4 col-sm-3" ref={this.oldPwd} maxLength="30" type="password" placeholder="enter old password"></input>
                    <input className="offset-sm-4 col-sm-3" ref={this.newPwd} maxLength="30" type="password" placeholder="enter new password"></input>
                    <button className="col-sm-2 btn btn-success" onClick={(e) => this.updatePwd(e)}>Update</button>
                </div>
            </div>
        );
    }
}

export default UpdateInfo;
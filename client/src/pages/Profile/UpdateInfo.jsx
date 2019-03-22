import React, { Component } from 'react';
import { updateName, updatePassword } from '../../api';
import Profile from '../../components/Profile';

class UpdateInfo extends Component {
    constructor(props) {
        super(props);
        this.newName = React.createRef();
        this.oldPwd = React.createRef();
        this.newPwd = React.createRef();
        this.updateName = this.updateName.bind(this);
        this.updatePwd = this.updatePwd.bind(this);
    }

    updateName = event => {
        event.preventDefault();

        let newname = this.newName.current.value;
        updateName(newname, (res) => {
            console.log(res);
        }, (err) => {
            alert(err);
        });
    };

    updatePwd = event => {
        event.preventDefault();

        let oldPassword = this.oldPwd.current.value;
        let newPassword = this.newPwd.current.value;
        updatePassword(oldPassword, newPassword, (res) => {
            console.log(res);
        }, (err) => {
            alert(err);
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
                    <input className="offset-sm-4 col-sm-3" ref={this.oldPwd} type="text" maxLength="30" placeholder="enter old password"></input>
                    <input className="offset-sm-4 col-sm-3" ref={this.newPwd} type="text" maxLength="30" placeholder="enter new password"></input>
                    <button className="col-sm-2 btn btn-success" onClick={this.updatePwd}>Update</button>
                </div>
            </div>
        );
    }
}

export default UpdateInfo;
import React, { Component } from 'react';
import Profile from '../../components/Profile';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { sendFriendRequest, getSentFriendRequests, getReceivedFriendRequests, getFriends } from '../../api';

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = { friends: [], sentReq: [], recReq: [] };
        this.friendName = React.createRef();
        this.sendRequest = this.sendRequest.bind(this);
        this.getSent = this.getSent.bind(this);
        this.getReceived = this.getReceived.bind(this);
        this.getFriends = this.getFriends.bind(this);
        this.unfriend = this.unfriend.bind(this);
        this.remove = this.remove.bind(this);
        this.reject = this.reject.bind(this);
    }

    componentDidMount() {
        this.getSent();
        this.getReceived();
        this.getFriends();
    }

    getSent() {
        getSentFriendRequests(localStorage.getItem('username'), (res) => {
            const sent = [];
            for (const request of res.data) {
                const newRecord = { name: request.recipient, time: request.createdAt };
                sent.push(newRecord);
            }
            this.setState({ sentReq: sent });
        }, (err) => {
            alert(err);
        });
    }

    getReceived() {
        getReceivedFriendRequests(localStorage.getItem('username'), (res) => {
            const received = [];
            for (const request of res.data) {
                const newRecord = { name: request.requester, time: request.createdAt };
                received.push(newRecord);
            }
            this.setState({ recReq: received });
        }, (err) => {
            alert(err);
        });
    }

    getFriends() {
        getFriends(localStorage.getItem('username'), (res) => {
            const friends = [];
            for (const friend of res.data.friends) {
                const newRecord = { name: friend };
                friends.push(newRecord);
            }
            this.setState({ friends: friends });
        }, (err) => {
            alert(err);
        });
    }

    sendRequest(e) {
        e.preventDefault();
        let recipient = this.friendName.current.value;
        sendFriendRequest(recipient, (res) => {
            console.log(res);
            this.friendName.current.value = '';
        }, (err) => {
            alert(err);
        });

        this.getSent() //update sent requests
    }

    unfriend(e, row) {
        
    }

    remove(e, row) {

    }

    reject(e, row) {

    }

    render() {
        const friendCols = [{
            Header: 'Friends',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                Header: 'Remove',
                render: ({ row }) => (<button onClick={(e) => this.unfriend(e, row)}>Click Me</button>)
            }]
        }];

        const sentCols = [{
            Header: 'Sent Requests',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                Header: 'Time',
                accessor: 'time'
            }, {
                Header: 'Remove',
                render: ({ row }) => (<button onClick={(e) => this.remove(e, row)}>Click Me</button>)
            }]
        }];

        const recCols = [{
            Header: 'Received Requests',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                Header: 'Time',
                accessor: 'time'
            }, {
                Header: 'Reject',
                render: ({ row }) => (<button onClick={(e) => this.reject(e, row)}>Click Me</button>)
            }]
        }];


        return (
            <div>
                <Profile></Profile>
                <div className="row">
                    <div className="offset-sm-4 col-sm-4">
                        <ReactTable className="table"
                            data={this.state.friends}
                            columns={friendCols}
                            loadingText={''}
                            showPagination={true}
                            defaultPageSize={5}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="offset-sm-1 col-sm-5">
                        <ReactTable className="table"
                            data={this.state.sentReq}
                            columns={sentCols}
                            loadingText={''}
                            showPagination={true}
                            defaultPageSize={5}
                        />
                        Add A Friend:
                        <input ref={this.friendName} type="text" maxLength="30" placeholder="player username"></input>
                        <button className="btn btn-success" onClick={(e) => this.sendRequest(e)}>Request</button>
                    </div>
                    <div className="col-sm-5">
                        <ReactTable className="table"
                            data={this.state.recReq}
                            columns={recCols}
                            loadingText={''}
                            showPagination={true}
                            defaultPageSize={5}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Friends;
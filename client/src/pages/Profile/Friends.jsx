import React, { Component } from 'react';
import Profile from '../../components/Profile';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { sendFriendRequest, getSentFriendRequests, getReceivedFriendRequests, getFriends, acceptFriendRequests, rejectFriendRequests, unfriend } from '../../api';

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
        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);
    }

    componentDidMount() {
        this.getSent();
        this.getReceived();
        this.getFriends();
    }

    getSent() {
        getSentFriendRequests(localStorage.getItem('username'), (res) => {
            console.log(res);
            const sent = [];
            for (const request of res.data) {
                let date = new Date(request.createdAt);
                const newRecord = { name: request.recipient, date: date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear().toString().slice(-2) };
                sent.push(newRecord);
            }
            this.setState({ sentReq: sent });
        }, (err) => {
            alert(err);
        });
    }

    getReceived() {
        getReceivedFriendRequests(localStorage.getItem('username'), (res) => {
            console.log(res);
            const received = [];
            for (const request of res.data) {
                let date = new Date(request.createdAt);
                const newRecord = { name: request.requester, date: date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear().toString().slice(-2) };
                received.push(newRecord);
            }
            this.setState({ recReq: received });
        }, (err) => {
            alert(err);
        });
    }

    getFriends() {
        getFriends(localStorage.getItem('username'), (res) => {
            console.log(res);
            const friends = [];
            for (const friend of res.data) {
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
            this.getSent();
        }, (err) => {
            alert(err);
        });
    }

    unfriend(e, row) {
        e.preventDefault();

        unfriend(row.name, (res) => {
            console.log(res);
            this.getFriends();
        }, (err) => {
            alert(err);
        });
    }

    remove(e, row) {
        e.preventDefault();

        // TODO: Add to API
        // removeFriendRequest(row.name, (res) => {
        //     console.log(res);
        // }, (err) => {
        //     alert(err);
        // });

        // this.getFriends();
        // this.getReceived();
    }

    accept(e, row) {
        e.preventDefault();

        acceptFriendRequests(row.name, (res) => {
            console.log(res);
            this.getFriends();
            this.getReceived();
        }, (err) => {
            alert(err);
        });
    }

    reject(e, row) {
        e.preventDefault();

        rejectFriendRequests(row.name, (res) => {
            console.log(res);
            this.getReceived();
        }, (err) => {
            alert(err);
        });
    }

    render() {
        const friendCols = [{
            Header: 'Friends',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                width: 100,
                Header: 'Remove',
                style: {
                    textAlign: 'center',
                },
                Cell: ({ row }) => (<button onClick={(e) => this.unfriend(e, row)}>Unfriend</button>)
            }]
        }];

        const sentCols = [{
            Header: 'Sent Requests',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                Header: 'Date',
                accessor: 'date'
            }
                // , {
                //     Header: 'Remove',
                //     Cell: ({ row }) => (<button onClick={(e) => this.remove(e, row)}>Click Me</button>)
                // }
            ]
        }];

        const recCols = [{
            Header: 'Received Requests',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                Header: 'Date',
                accessor: 'date'
            }, {
                width: 75,
                Header: 'Accept',
                Cell: ({ row }) => (<button onClick={(e) => this.accept(e, row)}>Yes</button>)
            }, {
                width: 75,
                Header: 'Reject',
                Cell: ({ row }) => (<button onClick={(e) => this.reject(e, row)}>No</button>)
            }]
        }];


        return (
            <div>
                <Profile></Profile>
                <div className="row">
                    <div className="offset-sm-3 col-sm-6">
                        <ReactTable className="table center"
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
                        <ReactTable className="table center"
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
                        <ReactTable className="table center"
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
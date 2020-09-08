import React, { Component } from 'react';
import Profile from '../../components/Profile';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { sendFriendRequest, getSentFriendRequests, getReceivedFriendRequests, getFriends, acceptFriendRequests, rejectFriendRequests, unfriend } from '../../api';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = { friends: [], sentReq: [], recReq: [], friendsPage: 0, sentPage: 0, recPage: 0 };
        this.friendName = React.createRef();
        this.sendRequest = this.sendRequest.bind(this);
        this.getSent = this.getSent.bind(this);
        this.getReceived = this.getReceived.bind(this);
        this.getFriends = this.getFriends.bind(this);
        this.unfriend = this.unfriend.bind(this);
        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);
    }

    componentDidMount() {
        this.getSent();
        this.getReceived();
        this.getFriends();
        this.interval = setInterval(() => {
            this.getSent();
            this.getReceived();
            this.getFriends();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getSent(e, isNext, isPrev) {
        if (e) e.preventDefault();
        let page = this.state.sentPage;
        if (isNext)
            page = page + 1;
        else if (isPrev && page !== 0) {
            page = page - 1;
        }

        getSentFriendRequests(cookies.get('username'), page, (res) => {
            const sent = [];
            for (const request of res.data) {
                let date = new Date(request.createdAt);
                const newRecord = { name: request.recipient, date: date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear().toString().slice(-2) };
                sent.push(newRecord);
            }
            if (res.data && res.data.length > 0)
                this.setState({ sentReq: sent, sentPage: page });
            else if (!isNext && !isPrev)
                this.setState({ sentReq: sent});
        }, (err) => {
            console.log(err);
        });
    }

    getReceived(e, isNext, isPrev) {
        if (e) e.preventDefault();
        let page = this.state.recPage;
        if (isNext)
            page = page + 1;
        else if (isPrev && page !== 0) {
            page = page - 1;
        }

        getReceivedFriendRequests(cookies.get('username'), page, (res) => {
            const received = [];
            for (const request of res.data) {
                let date = new Date(request.createdAt);
                const newRecord = { name: request.requester, date: date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear().toString().slice(-2) };
                received.push(newRecord);
            }
            if (res.data && res.data.length > 0)
                this.setState({ recReq: received, recPage: page });
            else if (!isNext && !isPrev)
                this.setState({ recReq: received });
        }, (err) => {
            console.log(err);
        });
    }

    getFriends(e, isNext, isPrev) {
        if (e) e.preventDefault();
        let page = this.state.friendsPage;
        if (isNext)
            page = page + 1;
        else if (isPrev && page !== 0) {
            page = page - 1;
        }

        getFriends(cookies.get('username'), page, (res) => {
            const friends = [];
            for (const friend of res.data) {
                const newRecord = { name: friend };
                friends.push(newRecord);
            }
            if (res.data && res.data.length > 0)
                this.setState({ friends: friends, friendsPage: page });
            else if (!isNext && !isPrev)
                this.setState({ friends: friends});
        }, (err) => {
            console.log(err);
        });
    }

    sendRequest(e) {
        e.preventDefault();
        let recipient = this.friendName.current.value;
        sendFriendRequest(recipient, () => {
            this.friendName.current.value = '';
            this.getSent();
        }, (err) => {
            console.log(err);
        });
    }

    unfriend(e, row) {
        e.preventDefault();

        unfriend(row.name, (res) => {
            this.getFriends();
        }, (err) => {
            console.log(err);
        });
    }

    accept(e, row) {
        e.preventDefault();

        acceptFriendRequests(row.name, (res) => {
            this.getFriends();
            this.getReceived();
        }, (err) => {
            console.log(err);
        });
    }

    reject(e, row) {
        e.preventDefault();

        rejectFriendRequests(row.name, (res) => {
            this.getReceived();
        }, (err) => {
            console.log(err);
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
            }]
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
                        <div className="custom-table">
                            <ReactTable className="table center"
                                data={this.state.friends}
                                columns={friendCols}
                                loadingText={''}
                                showPagination={false}
                                pageSize={5}
                            />
                            <div className="center">
                                <button
                                    onClick={(e) => this.getFriends(e, false, true)}>
                                    Prev
                                </button>
                                <button
                                    onClick={(e) => this.getFriends(e, true, false)}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="offset-sm-1 col-sm-5">
                        <div className="custom-table">
                            <ReactTable className="table center"
                                data={this.state.sentReq}
                                columns={sentCols}
                                loadingText={''}
                                showPagination={false}
                                pageSize={5}
                            />
                            <div className="center">
                                <button
                                    onClick={(e) => this.getSent(e, false, true)}>
                                    Prev
                                </button>
                                <button
                                    onClick={(e) => this.getSent(e, true, false)}>
                                    Next
                                </button>
                            </div>
                        </div>

                        Add A Friend:
                        <input ref={this.friendName} type="text" maxLength="30" placeholder="player username"></input>
                        <button className="btn btn-success" onClick={(e) => this.sendRequest(e)}>Request</button>
                    </div>
                    <div className="col-sm-5">
                        <div className="custom-table">
                            <ReactTable className="table center"
                                data={this.state.recReq}
                                columns={recCols}
                                loadingText={''}
                                showPagination={false}
                                pageSize={5}
                            />
                            <div className="center">
                                <button
                                    onClick={(e) => this.getReceived(e, false, true)}>
                                    Prev
                                </button>
                                <button
                                    onClick={(e) => this.getReceived(e, true, false)}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Friends;
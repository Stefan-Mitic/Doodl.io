import React, { Component } from 'react';
import Profile from '../../components/Profile';
import ReactTable from "react-table";
import "react-table/react-table.css";

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = { friends: [], sentReq: [], recReq: [] };
    }

    render() {
        const friendCols = [{
            Header: 'Friends',
            columns: [{
                Header: 'Player',
                accessor: 'name'
            }, {
                Header: 'Remove',
                render: ({ row }) => (<button onClick={(e) => this.handleButtonClick(e, row)}>Click Me</button>)
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
                render: ({ row }) => (<button onClick={(e) => this.handleButtonClick(e, row)}>Click Me</button>)
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
                render: ({ row }) => (<button onClick={(e) => this.handleButtonClick(e, row)}>Click Me</button>)
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
                        <input ref={this.newPwd} type="text" maxLength="30" placeholder="player username"></input>
                        <button className="btn btn-success" onClick={this.updatePwd}>Request</button>
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
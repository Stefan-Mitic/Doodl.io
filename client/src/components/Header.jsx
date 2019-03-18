import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

let socket;
class Header extends Component {
    constructor() {
        super();
        this.state = {
          endpoint: "http://localhost:5000/"
        };
    
        socket = socketIOClient(this.state.endpoint);
      }
    render() {
        return (
            <div className="header"></div>
        );
    }
}
export default Header;
export {socket};

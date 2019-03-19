import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import history from '../history';
import api from '../api';

let socket;
class Header extends Component {
    constructor() {
        super();
        this.signout = this.signout.bind(this);
        this.state = {
            endpoint: "http://localhost:5000/"
        };

        socket = socketIOClient(this.state.endpoint);
    }

    signout = event => {
        event.preventDefault();

        api.post(`/signout/`)
            .then(res => {
                console.log(res);
                history.push("/login");
                localStorage.clear();
            }).catch(err => {
                console.log(err);
                localStorage.clear();
            });
    };

    render() {
        return (
            <Navbar className="navbar">
                <Navbar.Brand>
                    <img src={require("./../Doodlio.png")} width={200} alt={"logo"}></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavItem>
                            <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink exact to="/profile" className="nav-link">Profile</NavLink>
                        </NavItem>
                    </Nav>
                    <Nav className="ml-auto">
                        {
                            !localStorage.getItem('username') ?
                                <NavItem>
                                    <NavLink exact to="/login" className="nav-link">Login</NavLink>
                                </NavItem>
                                :
                                <NavItem>
                                    <NavLink to="/login" className="nav-link" onClick={this.signout}>Signout</NavLink>
                                </NavItem>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
export default Header;
export { socket };

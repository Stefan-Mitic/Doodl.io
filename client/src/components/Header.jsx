import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';
import history from '../history';
import { signout } from '../api';

const cookies = new Cookies();

class Header extends Component {
    constructor() {
        super();
        this.signout = this.signout.bind(this);
    }

    signout(e) {
        e.preventDefault();
        signout(() => {
            history.push("/login");
        }, (err) => {
            alert(err);
        });
        cookies.set('username', '');
    }

    render() {
        return (
            <Navbar className="navbar">
                <Navbar.Brand>
                    <NavLink exact to="/" className="nav-link" activeClassName="active">
                        <img src={require("./../Doodlio.png")} width={200} alt={"logo"}></img>
                    </NavLink>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavItem>
                            <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
                        </NavItem>
                        <NavDropdown title="Profile" id="basic-nav-dropdown">
                            <NavItem>
                                <NavLink exact to="/profile/friends" className="nav-link" activeClassName="active">Friends</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink exact to="/profile/gamehistory" className="nav-link">Game History</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink exact to="/profile/updateinfo" className="nav-link">Update Info</NavLink>
                            </NavItem>
                        </NavDropdown>
                        <NavItem>
                            <NavLink exact to="/leaderboard" className="nav-link" activeClassName="active">Leaderboard</NavLink>
                        </NavItem>
                    </Nav>
                    <Nav className="ml-auto">
                        {
                            !cookies.get('username') ?
                                <NavItem>
                                    <NavLink exact to="/login" className="nav-link">Login</NavLink>
                                </NavItem>
                                :
                                <NavItem>
                                    <NavLink to="/login" className="nav-link" onClick={(e) => this.signout(e)}>Signout</NavLink>
                                </NavItem>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
export default Header;

import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel, Form } from "react-bootstrap";
import Cookies from 'universal-cookie';
import { signin, signup } from '../api';
import Header from '../components/Header';

const cookies = new Cookies();

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e, isSignup) {
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        let cookieOptions = { path: '/', httpOnly: false, maxAge: 60 * 60 * 24 * 7 };
        if (isSignup) {
            signup(user, (res) => {
                console.log(res);
                cookies.set('username', res.data, cookieOptions);
                cookies.set('name', res.data, cookieOptions);
                this.props.history.push("/");
            }, () => {
                alert("Invalid Input:\nusername must be at least 3 characters\npassword must be at least 6 characters");
            });
        } else {
            signin(user, (res) => {
                console.log(res);
                cookies.set('username', res.data.username, cookieOptions);
                cookies.set('name', res.data.name, cookieOptions);
                this.props.history.push("/");
            }, () => {
                alert("Incorrect username and password");
            });
        }
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    render() {
        return (
            <div className="background">
                <Header></Header>
                <div className="login">
                    <Form>
                        <FormGroup controlId="username">
                            <FormLabel>Username</FormLabel>
                            <FormControl
                                autoFocus
                                type="text"
                                value={this.state.username}
                                onChange={(e) => this.handleChange(e)}
                            />
                        </FormGroup>
                        <FormGroup controlId="password">
                            <FormLabel>Password</FormLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={(e) => this.handleChange(e)}
                                type="password"
                            />
                        </FormGroup>
                        <div className="text-center">
                            <Button disabled={!this.validateForm()} type="submit" onClick={(e) => this.handleSubmit(e, false)}>Sign in</Button> or <Button disabled={!this.validateForm()} type="submit" onClick={(e) => this.handleSubmit(e, true)}>Sign up</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;
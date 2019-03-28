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

    handleSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        let cookieOptions = { path: '/', httpOnly: false, maxAge: 60 * 60 * 24 * 7 };
        if (signup) {
            signup(user, (res) => {
                console.log(res);
                cookies.set('username', res.data, cookieOptions);
                localStorage.setItem('username', res.data);
                this.props.history.push("/");
            }, (err) => {
                alert(err);
            });
        } else {
            signin(user, (res) => {
                console.log(res);
                cookies.set('username', res.data, cookieOptions);
                localStorage.setItem('username', res.data);
                this.props.history.push("/");
            }, (err) => {
                alert(err);
            });
        }
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
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
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password">
                            <FormLabel>Password</FormLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
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
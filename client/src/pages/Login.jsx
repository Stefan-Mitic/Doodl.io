import React, { Component } from 'react';
import API from '../api';
import { Button, FormGroup, FormControl, FormLabel, Form } from "react-bootstrap";
import Header from '../components/Header';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.signin = this.signin.bind(this);
        this.signup = this.signup.bind(this);
    }

    signin() {
        const user = {
            username: this.state.username,
            password: this.state.password
        }

        API.post(`users/signin/`, { user })
        .then(res => {
            console.log(res);
            this.props.history.push("/");
        }).catch(err => {
            console.log(err);
        })
    }

    signup() {
        const user = {
            username: this.state.username,
            password: this.state.password
        }

        API.post(`users/signup/`, { user })
        .then(res => {
            console.log(res);
            this.props.history.push("/");
        }).catch(err => {
            console.log(err);
        })
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
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
                            <Button disabled={!this.validateForm()} type="submit" onClick={this.signin}>Sign in</Button> or <Button disabled={!this.validateForm()} type="submit" onClick={this.signup}>Sign up</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;
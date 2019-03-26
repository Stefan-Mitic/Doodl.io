import React, { Component } from 'react';
import api from '../api';
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    signin(e) {
        e.preventDefault();
        this.handleSubmit("signin")
    }

    signup(e) {
        e.preventDefault();
        this.handleSubmit("signup");
    }

    handleSubmit(action) {
        const user = {
            username: this.state.username,
            password: this.state.password
        }
        api.post(`/` + action + `/`, user)
        .then(res => {
            console.log(res);
            localStorage.setItem('username', res.data);
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
                            <Button disabled={!this.validateForm()} type="submit" onClick={(e) => this.signin(e)}>Sign in</Button> or <Button disabled={!this.validateForm()} type="submit" onClick={(e) => this.signup(e)}>Sign up</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;
import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel, Form } from "react-bootstrap";
import Header from '../components/Header'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
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
                            <Button id="login" disabled={!this.validateForm()} type="submit">Login</Button> or <Button id="register" disabled={!this.validateForm()} type="submit">Register</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;
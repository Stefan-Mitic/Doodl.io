import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Home from '../pages/Home';

// let getUsername = function(){
//     return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
// };

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('data')
            ? <Home />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)
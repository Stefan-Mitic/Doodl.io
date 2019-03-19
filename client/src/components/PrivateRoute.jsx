import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// let getUsername = function(){
//     return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
// };

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('username')
            ? <Component {...props} />
            : <Redirect to="/login" />
    )} />
)
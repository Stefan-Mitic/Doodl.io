import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect } from 'react-router-dom';
import './index.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import Lobby from './pages/Lobby.jsx';
import Game from './pages/Game.jsx';
import PostGame from './pages/PostGame.jsx';
import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { PrivateRoute } from './components/PrivateRoute';
import history from './history';

ReactDOM.render(<Router history={history}>
    <div>
        <PrivateRoute exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/lobby/:id" component={Lobby} />
        <Route path="/game" component={Game} />
        <Route path="/postgame" component={PostGame} />
    </div>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
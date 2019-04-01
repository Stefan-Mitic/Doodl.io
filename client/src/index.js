import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
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
import UpdateInfo from './pages/Profile/UpdateInfo';
import Friends from './pages/Profile/Friends';
import GameHistory from './pages/Profile/GameHistory';
import Leaderboard from './pages/Leaderboard';
import Credits from './pages/Credits';

ReactDOM.render(<Router history={history}>
    <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/credits" component={Credits} />
        <PrivateRoute path="/lobby/:id" component={Lobby} />
        <PrivateRoute path="/game/:id" component={Game} />
        <PrivateRoute path="/postgame/:id" component={PostGame} />
        <PrivateRoute path="/profile/friends" component={Friends} />
        <PrivateRoute path="/profile/gamehistory" component={GameHistory} />
        <PrivateRoute path="/profile/updateinfo" component={UpdateInfo} />
        <PrivateRoute path="/leaderboard" component={Leaderboard} />
    </Switch>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
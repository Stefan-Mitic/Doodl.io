const express = require('express');
const app = express();

// mongodb middleware
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/doodlio', { useNewUrlParser: true });
const Schema = mongoose.Schema;

// entry for registered user
const UserModel = mongoose.model('image', new Schema({
    username: { type: String, index: true},
    hash: String,
    salt: String,
    dateJoined: { type: Date, default: Date.now }
}));

// cookie and crypto
const cookie = require('cookie');
const crypto = require('crypto');

// generates a random salt of 16 bytes
function generateSalt() {
    return crypto.randomBytes(16).toString('base64');
}

// generates a salted SHA512 hash
function generateHash(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

// middleware module to handle HTTP POST data
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// session module to handle authentication
const session = require('express-session');
app.use(session({
    secret: 'Trigger, time to show the other guys that we get wet, wild, and do dirty, dirty things.',
    resave: false,
    saveUninitialized: true,
}));

// set username field on behalf of session authentication
app.use(function (req, res, next) {
    req.username = (req.session.username) ? req.session.username : null;
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
});

// middleware to check if user is authenticated
let isAuthenticated = function (req, res, next) {
    if (!req.username) return res.status(401).end("Access denied");
    next();
};

// sign-up a new user
app.post('/signup/', function (req, res, next) {
    if (req.username) return res.status(403).end(`User is already signed in as ${req.username}`);
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) return res.status(400).end(`Username and password required`);
    // check if user already exists
    UserModel.findOne({ _id: username }, function (err, user) {
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end("username " + username + " already exists");
        // generate salt and hash for password
        let salt = generateSalt();
        let hash = generateHash(password, salt);
        // insert new user into database
        let userdata = { _id: username, hash: hash, salt: salt, uploads: 0 };
        UserModel.update({ _id: username }, userdata, { upsert: true }, function (err) {
            if (err) return res.status(500).end(err);
            // initialize session and cookie
            req.session.username = username;
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path : '/', 
                maxAge: 60 * 60 * 24 * 7
            }));
            return res.json("user " + username + " signed up");
        });
    });
});

// sign-in an existing user
app.post('/signup/', function (req, res, next) {
    if (req.username) return res.status(403).end(`User is already signed in as ${req.username}`);
    let username = req.body.username;
    let password = req.body.password;
    // retrieve user from the database
    UserModel.findOne({ _id: username }, function (err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("Access denied, username does not exist");
        // generate salted hash to compare
        let hash = generateHash(password, user.salt);
        if (user.hash !== hash) return res.status(401).end("Access denied, incorrect password"); 
        // initialize session and cookie
        req.session.username = username;
        res.setHeader('Set-Cookie', cookie.serialize('username', username, {
              path : '/',
              maxAge: 60 * 60 * 24 * 7
        }));
        return res.json("user " + username + " signed in");
    });
});

// sign-out the current user
app.get('/signout/', function (req, res, next) {
    let username = req.username;
    if (!username) return res.status(403).end(`User has not been authenticated`);
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    return res.json("user " + username + " signed out");
});

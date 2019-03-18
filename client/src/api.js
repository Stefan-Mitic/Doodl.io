import axios from 'axios';
// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:5000');

export default axios.create({
    baseURL: `http://localhost:5000/`
});
import React, { Component } from 'react';
// import {subscribeToAddPeer} from '../api';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';
import { emitMouse, subscribeToMouse } from '../api';

const cookies = new Cookies();
// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse

class CanvasDraw extends Component {
    constructor(props) {
        super(props);
        this.canvas = null;
        this.ctx = null;
        this.pos = null;
        this.setPosition = this.setPosition.bind(this);
        this.streamDraw = this.streamDraw.bind(this);
        this.draw = this.draw.bind(this);
        this.peer_media = [];
        this.gameId = this.props.gameId;
        this.username = cookies.get('username');
        this.players = this.props.players;
    }

    componentDidMount() {
        this.canvas = document.getElementById("canvas");
        if (this.canvas !== null) {
            this.ctx = this.canvas.getContext('2d');
            this.ctx.canvas.width = 475;
            this.ctx.canvas.height = 475;
            this.canvas.style.position = 'fixed';
            this.canvas.style.border = '1px solid blue';
            this.canvas.style.backgroundImage = "url(" + this.props.bgsrc + ")";
        }
        this.pos = { x: 0, y: 0 };

        ReactDOM.findDOMNode(this).addEventListener('mousemove', this.draw);
        ReactDOM.findDOMNode(this).addEventListener('mousedown', this.setPosition);
        ReactDOM.findDOMNode(this).addEventListener('mouseenter', this.setPosition);

        // [0]: username [1]: stream
        for (let i = 0; i < this.players.length; i++) {
            let stream = document.getElementById('stream_' + (i + 1));
            this.peer_media[this.players[i].name] = stream;
            stream.style.visibility = 'visible';
        }
        subscribeToMouse(this.streamDraw);
    }

    streamDraw(username, data) {
        let ctx = this.peer_media[username].getContext('2d');
        console.log(`Draw from ${username}: ${data.x} ${data.y}`);
        ctx.fillStyle = '#000000';
        ctx.fillRect(data.x * 0.6, data.y * 0.3, 5, 5);
    }

    setPosition(e) {
        this.pos.x = e.clientX - this.canvas.offsetLeft;
        this.pos.y = e.clientY - this.canvas.offsetTop;
    }

    draw(e) {
        if (e.buttons !== 1) return;

        if (this.ctx !== null) {
            this.ctx.beginPath();

            this.ctx.lineWidth = this.props.lineWidth;
            this.ctx.lineCap = 'round';
            this.ctx.strokeStyle = '#000000';

            this.ctx.moveTo(this.pos.x, this.pos.y);
            this.setPosition(e);
            this.ctx.lineTo(this.pos.x, this.pos.y);

            this.ctx.stroke();
            emitMouse(this.gameId, this.username, { x: this.pos.x, y: this.pos.y });
        }
    }

    render() {
        return (
            <div id="canvasdraw">
                <canvas id="canvas"></canvas>
                <div id="stream_label_1">{this.players[0].name}'s screen</div>
                <canvas className="streams" id="stream_1"></canvas>
                <div id="stream_label_2">
                    {this.players.length === 2
                        ? this.players[1].name + "'s screen"
                        : null}
                </div>
                <canvas className="streams hidden" id="stream_2"></canvas>
                <div id="stream_label_3">
                    {this.players.length === 3
                        ? this.players[2].name + "'s screen"
                        : null}
                </div>
                <canvas className="streams hidden" id="stream_3"></canvas>
                <div id="stream_label_4">
                    {this.players.length === 4
                        ? this.players[3].name + "'s screen"
                        : null}
                </div>
                <canvas className="streams hidden" id="stream_4"></canvas>
            </div>
        );
    }
}

export default CanvasDraw;
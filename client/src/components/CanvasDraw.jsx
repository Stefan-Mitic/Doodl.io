import React, { Component } from 'react';
import {subscribeToAddPeer} from '../api';
import ReactDOM from 'react-dom';

// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse

class CanvasDraw extends Component {
    constructor(props) {
        super(props);
        this.canvas = null;
        this.ctx = null;
        this.pos = null;
        this.setPosition = this.setPosition.bind(this);
        this.draw = this.draw.bind(this);
        this.stream1 = null;
        this.stream = null;
        this.connectToStream = this.connectToStream.bind(this);
        this.peer_media1 = [];
        this.peer_media2 = [];
        this.peer_media3 = [];
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

        this.stream = this.canvas.captureStream();
        this.my_stream = document.getElementById('stream_1');
        this.my_stream.srcObject = this.stream;

        // [0]: is already streaming? [1]: stream
        this.peer_media1[0] = false;
        this.peer_media2[0] = false;
        this.peer_media3[0] = false;
        this.peer_media1[1] = document.getElementById('stream_2');
        this.peer_media2[1] = document.getElementById('stream_3');
        this.peer_media3[1] = document.getElementById('stream_4');
        
        subscribeToAddPeer(this.stream, this.connectToStream);
    }

    connectToStream(stream) {
        if (!this.peer_media1[0]) {
            this.peer_media1[1].srcObject = stream;
            this.peer_media1[0] = true;
        } else if (!this.peer_media2[0]) {
            this.peer_media2[1].srcObject = stream;
            this.peer_media2[0] = true;
        } else if (!this.peer_media3[0]) {
            this.peer_media3[1].srcObject = stream;
            this.peer_media3[0] = true;
        } else {
            console.log("Error: Media full");
        }
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
        }
    }

    render() {
        return (
            <div>
                <canvas id="canvas"></canvas>
                <video id="stream_1" playsInline autoPlay></video>
                <video id="stream_2" playsInline autoPlay></video>
                <video id="stream_3" playsInline autoPlay></video>
                <video id="stream_4" playsInline autoPlay></video>
            </div>
        );
    }
}

export default CanvasDraw;
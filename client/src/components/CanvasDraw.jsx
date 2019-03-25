import React, { Component } from 'react';
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
    }

    setPosition(e) {
        this.pos.x = e.clientX - this.canvas.offsetLeft;
        this.pos.y = e.clientY - this.canvas.offsetTop;
    }

    draw(e) {
        if (e.buttons !== 1) return;

        if (this.ctx !== null) {
            this.ctx.beginPath();

            this.ctx.lineWidth = 10;
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
            <canvas id="canvas"></canvas>
        );
    }
}

export default CanvasDraw;
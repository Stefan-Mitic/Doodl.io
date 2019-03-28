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

            // this.loadBackground("url(" + this.props.bgsrc + ")");
            // this.loadBackground(this.props.bgsrc, function (url) {
            //     console.log('set');
            //     // this.canvas.style.backgroundImage = "url(" + url + ")";
            // });
        }
        this.pos = { x: 0, y: 0 };

        ReactDOM.findDOMNode(this).addEventListener('mousemove', this.draw);
        ReactDOM.findDOMNode(this).addEventListener('mousedown', this.setPosition);
        ReactDOM.findDOMNode(this).addEventListener('mouseenter', this.setPosition);
    }

    // loadBackground(url) {
    //     let background = document.createElement('div');
    //     background.id = 'background'
    //     background.className = 'overlap';
    //     background.style.backgroundImage = "url(" + url + ")";
    //     background.style.backgroundSize = '475px';
    //     background.style.width = '475px';
    //     background.style.height = '475px';
    //     background.style.opacity = 0.5;
    //     document.getElementById('test').append(background);
    //     // this.canvas.append(image);
    //     console.log(document.getElementById('test'));
    // }

    // loadBackground(url, callback) {
    //     let image = new Image();
    //     image.src = url;
    //     image.crossOrigin = "Anonymous";

    //     let bCanvas = document.createElement('canvas');
    //     bCanvas.width = 475;
    //     bCanvas.height = 475;

    //     let bctx = bCanvas.getContext('2d');
    //     image.onload = function () {
    //         bctx.drawImage(image, 0, 0);
    //         let imageData = bctx.getImageData(0, 0, 475, 475);
    //         for (var i = 0; i < imageData.data.length; i++) {
    //             if (imageData.data[i] === 0)
    //                 imageData.data[i] = 150;
    //         }
    //         bctx.putImageData(imageData, 0, 0);
    //         console.log('done');
    //         callback(bCanvas.toDataURL());
    //     }
    // }

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
            <canvas id="canvas"></canvas>
        );
    }
}

export default CanvasDraw;
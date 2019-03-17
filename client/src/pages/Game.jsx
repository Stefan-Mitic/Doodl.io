import React, { Component } from 'react';
import CanvasDraw from "react-canvas-draw";
import ReactCountdownClock from 'react-countdown-clock';
import { Redirect } from 'react-router-dom';
import html2canvas from 'html2canvas';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = { round: 1 };
        this.roundEnd = this.roundEnd.bind(this);
        this.clockRef = React.createRef();
        this.canvas = React.createRef();
        this.image = React.createRef();
    }

    componentDidMount() {
        this.state.round = 1; // Get round
        this.image.src = require("./../pic_2.png"); // Get Img Src
    }

    roundEnd() {
        var img = new Image();
        html2canvas(document.getElementById("canvas")).then(canvas => {
            img.src = canvas.toDataURL('image/png');
            // var win = window.open();
            // win.document.write('<iframe src="' + img.src + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        });
    }

    render() {
        return (
            <div>
                <div id="logo"></div>
                <div id="canvasBackground">
                    <div className="row">
                        <div id="infoPanel" className="col-sm-2">
                            <h1>Round {this.state.round}</h1>
                            <ReactCountdownClock ref={this.clockRef}
                                seconds={2}
                                color={"blue"}
                                alpha={0.9}
                                size={100}
                                onComplete={this.roundEnd}
                            />
                        </div>
                        <div className="col-sm-4">
                            <img ref={image => this.image = image} width={475}></img>
                        </div>
                        <div id="canvas" className="col-sm-4">
                            <CanvasDraw ref={canvas => this.canvas = canvas} canvasWidth={475} canvasHeight={475} brushRadius={2} hideGrid={true} brushColor={"black"} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
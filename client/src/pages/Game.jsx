import React, { Component } from 'react';
import CanvasDraw from "react-canvas-draw";
import ReactCountdownClock from 'react-countdown-clock';
import html2canvas from 'html2canvas';
import { saveDrawing, imageCompare, getImageId, getImage } from '../api';
import history from '../history';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = { round: 1 };
        this.roundEnd = this.roundEnd.bind(this);
        this.gameEnd = this.gameEnd.bind(this);
        this.updatePlayerScore = this.updatePlayerScore.bind(this);
        this.clockRef = React.createRef();
        this.canvas = React.createRef();
        this.image = React.createRef();
        this.players = this.props.location.state.players;
        this.gameId = this.props.match.params.id;
        this.imageId = -1;
    }

    componentDidMount() {
        // this.state.round = 1; // Get round

        getImageId(this.gameId, (res) => {
            console.log(res);
            this.imageId = res.data;
            if (this.imageId !== -1) {
                getImage(this.imageId, (res) => {
                    console.log(res);
                    this.image.src = res.config.url;
                }, (err) => {
                    alert(err);
                });
            }
        }, (err) => {
            alert(err);
        });
    }

    async roundEnd() {
        let img = new Image();
        //get drawing from frontend
        await html2canvas(document.getElementById("canvas"), {
            width: 475,
            height: 475
        }).then(canvas => {
            img.src = canvas.toDataURL('image/png');
            // var win = window.open();
            // win.document.write('<iframe src="' + img.src + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        });

        const drawing = {
            imageId: this.imageId,
            gameId: this.gameId,
            dataURL: img.src
        };

        let drawingId = -1;
        saveDrawing(drawing, (res) => {
            console.log(res);
            drawingId = res.data._id;
            if (drawingId !== -1) {
                imageCompare(this.imageId, drawingId, (res) => {
                    console.log(res);
                    this.updatePlayerScore(res.data.difference);
                }, (err) => {
                    alert(err);
                });
            }
        }, (err) => {
            alert(err);
        });

        if (this.state.round === 1)
            this.gameEnd();
    }

    updatePlayerScore(score) {
        console.log(score);
    }

    gameEnd() {
        history.push({ pathname: "/postgame/" + this.gameId, state: { players: this.players } });
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
                                seconds={10}
                                color={"blue"}
                                alpha={0.9}
                                size={100}
                                onComplete={this.roundEnd}
                            />
                        </div>
                        <div className="col-sm-4">
                            <img ref={image => this.image = image} width={475} alt={''}></img>
                        </div>
                        <div id="canvas" className="col-sm-4">
                            <CanvasDraw ref={canvas => this.canvas = canvas} canvasWidth={475} canvasHeight={475} brushRadius={8} hideGrid={true} brushColor={"black"} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
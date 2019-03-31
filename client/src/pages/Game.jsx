import React, { Component } from 'react';
import CanvasDraw from "../components/CanvasDraw";
import html2canvas from 'html2canvas';
import { saveDrawing, imageCompare, getImageId, getImage, addPlayerScore, unsubscribeFromCounter, subscribeToCounter } from '../api';
import history from '../history';
import Cookies from 'universal-cookie';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = { round: 1, bgsrc: null, lineWidth: 5, time: 10 };
        this.roundEnd = this.roundEnd.bind(this);
        this.gameEnd = this.gameEnd.bind(this);
        this.updateCounter = this.updateCounter.bind(this);
        this.updatePlayerScore = this.updatePlayerScore.bind(this);
        this.loadImage = this.loadImage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clockRef = React.createRef();
        this.canvas = React.createRef();
        this.image = React.createRef();
        this.players = this.props.location.state.players;
        this.gameId = this.props.match.params.id;
        this.imageId = -1;
        this.loadImage();
    }

    componentDidMount() {
        subscribeToCounter(this.updateCounter);
    }

    componentWillUnmount() {
        unsubscribeFromCounter();
    }

    loadImage() {
        getImageId(this.gameId, (res) => {
            console.log(res);
            this.imageId = res.data;
            if (this.imageId !== -1) {
                getImage(this.imageId, (res) => {
                    console.log(res);
                    this.setState({ bgsrc: res.config.url });
                    console.log(this.state.bgsrc);
                }, (err) => {
                    console.log(err);
                });
            }
        }, (err) => {
            console.log(err);
        });
    }

    async roundEnd() {
        let img = new Image();
        //get drawing from frontend
        await html2canvas(document.getElementById("canvas-div"), {
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
                    console.log(err);
                });
            }
        }, (err) => {
            console.log(err);
        });
    }

    updatePlayerScore(score) {
        const cookies = new Cookies();

        addPlayerScore(cookies.get('username'), this.gameId, score, (res) => {
            console.log(res);
            if (this.state.round === 1)
                this.gameEnd();
        }, (err) => {
            console.log(err);
        });
    }

    gameEnd() {
        // history.push({ pathname: "/postgame/" + this.gameId });
    }

    handleChange(e) {
        this.setState({ lineWidth: e.target.value });
    }

    updateCounter(counter) {
        if (counter === -1) {
            this.roundEnd();
        } else {
            this.setState({ time: counter });
        }
    }

    render() {
        return (
            <div>
                <div id="logo"></div>
                <div id="canvasBackground">
                    <div className="row">
                        <div id="infoPanel" className="col-sm-2">
                            <h1>Round {this.state.round}</h1>
                            <h3>Time: {this.state.time}</h3>
                            <div>Line Width</div>
                            <select
                                value={this.state.selectValue}
                                onChange={this.handleChange}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                        <div id="canvas-div">
                            {this.state.bgsrc ?
                                <CanvasDraw bgsrc={this.state.bgsrc} lineWidth={this.state.lineWidth} gameId={this.gameId} players={this.players}></CanvasDraw>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
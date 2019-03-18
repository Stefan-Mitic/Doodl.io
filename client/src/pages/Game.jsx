import React, { Component } from 'react';
import CanvasDraw from "react-canvas-draw";
import ReactCountdownClock from 'react-countdown-clock';
import html2canvas from 'html2canvas';
import api from '../api';
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
        this.images = this.props.location.state.images;
        this.players = this.props.location.state.players;
        this.gameId = this.props.match.params.id;
    }

    componentDidMount() {
        // this.state.round = 1; // Get round

        api.get(`/api/game/images/` + this.images[0] + '/file/')
            .then(res => {
                console.log(res);
                this.image.src = res.config.url;
            }).catch(err => {
                console.log(err);
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
            imageId: this.images[0],
            gameId: this.gameId,
            dataURL: img.src
        };

        let imgId = -1;
        //save drawing to DB
        await api.post('/api/drawings/', drawing)
            .then(res => {
                console.log(res);
                imgId = res.data._id;
            }).catch(err => {
                console.log(err);
            });

        if (imgId !== -1) {
            const data = {
                drawingId: imgId
            };

            //compare drawing with image
            await api.post(`/api/game/images/` + this.images[0] + `/compare/`, data)
                .then(res => {
                    console.log(res);
                    this.updatePlayerScore(res.data.difference);
                }).catch(err => {
                    console.log(err);
                });
        }

        if (this.state.round === 1)
            this.gameEnd();
    }

    updatePlayerScore(score) {

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
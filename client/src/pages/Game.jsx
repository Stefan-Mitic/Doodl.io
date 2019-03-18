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
        // this.images = this.props.location.state.images;
        this.images = ["5c8ec548455150259e6f3922", "5c8ec548455150259e6f391e", "5c8ec548455150259e6f391f", "5c8ec548455150259e6f391d", "5c8ec548455150259e6f3920"];
        this.players = this.props.location.state.players;
        this.gameId = this.props.match.params.id;
    }

    componentDidMount() {
        this.state.round = 1; // Get round

        api.get(`/api/game/images/` + this.images[0] + '/')
            .then(res => {
                console.log(res);
                this.image.src = res.config.url;
            }).catch(err => {
                console.log(err);
            });
    }

    async roundEnd() {
        let img = new Image();
        await html2canvas(document.getElementById("canvas")).then(canvas => {
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
        console.log(drawing);
        await api.post('/api/drawings/', drawing)
            .then(res => {
                console.log(res);
                imgId = res.data;
            }).catch(err => {
                console.log(err);
            });
        console.log(imgId);

        if (imgId != -1) {
            const data = {
                drawingId: imgId
            };

            await api.post(`/api/game/images/` + this.images[0] + `/compare/`, data)
                .then(res => {
                    console.log(res);
                    this.updatePlayerScore(res);
                }).catch(err => {
                    console.log(err);
                });
        }

        if (this.state.round == 1)
            this.gameEnd();
    }

    updatePlayerScore(score) {

    }

    gameEnd() {
        history.push({ pathname: "/postgame/" + this.gameId, state: { players: this.players }});
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
                            <img ref={image => this.image = image} width={475} alt={''}></img>
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
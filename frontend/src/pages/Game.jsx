import React, { Component } from 'react';
import CanvasDraw from "react-canvas-draw";
import ReactCountdownClock from 'react-countdown-clock';

class Game extends Component {
    constructor(props) {
        super(props);
    
    }  
    render() {
        return (
            
            <div id="background">
                <div id="logo"></div>
                <div id="canvasBackground">
                    <div id="infoPanel">
                        <h1>Round 1</h1>
                        <ReactCountdownClock seconds={60}
                        color={"blue"}
                        alpha={0.9}
                        size={150}
                        />
                    </div>
                    <div id="canvas"><CanvasDraw  canvasWidth={600} canvasHeight={600} brushRadius={5} hideGrid={true} brushColor={"black"}></CanvasDraw></div>
                </div>
            </div>
        );
    } 
}

export default Game;
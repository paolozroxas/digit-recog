import React, { Component } from 'react';
import './App.css';
import _ from "lodash";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prediction: null
    };

  }

  onMouseDown = (e) => {
    const x = e.pageX - this.canvas.offsetLeft;
    const y = e.pageY - this.canvas.offsetTop;
    this.isPainting = true;

    this.draw(x, y, true);
  }

  onMouseMove = (e) => {
    if (this.isPainting) {
      const x = e.pageX - this.canvas.offsetLeft;
      const y = e.pageY - this.canvas.offsetTop;
      this.draw(x, y, false);
    }
  }

  onMouseUp = () => {
    this.isPainting = false;
  }

  onMouseLeave = () => {
    this.isPainting = false;
  }

  draw = (x, y, isPathStart) => {
    const context = this.canvas.getContext("2d");
    context.strokeStyle = "#000000";
    context.lineJoin = "round";
    context.lineWidth = 6;
    
    context.beginPath();
    if (isPathStart) {
      context.moveTo(x, y + 1);
    } else {
      context.moveTo(this.prevX, this.prevY);
    }

    console.log('curr', x, y)
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    
    this.prevX = x;
    this.prevY = y;

  }

  getPrediction = () => {
    const context = this.canvas.getContext("2d");
    const pixelData = context.getPixelData();
    console.log("pixel data", pixelData.length);
  }

  render() {
    const { prediction } = this.state;
    return (
      <div className="App">
        <div className="App-content">
          <h3>Digit Recognition Lab</h3>
          <canvas
            className="canvas-class"
            width={56}
            height={56}
            ref={(ref) => this.canvas = ref}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
            onMouseLeave={this.onMouseLeave}
          />
        </div>
        <h3>{prediction}
      </div>
    );
  }
}

export default App;

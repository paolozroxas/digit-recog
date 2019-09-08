import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import axios from 'axios';

const CANVAS_SCALE_FACTOR = 4;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      digit: undefined
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
    x /= CANVAS_SCALE_FACTOR;
    y /= CANVAS_SCALE_FACTOR;

    const context = this.canvas.getContext("2d");
    context.strokeStyle = "#000000";
    context.lineJoin = "round";
    context.lineWidth = 1;
    
    context.beginPath();
    if (isPathStart) {
      context.moveTo(x, y + 1);
    } else {
      context.moveTo(this.prevX, this.prevY);
    }

    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    
    this.prevX = x;
    this.prevY = y;
  }

  getPixelData = () => {
    const context = this.canvas.getContext("2d");
    const rawPixelData = context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    const pixelData = [];

    // convert rgb to a single greyscale value (grab the alpha values)
    for (let i = 3; i < rawPixelData.length; i += 4) {
      pixelData.push(rawPixelData[i])
    }
    
    return pixelData;
  }

  onClassifyClick = async() => {
    const pixelData = this.getPixelData();
    console.log(pixelData.length)

    const res = await axios.post(
      '/classify',
      { pixelData: pixelData }
    );
    console.log(res)
    this.setState({ digit: res.data.digit });
  }

  render() {
    const { digit } = this.state;
    return (
      <div className="App">
        <div className="App-content">
          <h3>Digit Recognition Lab</h3>
          <canvas
            className="canvas-class"
            width={28}
            height={28}
            ref={(ref) => this.canvas = ref}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
            onMouseLeave={this.onMouseLeave}
          />
          <div className="classify-btn" onClick={this.onClassifyClick}>Classify</div>
          <h3>{digit !== undefined ? `It's a ${digit}!` : null}</h3>
        </div>
      </div>
    );
  }
}

export default App;

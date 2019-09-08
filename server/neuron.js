const _ = require('lodash');

const WEIGHT_INIT_MIN = -1;
const WEIGHT_INIT_MAX = 1;

class Neuron {
  constructor(input) {
    if (typeof input === 'number') {
      const prevLayerSize = input;
      this.weights = _.times(prevLayerSize, (n) => (
        _.random(WEIGHT_INIT_MIN, WEIGHT_INIT_MAX, true) / Math.pow(prevLayerSize, 0.5)
      ));
      this.bias = 0;
    } else if (typeof input === 'object') {
      _.merge(this, input);
    }
    
  }

  getActivation(prevLayer, saveActivation = false) {
    let sum = 0;
    prevLayer.forEach((val, idx) => {
      sum += val * this.weights[idx];
    });
    const z = sum + this.bias
    const activation = this.sigmoid(z);
    if (saveActivation) {
      this.z = z;
      this.activation = activation;
    }
    return activation;
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  getDCDA(y) {
    return 2 * (this.activation - y);
  }

  getDADZ() {
    return this.sigmoid(this.z) * (1 - this.sigmoid(this.z));
  }

  setDCDWs(dzdws, chainEl, batchSize = 1) {
    if (this.DCDWs) {
      for (let i = 0; i < this.DCDWs.length; i++) {
        this.DCDWs[i] += (dzdws[i] * chainEl) / batchSize;
      }
    } else {
      this.DCDWs = dzdws.map((dzdw) => (dzdw * chainEl) / batchSize);
    }
  }

  setDCDB(chainEl, batchSize = 1) {
    if (this.DCDB) {
      this.DCDB += chainEl / batchSize;
    } else {
      this.DCDB = chainEl / batchSize;
    }
  }
}

module.exports = Neuron;
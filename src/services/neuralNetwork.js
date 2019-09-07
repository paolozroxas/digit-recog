const _ = require('lodash');
const Neuron = require('./neuron');

class NeuralNetwork {
  constructor(...args) {
    if (args.length === 2) {
      const [ inputSize, layerSizes ] = args;
      this.inputSize = inputSize;
      this.layers = layerSizes.map((size, idx) => {
        return _.times(size, () => new Neuron(layerSizes[idx - 1] || inputSize));
      });
    } else if (args.length === 1 && typeof args[0] === 'object') {
      const [ inputObj ] = args;
      _.merge(this, inputObj);
      this.layers = this.layers.map((layer) => {
        return layer.map((neuronObj) => {
          return new Neuron(neuronObj);
        })
      });
    }
  }

  sGradDescent(data, batchSize, learnRate) {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      this.calcGradient(batch);
      this.descendGradient(learnRate);

      if (i % (batchSize*50) === 0) {
        const results = []
        for (let j = 0; j < 100; j++) {
          const idx = _.random(0, data.length - 1);
          const result = this.predict(data[idx][1])
          const reference = data[idx][0];
          results.push(
            reference.indexOf(1) ===
            result.indexOf(Math.max(...result))
          )
        }
        console.log('result:', results.reduce((acc, val) => (acc + val)))
      }
    }
  }

  calcGradient(batch) {
    const batchSize = batch.length;

    // ensure gradient elements are blank
    this.clearGradient();

    for (let i = 0; i < batchSize; i++) {
      this.train(batch[i], batchSize);
    }
  }

  descendGradient(factor = 1) {
    this.layers.forEach((layer) => {
      layer.forEach((neuron) => {
        // minus because we're minimizing cost
        for (let i = 0; i < neuron.weights.length; i++) {
          neuron.weights[i] -= neuron.DCDWs[i] * factor;
        }
        neuron.bias -= neuron.DCDB * factor;
      })
    })
  }

  predict(image, saveActivations = false) {
    let result = image;
    this.layers.forEach((layer) => {
      const newResult = [];
      layer.forEach((neuron) => {
        newResult.push(neuron.getActivation(result, saveActivations));
      });

      result = newResult;
    });

    return result;
  }

  train([trueLabels, image], batchSize = 1) {
    // saveActivations
    this.predict(image, true);

    let chain;
    
    // iterate throught the layers, calculating the partial derivatives
    // wrt weights and biases
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const newChain = [];
      this.layers[i].forEach((neuron, neuronIdx) => {
        let chainEl;
        if (i === this.layers.length - 1) {
          chainEl = neuron.getDCDA(trueLabels[neuronIdx]);
        } else {
          // account for the DZDA term
          const nextLayer = this.layers[i + 1];
          let sum = 0;
          for(let l = 0; l < nextLayer.length; l++) {
            sum += nextLayer[l].weights[neuronIdx] * chain[l];
          }
          chainEl = sum;
        }
        
        // factor in the DADZ term to chainEl
        chainEl *= neuron.getDADZ();

        const prevLayer = this.layers[i - 1];
        const dzdws = prevLayer ?
          prevLayer.map((neuron) => neuron.activation) :
          image;

        // set the partial derivative of cost wrt the weights
        neuron.setDCDWs(dzdws, chainEl, batchSize);
  
        // set the partial derivative of cost wrt the bias
        neuron.setDCDB(chainEl, batchSize);

        newChain.push(chainEl);
      });

      chain = newChain;
    }
  }

  getCost(trueLabels) {
    const finalLayer = this.layers[this.layers.length - 1];
    let sum = 0;
    finalLayer.forEach((neuron, idx) => {
      sum += Math.pow(neuron.activation - trueLabels[idx], 2);
    });
    return sum;
  }

  getBatchCost(batch) {
    let totalCost = 0;
    batch.forEach((datum) => {
      this.predict(datum[1], true);
      totalCost += this.getCost(datum[0]);
    });
    return totalCost / batch.length;
  }

  clearGradient() {
    this.layers.forEach((layer) => {
      layer.forEach((neuron) => {
        neuron.DCDWs = null;
        neuron.DCDB = null;
      })
    });
  }
}

module.exports = NeuralNetwork;
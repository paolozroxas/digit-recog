const _ = require('lodash');
const fs = require('fs');
const NeuralNetwork = require('./neuralNetwork');
const getData = require('./getData');

const data = getData();
const network = new NeuralNetwork(784, [512, 10]);


network.sGradDescent(_.shuffle(data.train), 64, 0.05);

fs.writeFileSync('./server/classifiers/digitClassifier.json', JSON.stringify(network))
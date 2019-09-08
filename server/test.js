const fs = require('fs');
const getData = require('./getData');
const NeuralNetwork = require('./neuralNetwork');

const data = getData().test;

const networkObj = JSON.parse(fs.readFileSync('./server/classifiers/digitClassifier.json').toString());
const net = new NeuralNetwork(networkObj);

console.log(data[0][1])

// const results = [];
// for (let i = 0; i < data.length; i++) {
//   const prediction = net.predict(data[i][1]);
//   const predictionDigit = prediction.indexOf(Math.max(...prediction));
//   const actualDigit = data[i][0].indexOf(1);
  
//   results.push(predictionDigit === actualDigit);

// }
// console.log("RESULT", 100 * results.reduce((acc, val) => (acc + val)) / results.length)

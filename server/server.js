const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 8080;
const jsonParser = bodyParser.json();
app.use(morgan('tiny'));

// Initialize neural network
const NeuralNetwork = require('./neuralNetwork');
const digitClassifier = JSON.parse(
  fs.readFileSync('./server/classifiers/digitClassifier.json').toString()
);
const mlp = new NeuralNetwork(digitClassifier);


// Routing
app.use(express.static('build'));

app.post('/classify', jsonParser, (req, res) => {
  const pixelData = req.body.pixelData;
  const result = mlp.predict(pixelData);
  const digit = result.indexOf(Math.max(...result));
  res.json({ digit });
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
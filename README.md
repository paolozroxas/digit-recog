# Overview
A neural network classification model that can recognize handwritten numeric digits.
You can draw handwritten digits (0-9) on a page and then submit the drawing. The server will respond with the model's prediction of which digit

# Design
This project consists of a React frontend and an Express backend.

# Setup
## Download datasets
- Download all four datasets from Yann LeCun's MNIST webpage http://yann.lecun.com/exdb/mnist/
- Decompress and copy the datasets to the ./server/data directory in this repository
- There should be four files named thusly:
  - server/data/t10k-images-idx3-ubyte
  - server/data/t10k-labels-idx1-ubyte
  - server/data/train-images-idx3-ubyte
  - server/data/train-labels-idx1-ubyte

## Train model
- Ensure that the `./classifiers` directory exists
- From the repository root, run the script `npm run train`
- This may take several minutes to run
- The script will write a `./classifiers/digitClassifier.json` file. This file represents the state of a neural network model that has been trained to classify handwritten digits

## Run backend server
run `npm run server`

## Run frontend dev server
- Run `npm start` from the repository root
- Open [http://localhost:3000](http://localhost:3000) to view the page in the browser


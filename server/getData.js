const fs = require('fs');
const _ = require('lodash');

const TRAIN_IMAGES = 'train-images-idx3-ubyte';
const TRAIN_LABELS = 'train-labels-idx1-ubyte';
const TEST_IMAGES = 't10k-images-idx3-ubyte';
const TEST_LABELS = 't10k-labels-idx1-ubyte';

const PREFIX = './server/data/';
const IMAGES_FILE_OFFSET = 16;
const LABELS_FILE_OFFSET = 8;
const IMAGE_PIXEL_COUNT = 784; // 28 * 28

const getData = () => {
  
  const trainImagesBuff = fs.readFileSync(PREFIX + TRAIN_IMAGES).slice(IMAGES_FILE_OFFSET);
  const trainLabelsBuff = _.map(
    fs.readFileSync(PREFIX + TRAIN_LABELS).slice(LABELS_FILE_OFFSET),
    (datum) => (_.times(10, (n) => n === datum ? 1 : 0)),
  );
  
  const testImagesBuff = fs.readFileSync(PREFIX + TEST_IMAGES).slice(IMAGES_FILE_OFFSET);
  const testLabelsBuff = _.map(
    fs.readFileSync(PREFIX + TEST_LABELS).slice(LABELS_FILE_OFFSET),
    (datum) => (_.times(10, (n) => n === datum ? 1 : 0)),
  );

  return {
    train: _.zip(trainLabelsBuff, separateImages(trainImagesBuff)),
    test: _.zip(testLabelsBuff, separateImages(testImagesBuff))
  };
}

const separateImages = (imagesBuff) => {
  const images = [];
  for (let i = 0; i < imagesBuff.length; i++) {
    if (i % IMAGE_PIXEL_COUNT === 0) {
      images.push([]);
    }
    images[images.length - 1].push(imagesBuff[i]);
  }
  return images;
}

module.exports = getData;
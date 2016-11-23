import chai = require('chai');
const expect = chai.expect;

import {
  regexForAllCharacters,
  regexFromLength,
  prepareSimpleTypes,
  prepareArraysAndObjects,
  bodyTransform
} from './body-transform';

describe("Body transformer", function () {

  expect(prepareSimpleTypes({
    asd: 11,
    arr: [
      { da: '123123' }
    ]
  })).to.eq({
    asd: 11,
    arr: [
      { da: '123123' }
    ]
  })
});

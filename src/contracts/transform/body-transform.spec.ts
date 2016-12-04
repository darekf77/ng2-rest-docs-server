import chai = require('chai');
const expect = chai.expect;

import {
  prepareSimpleTypes,
  prepareArraysAndObjects,
  bodyTransform,
  checkIfContainsArrayOrObjecct,
  bodySimpelObjet
} from './body-transform';

import { clean, regexFromLength, regexForAllCharacters } from './transform-helper';

describe("Groovy syntax transformer body", function () {

  let obj, objeManyItems;

  beforeEach(() => {
    obj = {
      asd: 11,
      arr: [
        { da: '123123' }
      ]
    };

  })

  it('it shoudl join object fields into string', () => {
    expect(clean(bodySimpelObjet({
      'aaa': 'asasdasd',
      'ddd': 'adasd',
      'ccc': 'a'
    }))).to.eq(clean(`
      asasdasd,
      adasd,
      a
    `))

  })

  it('shoud check object propertly', () => {
    expect(checkIfContainsArrayOrObjecct(obj)).to.eq(true);
    expect(checkIfContainsArrayOrObjecct([])).to.eq(false);
    expect(checkIfContainsArrayOrObjecct({})).to.eq(false);
    expect(checkIfContainsArrayOrObjecct(undefined)).to.eq(false);
    expect(checkIfContainsArrayOrObjecct({
      asdas: "asdasd",
    })).to.eq(false);

  })

  it('should prepare types simple tyes ', () => {
    prepareSimpleTypes(obj)
    expect(clean(obj.asd)).to.eq(clean(`asd: $(
                consumer('11'),
                producer(regex('${regexForAllCharacters()}'))
            )`));
  })

  it('should prepare types simple tyes ', () => {
    let dd: any = JSON.stringify(obj);
    dd = prepareSimpleTypes(dd);
    expect(clean(dd['asd'])).to.eq(clean(`asd: $(
                consumer('11'),
                producer(regex('${regexForAllCharacters()}'))
            )`));
  })

  it('should prepare complex types', () => {
    prepareSimpleTypes(obj)
    prepareArraysAndObjects(obj);
    expect(clean(obj.arr)).to.eq(clean(`arr: [[ 
            da: $(
                consumer('123123'),
                producer(regex('${regexForAllCharacters()}'))
            )
            ]]`));



    expect(clean(bodySimpelObjet(obj))).to.eq(clean(`
      asd: $(consumer('11'),producer(regex('.+')) ),
      arr: [[ 
        da: $(
            consumer('123123'),
            producer(regex('${regexForAllCharacters()}'))
        )
        ]]
      `))

  })


  it('shoudl prepare groovy object', () => {

    expect(clean(bodyTransform(
      JSON.stringify({
        someth: 'aaa',
        super: 'hihi'
      }), [
        { path: 'someth', length: 12, }
      ]))).to.eq(clean(`
      body(
        someth: $(
                consumer('aaa'),
                producer(regex('${regexFromLength(12)}'))
            ),
        super: $(
            consumer('hihi'),
            producer(regex('${regexForAllCharacters()}'))
        )
        )
    `))
  })




});


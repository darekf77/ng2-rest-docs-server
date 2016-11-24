import chai = require('chai');
const expect = chai.expect;

import {
    transformQueryPrams
} from './query-params-transform';

import { clean, change } from './transform-helper';

describe("Groovy syntax transformer queryParams", function () {

    it('shoud transform query parasms ', () => {
        expect(clean(transformQueryPrams({
            'limit': 100,
            where: 'somewhere',
            dd: false
        }))).to.eq(clean(`
                queryParameters {
                    parameter 'limit' : value(consumer(matching(".+")), producer('100'))
                    parameter 'where' : value(consumer(matching(".+")), producer('somewhere'))
                    parameter 'dd' : value(consumer(matching(".+")), producer('false'))
                }        
            `))
    })



});


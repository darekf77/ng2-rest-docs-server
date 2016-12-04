import chai = require('chai');
const expect = chai.expect;

import {
    transformQueryPrams
} from './query-params-transform';

import { clean, change } from './transform-helper';
import { UrlParams } from '../models';

describe("Groovy syntax transformer queryParams", function () {

    it('shoud transform query parasms ', () => {
        expect(clean(transformQueryPrams({
            'limit': 100,
            where: 'somewhere',
            dd: false
        }))).to.eq(clean(`
                queryParameters {
                    parameter 'limit' : value(consumer(matching('.+')), producer('100'))
                    parameter 'where' : value(consumer(matching('.+')), producer('somewhere'))
                    parameter 'dd' : value(consumer(matching('.+')), producer('false'))
                }        
            `))
    })


    it('shoud transform new query parasms for contracts ', () => {
        expect(clean(transformQueryPrams(<UrlParams[]>[
            { 'limit': 100 },
            { 'where': 'somewhere' },
            { 'dd': false, regex: new RegExp('d{2}') },
        ]))).to.eq(clean(`
                queryParameters {
                    parameter 'limit' : value(consumer(matching('.+')), producer('100'))
                    parameter 'where' : value(consumer(matching('.+')), producer('somewhere'))
                    parameter 'dd' : value(consumer(matching('d{2}')), producer('false'))
                }        
            `))
    })

    it('shoud transform nested objects', () => {
        expect(clean(transformQueryPrams(<UrlParams[]>[
            { 'limit': 100 },
            {
                'ins': {
                    name: 'dd'
                }
            }
        ]))).to.eq(clean(`
                queryParameters {
                    parameter 'limit' : value(consumer(matching('.+')), producer('100'))
                    parameter 'ins' : value(consumer(matching('.+')), producer('{"name":"dd"}'))
                }        
            `))
    })


});


import chai = require('chai');
const expect = chai.expect;

import {
    transformHeaders
} from './headers-transform';

import { clean } from './transform-helper';

describe("Groovy syntax transformer headers", function () {

    it('should transform headers nicely', () => {

        expect(clean(transformHeaders({
            'Content-Type': 'application/json'
        }))).to.eq(clean(`
            headers {
                header 'Content-Type': 'application/json'
            }        
        `))

        expect(clean(transformHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }))).to.eq(clean(`
            headers {
                header 'Content-Type': 'application/json',
                header 'Accept': 'application/json'
            }        
        `))

        expect(clean(transformHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'asdasd' : 'aaaa'
        }))).to.eq(clean(`
            headers {
                header 'Content-Type': 'application/json',
                header 'Accept': 'application/json',
                header 'asdasd' : 'aaaa'
            }        
        `))

    })


});


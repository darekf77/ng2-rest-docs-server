"use strict";
var chai = require('chai');
var expect = chai.expect;
var body_transform_1 = require('./body-transform');
describe("Body transformer", function () {
    expect(body_transform_1.prepareSimpleTypes({
        asd: 11,
        arr: [
            { da: '123123' }
        ]
    })).to.eq({
        asd: 11,
        arr: [
            { da: '123123' }
        ]
    });
});
//# sourceMappingURL=body-transform.spec.js.map
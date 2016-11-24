"use strict";
var chai = require('chai');
var expect = chai.expect;
var headers_transform_1 = require('./headers-transform');
var transform_helper_1 = require('./transform-helper');
describe("Groovy syntax transformer headers", function () {
    it('should transform headers nicely', function () {
        expect(transform_helper_1.clean(headers_transform_1.transformHeaders({
            'Content-Type': 'application/json'
        }))).to.eq(transform_helper_1.clean("\n            headers {\n                header 'Content-Type': 'application/json'\n            }        \n        "));
        expect(transform_helper_1.clean(headers_transform_1.transformHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }))).to.eq(transform_helper_1.clean("\n            headers {\n                header 'Content-Type': 'application/json',\n                header 'Accept': 'application/json'\n            }        \n        "));
        expect(transform_helper_1.clean(headers_transform_1.transformHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'asdasd': 'aaaa'
        }))).to.eq(transform_helper_1.clean("\n            headers {\n                header 'Content-Type': 'application/json',\n                header 'Accept': 'application/json',\n                header 'asdasd' : 'aaaa'\n            }        \n        "));
    });
});
//# sourceMappingURL=headers-transform.spec.js.map
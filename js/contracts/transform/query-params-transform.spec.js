"use strict";
var chai = require('chai');
var expect = chai.expect;
var query_params_transform_1 = require('./query-params-transform');
var transform_helper_1 = require('./transform-helper');
describe("Groovy syntax transformer queryParams", function () {
    it('shoud transform query parasms ', function () {
        expect(transform_helper_1.clean(query_params_transform_1.transformQueryPrams({
            'limit': 100,
            where: 'somewhere',
            dd: false
        }))).to.eq(transform_helper_1.clean("\n                queryParameters {\n                    parameter 'limit' : value(consumer(matching(\".+\")), producer('100'))\n                    parameter 'where' : value(consumer(matching(\".+\")), producer('somewhere'))\n                    parameter 'dd' : value(consumer(matching(\".+\")), producer('false'))\n                }        \n            "));
    });
});
//# sourceMappingURL=query-params-transform.spec.js.map
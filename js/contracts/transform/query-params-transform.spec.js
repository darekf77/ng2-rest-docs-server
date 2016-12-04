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
        }))).to.eq(transform_helper_1.clean("\n                queryParameters {\n                    parameter 'limit' : value(consumer(matching('.+')), producer('100'))\n                    parameter 'where' : value(consumer(matching('.+')), producer('somewhere'))\n                    parameter 'dd' : value(consumer(matching('.+')), producer('false'))\n                }        \n            "));
    });
    it('shoud transform new query parasms for contracts ', function () {
        expect(transform_helper_1.clean(query_params_transform_1.transformQueryPrams([
            { 'limit': 100 },
            { 'where': 'somewhere' },
            { 'dd': false, regex: new RegExp('d{2}') },
        ]))).to.eq(transform_helper_1.clean("\n                queryParameters {\n                    parameter 'limit' : value(consumer(matching('.+')), producer('100'))\n                    parameter 'where' : value(consumer(matching('.+')), producer('somewhere'))\n                    parameter 'dd' : value(consumer(matching('d{2}')), producer('false'))\n                }        \n            "));
    });
    it('shoud transform nested objects', function () {
        expect(transform_helper_1.clean(query_params_transform_1.transformQueryPrams([
            { 'limit': 100 },
            {
                'ins': {
                    name: 'dd'
                }
            }
        ]))).to.eq(transform_helper_1.clean("\n                queryParameters {\n                    parameter 'limit' : value(consumer(matching('.+')), producer('100'))\n                    parameter 'ins' : value(consumer(matching('.+')), producer('{\"name\":\"dd\"}'))\n                }        \n            "));
    });
});
//# sourceMappingURL=query-params-transform.spec.js.map
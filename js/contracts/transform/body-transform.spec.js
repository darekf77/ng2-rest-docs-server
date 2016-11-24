"use strict";
var chai = require('chai');
var expect = chai.expect;
var body_transform_1 = require('./body-transform');
var transform_helper_1 = require('./transform-helper');
describe("Groovy syntax transformer body", function () {
    var obj, objeManyItems;
    beforeEach(function () {
        obj = {
            asd: 11,
            arr: [
                { da: '123123' }
            ]
        };
    });
    it('it shoudl join object fields into string', function () {
        expect(transform_helper_1.clean(body_transform_1.bodySimpelObjet({
            'aaa': 'asasdasd',
            'ddd': 'adasd',
            'ccc': 'a'
        }))).to.eq(transform_helper_1.clean("\n      asasdasd,\n      adasd,\n      a\n    "));
    });
    it('shoud check object propertly', function () {
        expect(body_transform_1.checkIfContainsArrayOrObjecct(obj)).to.eq(true);
        expect(body_transform_1.checkIfContainsArrayOrObjecct([])).to.eq(false);
        expect(body_transform_1.checkIfContainsArrayOrObjecct({})).to.eq(false);
        expect(body_transform_1.checkIfContainsArrayOrObjecct(undefined)).to.eq(false);
        expect(body_transform_1.checkIfContainsArrayOrObjecct({
            asdas: "asdasd",
        })).to.eq(false);
    });
    it('should prepare types simple tyes ', function () {
        body_transform_1.prepareSimpleTypes(obj);
        expect(transform_helper_1.clean(obj.asd)).to.eq(transform_helper_1.clean("asd: $(\n                consumer('11'),\n                producer(regex('" + transform_helper_1.regexForAllCharacters() + "'))\n            )"));
    });
    it('should prepare complex types', function () {
        body_transform_1.prepareSimpleTypes(obj);
        body_transform_1.prepareArraysAndObjects(obj);
        expect(transform_helper_1.clean(obj.arr)).to.eq(transform_helper_1.clean("arr: [[ \n            da: $(\n                consumer('123123'),\n                producer(regex('" + transform_helper_1.regexForAllCharacters() + "'))\n            )\n            ]]"));
        expect(transform_helper_1.clean(body_transform_1.bodySimpelObjet(obj))).to.eq(transform_helper_1.clean("\n      asd: $(consumer('11'),producer(regex('.+')) ),\n      arr: [[ \n        da: $(\n            consumer('123123'),\n            producer(regex('" + transform_helper_1.regexForAllCharacters() + "'))\n        )\n        ]]\n      "));
    });
    it('shoudl prepare groovy object', function () {
        expect(transform_helper_1.clean(body_transform_1.bodyTransform({
            someth: 'aaa',
            super: 'hihi'
        }, [
            { path: 'someth', length: 12, }
        ]))).to.eq(transform_helper_1.clean("\n        someth: $(\n                consumer('aaa'),\n                producer(regex('" + transform_helper_1.regexFromLength(12) + "'))\n            ),\n        super: $(\n            consumer('hihi'),\n            producer(regex('" + transform_helper_1.regexForAllCharacters() + "'))\n        )\n    \n    "));
    });
});
//# sourceMappingURL=body-transform.spec.js.map
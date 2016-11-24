"use strict";
var chai = require('chai');
var expect = chai.expect;
var path_object_1 = require('./path-object');
describe("Path Objecct", function () {
    it('shoud set property value by path (objects only) ', function () {
        var obj = {
            dd: {
                aa: {
                    c: 12
                }
            }
        };
        path_object_1.PathObject.set('dd.aa', 50, obj);
        expect(obj.dd.aa).to.eq(50);
    });
    it('shoud set property value by path (array case) ', function () {
        var obj = {
            dd: {
                aa: [
                    { c: 22 }
                ]
            }
        };
        path_object_1.PathObject.set('dd.aa[0].c', 12, obj);
        expect(obj.dd.aa[0]['c']).to.eq(12);
    });
    it('shoud get property value by path ', function () {
        var obj = {
            dd: {
                aa: {
                    c: 12
                }
            }
        };
        expect(path_object_1.PathObject.get('dd.aa.c', obj)).to.eq(12);
    });
    it('shoud get last field in path ', function () {
        expect(path_object_1.PathObject.parent('dd.aa.c')).to.eq('dd.aa');
    });
});
//# sourceMappingURL=path-object.spec.js.map
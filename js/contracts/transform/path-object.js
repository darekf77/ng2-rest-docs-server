"use strict";
var _ = require('lodash');
var PathObject = (function () {
    function PathObject() {
    }
    PathObject.get = function (path, obj) {
        return _.get(obj, path);
    };
    PathObject.set = function (path, value, data) {
        return _.set(data, path, value);
    };
    PathObject.parent = function (path) {
        var d = path.split('.');
        if (d.length === 1 && d[0] === path)
            return undefined;
        d.pop();
        var res = d.join('.');
        return res;
    };
    /**
     * field name
     *
     * @static
     * @param {string} path
     *
     * @memberOf PathObject
     */
    PathObject.fieldName = function (path) {
        var res = path.split('.');
        return res[res.length - 1];
    };
    return PathObject;
}());
exports.PathObject = PathObject;
//# sourceMappingURL=path-object.js.map
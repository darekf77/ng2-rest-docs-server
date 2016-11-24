"use strict";
var path_object_1 = require('./path-object');
var transform_helper_1 = require('./transform-helper');
var consts_1 = require('./consts');
/**
 * Transform object to groovy syntax
 *
 * @export
 * @param {Object} data
 * @param {FormInputBind[]} bindings
 * @returns {string}
 */
function bodyTransform(data, bindings) {
    console.log('data', data);
    try {
        data = JSON.parse(data);
    }
    catch (error) {
        console.error('string withou object in bodyTransform');
        return '';
    }
    if (bindings && bindings.length > 0) {
        bindings.forEach(function (binding) {
            binding.temp = path_object_1.PathObject.get(binding.path, data);
        });
    }
    prepareSimpleTypes(data);
    if (bindings && bindings.length > 0) {
        bindings.forEach(function (binding) {
            var path = binding.path;
            var consumer = binding.temp;
            var consumerString = consumer ? consts_1.CONSUMER + "('" + consumer + "')," : '';
            var value = "\n" + path_object_1.PathObject.fieldName(path) + ":  \n                    $(\n                        " + consumerString + " " + consts_1.PRODUCER + "(regex('" + transform_helper_1.regexFromLength(binding.length) + "')) \n                    )\n";
            path_object_1.PathObject.set(path, value, data);
        });
    }
    prepareArraysAndObjects(data);
    var s = [];
    for (var p in data) {
        s.push(data[p]);
    }
    return s.join();
}
exports.bodyTransform = bodyTransform;
/**
 * Check if object contains object or array
 *
 * @export
 * @param {Object} data
 * @returns {boolean}
 */
function checkIfContainsArrayOrObjecct(data) {
    for (var p in data) {
        if (data[p] instanceof Object)
            return true;
    }
    return false;
}
exports.checkIfContainsArrayOrObjecct = checkIfContainsArrayOrObjecct;
/**
 * We assume that all simple field are alread with groovy syntax
 *
 * @param {Object} data
 * @returns
 */
function bodySimpelObjet(data) {
    var s = [];
    for (var p in data) {
        var v = data[p];
        s.push(v);
    }
    if (s.length === 0)
        return "[]";
    if (s.length === 1)
        return s[0];
    if (s.length === 2)
        return s[0] + ",\n" + s[1];
    var res = s.join(',');
    return res;
}
exports.bodySimpelObjet = bodySimpelObjet;
/**
 * Change array/object in object to groovy syntax
 *
 * @export
 * @param {Object} data
 */
function prepareArraysAndObjects(data) {
    for (var p in data) {
        var v = data[p];
        if (v instanceof Array) {
            var arr = v;
            if (arr.length > 0) {
                var first = arr[0];
                if (checkIfContainsArrayOrObjecct(first)) {
                    prepareArraysAndObjects(first);
                }
                else
                    data[p] = p + ": [[\n\n                    " + bodySimpelObjet(first) + "\n\n                ]]\n";
            }
            else {
                data[p] = p + ": [[]]";
            }
        }
        else if (v instanceof Object) {
            if (checkIfContainsArrayOrObjecct(v))
                prepareArraysAndObjects(v);
            else
                data[p] = p + ": []";
        }
    }
}
exports.prepareArraysAndObjects = prepareArraysAndObjects;
/**
 * Change simple types values in object for groovy syntax
 *
 * @export
 * @param {Object} data
 */
function prepareSimpleTypes(data) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch (error) {
            console.log('canno prepareSimpleTypes ');
            return;
        }
    }
    for (var p in data) {
        var v = data[p];
        if (v instanceof Array) {
            var arr = v;
            if (arr.length > 0) {
                data[p] = arr.slice(0, 1);
                prepareSimpleTypes(data[p][0]);
            }
        }
        else if (v instanceof Object) {
            prepareSimpleTypes(v);
        }
        else {
            data[p] = "\n" + p + ": $(\n                " + consts_1.CONSUMER + "('" + data[p] + "'),\n                " + consts_1.PRODUCER + "(regex('" + transform_helper_1.regexForAllCharacters() + "'))\n            ) ";
        }
    }
    return data;
}
exports.prepareSimpleTypes = prepareSimpleTypes;
//# sourceMappingURL=body-transform.js.map
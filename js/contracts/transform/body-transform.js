"use strict";
var path_object_helper_1 = require('./path-object-helper');
/**
 * Transform object to groovy syntax
 *
 * @export
 * @param {Object} data
 * @param {FormInputBind[]} bindings
 * @returns {string}
 */
function bodyTransform(data, bindings) {
    prepareSimpleTypes(data);
    if (bindings && bindings.length > 0) {
        bindings.forEach(function (binding) {
            var path = binding.name;
            var value = path_object_helper_1.HelperData.get(path, data) + "  $(consumer(regex(" + regexFromLength(binding.length) + "))),\n";
            path_object_helper_1.HelperData.set(path, value, data);
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
function regexFromLength(length) {
    return ".{" + length + "}";
}
exports.regexFromLength = regexFromLength;
function regexForAllCharacters() {
    return ".+";
}
exports.regexForAllCharacters = regexForAllCharacters;
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
function bodySimpelObjet(data) {
    var s = [];
    for (var p in data) {
        var v = data[p];
        s.push(v);
    }
    return s.join();
}
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
                if (checkIfContainsArrayOrObjecct(first))
                    prepareArraysAndObjects(first);
                else
                    data[p] = "[[\n                    " + bodySimpelObjet(v) + "\n                ]]";
            }
            else {
                data[p] = "[[ ]]";
            }
        }
        else if (v instanceof Object) {
            if (checkIfContainsArrayOrObjecct(v))
                prepareArraysAndObjects(v);
            else
                data[p] = "[ ]";
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
            data[p] = "$(\n                consumer('" + data[p] + "),\n                producer(regex('" + regexForAllCharacters() + "'))\n            )";
        }
    }
}
exports.prepareSimpleTypes = prepareSimpleTypes;
//# sourceMappingURL=body-transform.js.map
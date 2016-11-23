"use strict";
/**
 * Example header object:
 * {
 *  contentType: 'application/json'
 * }
 * will be transofrmed for groovy syntax
 *
 * @param {Object} headers
 * @returns {string}
 */
function bodyHeaderGenerator(headers) {
    var res;
    var rows = [];
    for (var p in headers) {
        var value = headers[p];
        rows.push("header '" + p + "' : '" + value + "'\n");
    }
    return "{\n" + rows.join() + "}";
}
exports.bodyHeaderGenerator = bodyHeaderGenerator;
//# sourceMappingURL=body-header-generator.js.map
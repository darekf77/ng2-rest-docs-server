"use strict";
var transform_helper_1 = require('./transform-helper');
var consts_1 = require('./consts');
function transformQueryPrams(queryParams) {
    if (!queryParams)
        return '';
    var rows = [];
    for (var p in queryParams) {
        var value = queryParams[p];
        rows.push("parameter '" + p + "' : value(" + consts_1.CONSUMER + "(matching(\"" + transform_helper_1.regexForAllCharacters() + "\")),producer('" + value + "')\n)");
    }
    if (rows.length === 0)
        return "";
    if (rows.length === 1)
        return "parameter {\n" + rows[0] + "}";
    if (rows.length === 2)
        return "parameter {\n" + rows[0] + "\n" + rows[1] + "}";
    var res = rows.join('');
    return "queryParameters {\n" + res + "\n}";
}
exports.transformQueryPrams = transformQueryPrams;
//# sourceMappingURL=query-params-transform.js.map
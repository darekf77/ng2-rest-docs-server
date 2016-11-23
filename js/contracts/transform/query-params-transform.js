"use strict";
var consts_1 = require('./consts');
function transformQueryPrams(queryParams) {
    if (!queryParams)
        return '';
    var res;
    var rows = [];
    for (var p in queryParams) {
        // let value = queryParams[p];
        rows.push("parameter '" + p + "' : value(consumer(regex('.{" + consts_1.WITHOUT_FORM_LENGTH_INDICATOR + "}')))\n");
    }
    return "queryParameters {\n" + rows.join() + "}";
}
exports.transformQueryPrams = transformQueryPrams;
//# sourceMappingURL=query-params-transform.js.map
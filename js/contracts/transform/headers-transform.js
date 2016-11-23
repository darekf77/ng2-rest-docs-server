"use strict";
function transformHeaders(headers) {
    if (!headers)
        return '';
    var res;
    var rows = [];
    for (var p in headers) {
        var value = headers[p];
        rows.push("header '" + p + "' : '" + value + "'\n");
    }
    return "headers {\n" + rows.join() + "}";
}
exports.transformHeaders = transformHeaders;
//# sourceMappingURL=headers-transform.js.map
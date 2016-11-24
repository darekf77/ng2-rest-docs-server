"use strict";
function transformHeaders(headers) {
    if (!headers)
        return '';
    var rows = [];
    for (var p in headers) {
        var value = headers[p];
        rows.push("header '" + p + "' : '" + value + "'\n");
    }
    if (rows.length === 0)
        return "";
    if (rows.length === 1)
        return "headers {\n" + rows[0] + "}";
    if (rows.length === 2)
        return "headers {\n" + rows[0] + ",\n" + rows[1] + "}";
    var res = rows.join(',');
    return "headers {\n" + res + "\n}";
}
exports.transformHeaders = transformHeaders;
//# sourceMappingURL=headers-transform.js.map
"use strict";
function transformHeaders(headers) {
    if (!headers)
        return '';
    var rows = [];
    for (var p in headers) {
        var value = headers[p];
        rows.push("\t\theader '" + p + "' : '" + value + "'");
    }
    if (rows.length === 0)
        return "";
    if (rows.length === 1)
        return "headers {\n" + rows[0] + "}";
    if (rows.length === 2)
        return "headers {\n" + rows[0] + ",\n" + rows[1] + "\n\t\t}";
    var res = rows.join(',\n');
    return "headers {\n" + res + "\n\t\t}";
}
exports.transformHeaders = transformHeaders;
//# sourceMappingURL=headers-transform.js.map
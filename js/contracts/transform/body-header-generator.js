"use strict";
function transformHeaders(headers) {
    var res;
    var rows = [];
    for (var p in headers) {
        var value = headers[p];
        rows.push("header '" + p + "' : '" + value + "'\n");
    }
    return "{\n" + rows.join() + "}";
}
exports.transformHeaders = transformHeaders;
//# sourceMappingURL=body-header-generator.js.map
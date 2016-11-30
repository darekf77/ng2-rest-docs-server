"use strict";
var transform_helper_1 = require('./transform-helper');
var consts_1 = require('./consts');
function transformQueryPrams(queryParams) {
    console.log('queryParams', queryParams);
    if (queryParams === undefined)
        return '';
    var rows = [];
    if (typeof queryParams === 'string') {
        try {
            queryParams = JSON.parse(queryParams);
        }
        catch (error) {
            console.error('string withou object in transformQueryPrams');
            return '';
        }
    }
    // when instance of urlParams[]
    if ((queryParams instanceof Array) && queryParams.length > 0) {
        var arr = queryParams;
        arr.forEach(function (urlp) {
            for (var p in urlp) {
                if (p !== 'regex') {
                    var value = urlp[p];
                    var reg = (urlp.regex !== undefined) ? urlp.regex.source : transform_helper_1.regexForAllCharacters();
                    rows.push("parameter '" + p + "' : value(" + consts_1.CONSUMER + "(matching('" + reg + "')),producer('" + value + "')\n)");
                    break;
                }
            }
        });
    }
    else {
        // when instance of old object
        for (var p in queryParams) {
            var value = queryParams[p];
            rows.push("parameter '" + p + "' : value(" + consts_1.CONSUMER + "(matching('" + transform_helper_1.regexForAllCharacters() + "')),producer('" + value + "'))\n");
        }
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
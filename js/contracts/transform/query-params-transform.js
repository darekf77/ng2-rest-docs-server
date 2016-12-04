"use strict";
var transform_helper_1 = require('./transform-helper');
var consts_1 = require('./consts');
function transformQueryPrams(queryParams) {
    // console.log('queryParams', queryParams)
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
    // console.log('queryParams after', queryParams)
    // when instance of urlParams[]
    if ((queryParams instanceof Array) && queryParams.length > 0) {
        var arr = queryParams;
        arr.forEach(function (urlp) {
            for (var p in urlp) {
                if (p !== 'regex') {
                    var value = urlp[p];
                    if (typeof value === 'object')
                        value = JSON.stringify(value);
                    // console.log('value after', value)
                    var reg = (urlp.regex !== undefined) ? urlp.regex.source : transform_helper_1.regexForAllCharacters();
                    rows.push("\t\t\tparameter '" + p + "' : \n\t\t\tvalue(" + consts_1.CONSUMER + "(matching('" + reg + "')),\n\t\t\tproducer('" + value + "')\n\t\t)\n");
                    break;
                }
            }
        });
    }
    else {
        // when instance of old object
        for (var p in queryParams) {
            var value = queryParams[p];
            if (typeof value === 'object')
                value = JSON.stringify(value);
            rows.push("\t\t\tparameter '" + p + "' : \n\t\t\tvalue(" + consts_1.CONSUMER + "(matching('" + transform_helper_1.regexForAllCharacters() + "')),\n\t\t\tproducer('" + value + "')\n\t\t)\n");
        }
    }
    if (rows.length === 0)
        return "";
    if (rows.length === 1)
        return "queryParameters {\n" + rows[0] + "}";
    if (rows.length === 2)
        return "queryParameters {\n" + rows[0] + "\n" + rows[1] + "}";
    var res = rows.join('');
    return "queryParameters {\n" + res + "\n\t\t}";
}
exports.transformQueryPrams = transformQueryPrams;
//# sourceMappingURL=query-params-transform.js.map
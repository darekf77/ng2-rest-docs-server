"use strict";
var transform_1 = require('./transform');
function getContract(ex) {
    var c = {};
    c.requestBody = transform_1.bodyTransform(ex.bodySend, ex.form);
    c.responseBody = transform_1.bodyTransform(ex.bodyRecieve);
    c.headers = transform_1.transformHeaders(ex.headers);
    // console.log('ex.headers', ex.headers);
    // console.log('c.headers', c.headers);
    c.queryParams = transform_1.transformQueryPrams(ex.urlParams);
    c.method = ex.method;
    c.status = ex.status;
    c.url = ex.url.replace(ex.baseURLDocsServer, '');
    var res = contractGenerator(c);
    // console.log('------------------------------------------------')
    // console.log(res);
    return res;
}
exports.getContract = getContract;
function contractGenerator(contract) {
    return "\n    package contracts\n\n    org.springframework.cloud.contract.spec.Contract.make {\n        request {\n            urlPath('" + contract.url + "') {\n                " + contract.queryParams + "                \n            }\n            method " + contract.method + "\n            " + contract.requestBody + "\n        }\n        response {\n            status: '" + contract.status + "'\n            " + contract.responseBody + "\n        }\n        " + contract.headers + "\n    }\n    \n    ";
}
//# sourceMappingURL=get-contract.js.map
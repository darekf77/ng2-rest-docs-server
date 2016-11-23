"use strict";
function contractGenerator(contract) {
    return "org.springframework.cloud.contract.spec.Contract.make {\n        request {\n            urlPath(" + contract.url + ") {\n                " + contract.queryParams + "                \n            }\n            method " + contract.method + "\n            headers " + contract.headers + "\n            body(" + contract.requestBody + ")\n        }\n\n        response {\n            status " + contract.status + "\n            body(" + contract.responseBody + ")\n        }\n    }";
}
exports.contractGenerator = contractGenerator;
//# sourceMappingURL=contract-generator.js.map
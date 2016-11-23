"use strict";
var contract_generator_1 = require('./contract-generator');
/**
 * Recrusive function to bind contracts directive with
 * ng2-rest generated model
 *
 * @export
 * @param {any[]} model
 * @param {FormInputBind[]} inputs
 * @returns {string} groovy spring contract
 */
function getContract(model) {
    var contract;
    return contract_generator_1.contractGenerator(contract);
}
exports.getContract = getContract;
//# sourceMappingURL=form-body-binding.js.map
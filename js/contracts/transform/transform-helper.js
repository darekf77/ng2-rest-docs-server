"use strict";
function clean(s) {
    return s.trim().replace(/\s/g, '');
}
exports.clean = clean;
function change(s) {
    var t = s.trim().replace(/ /g, '$$$');
    var res = t.replace(/(\t|\n)/g, '');
    console.log('RES', res);
    return res.replace(/\$/g, ' ');
}
exports.change = change;
function regexFromLength(length) {
    return ".{" + length + "}";
}
exports.regexFromLength = regexFromLength;
function regexForAllCharacters() {
    return ".+";
}
exports.regexForAllCharacters = regexForAllCharacters;
//# sourceMappingURL=transform-helper.js.map
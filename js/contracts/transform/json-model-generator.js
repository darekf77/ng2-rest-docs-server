"use strict";
var WITHOUT_FORM_LENGTH_INDICATOR = 255;
function getModel(examples) {
    var json, model = undefined;
    if (json instanceof Array) {
        if (!model) {
            if (json.length > 1 && json[0] instanceof Object) {
                var arr = json;
                model = json.length > 0 ? [json[0]] : [];
                // gather all object indexes if necesary
                arr.forEach(function (v) {
                    for (var p in v) {
                        if (model[p] === undefined)
                            model[p] = v;
                    }
                });
            }
            else {
                model = json.length > 0 ? [json[0]] : [];
            }
            return model;
        }
        else {
        }
    }
    else {
        if (!model) {
            model = json;
            return model;
        }
        else {
        }
    }
    return model;
}
exports.getModel = getModel;
function consumerWithLenght(length) {
    return "$(consumer(regex('.{" + length + "}')))";
}
//# sourceMappingURL=json-model-generator.js.map
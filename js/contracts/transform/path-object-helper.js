"use strict";
var HelperData = (function () {
    function HelperData() {
    }
    HelperData.set = function (path, value, data) {
        var objTest = path.split('.').filter(function (f) { return f.trim() !== ''; });
        var arrTest = path.split('..').filter(function (f) { return f.trim() !== '' && f !== path; });
        if (arrTest && arrTest.length > 0) {
            var arrayFieldNameInObject = arrTest[0];
            var insArr = data[arrayFieldNameInObject];
            if (arrTest.length > 1) {
                if (insArr.length === 0) {
                    var nextFieldName = arrTest[1];
                    data[arrayFieldNameInObject].push({});
                    data[arrayFieldNameInObject][nextFieldName] = value;
                }
                else
                    HelperData.set(arrTest.slice(1, arrTest.length - 1).join(), value, insArr[0]);
            }
            else
                data[arrayFieldNameInObject] = value;
        }
        else if (objTest && objTest.length > 0) {
            var fieldNameInObject = objTest[0];
            if (objTest.length > 1)
                HelperData.set(objTest.slice(1, objTest.length - 1).join(), value, data[fieldNameInObject]);
            else
                data[fieldNameInObject] = value;
        }
        else if (path.length > 1) {
            data[path] = value;
        }
    };
    HelperData.get = function (path, data) {
        var objTest = path.split('.').filter(function (f) { return f.trim() !== ''; });
        var arrTest = path.split('..').filter(function (f) { return f.trim() !== '' && f !== path; });
        if (arrTest && arrTest.length > 0) {
            var arrayFieldNameInObject = arrTest[0];
            var insArr = data[arrayFieldNameInObject];
            if (arrTest.length > 1) {
                if (insArr.length === 0) {
                    var nextFieldName = arrTest[1];
                    data[arrayFieldNameInObject].push({});
                    return data[arrayFieldNameInObject][nextFieldName];
                }
                else
                    return HelperData.get(arrTest.slice(1, arrTest.length - 1).join(), insArr[0]);
            }
            else
                return data[arrayFieldNameInObject];
        }
        else if (objTest && objTest.length > 0) {
            var fieldNameInObject = objTest[0];
            if (objTest.length > 1)
                return HelperData.get(objTest.slice(1, objTest.length - 1).join(), data[fieldNameInObject]);
            else
                return data[fieldNameInObject];
        }
        else if (path.length > 1) {
            return data[path];
        }
    };
    HelperData.prototype.getLastFieldFrom = function (path) {
        var slices = [];
        var r = path.split('..');
        r.forEach(function (s) {
            var d = s.split('.');
            if (d.length === 1 && d[0] === s)
                slices.push(s);
            else
                slices = slices.concat(d);
        });
        return slices[slices.length - 1];
    };
    return HelperData;
}());
exports.HelperData = HelperData;
//# sourceMappingURL=path-object-helper.js.map
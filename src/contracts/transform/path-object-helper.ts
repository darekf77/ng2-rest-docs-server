
export class HelperData {
    static set(path: string, value: any, data: any) {
        let objTest = path.split('.').filter(f => f.trim() !== '');
        let arrTest = path.split('..').filter(f => f.trim() !== '' && f !== path);

        if (arrTest && arrTest.length > 0) { // got to first element
            let arrayFieldNameInObject = arrTest[0];
            let insArr: any[] = data[arrayFieldNameInObject];
            if (arrTest.length > 1) {
                if (insArr.length === 0) {
                    let nextFieldName = arrTest[1];
                    data[arrayFieldNameInObject].push({});
                    data[arrayFieldNameInObject][nextFieldName] = value;
                }
                else HelperData.set(arrTest.slice(1, arrTest.length - 1).join(), value, insArr[0])
            }
            else data[arrayFieldNameInObject] = value;
        } else if (objTest && objTest.length > 0) { // just go to object
            let fieldNameInObject = objTest[0];
            if (objTest.length > 1) HelperData.set(objTest.slice(1, objTest.length - 1).join(), value, data[fieldNameInObject]);
            else data[fieldNameInObject] = value;
        } else if (path.length > 1) {
            data[path] = value;
        }
    }

    static get(path: string, data: any) {
        let objTest = path.split('.').filter(f => f.trim() !== '');
        let arrTest = path.split('..').filter(f => f.trim() !== '' && f !== path);

        if (arrTest && arrTest.length > 0) { // got to first element
            let arrayFieldNameInObject = arrTest[0];
            let insArr: any[] = data[arrayFieldNameInObject];
            if (arrTest.length > 1) {
                if (insArr.length === 0) {
                    let nextFieldName = arrTest[1];
                    data[arrayFieldNameInObject].push({});
                    return data[arrayFieldNameInObject][nextFieldName];
                }
                else return HelperData.get(arrTest.slice(1, arrTest.length - 1).join(), insArr[0])
            }
            else return data[arrayFieldNameInObject];
        } else if (objTest && objTest.length > 0) { // just go to object
            let fieldNameInObject = objTest[0];
            if (objTest.length > 1) return HelperData.get(objTest.slice(1, objTest.length - 1).join(),
                data[fieldNameInObject]);
            else return data[fieldNameInObject];
        } else if (path.length > 1) {
            return data[path];
        }
    }

    getLastFieldFrom(path: string) {
        let slices = []
        let r = path.split('..');
        r.forEach(s => {
            let d = s.split('.');
            if (d.length === 1 && d[0] === s) slices.push(s);
            else slices = slices.concat(d);
        });
        return slices[slices.length - 1];
    }
}
import { FormInputBind } from '../models';

import { HelperData } from './path-object-helper';

/**
 * Transform object to groovy syntax
 * 
 * @export
 * @param {Object} data
 * @param {FormInputBind[]} bindings
 * @returns {string}
 */
export function bodyTransform(data: Object, bindings: FormInputBind[]): string {
    prepareSimpleTypes(data);
    if (bindings && bindings.length > 0) {
        bindings.forEach(binding => {
            let path = binding.name;
            let value = `${HelperData.get(path, data)}  $(consumer(regex(${regexFromLength(binding.length)}))),\n`
            HelperData.set(path, value, data);
        })
    }
    prepareArraysAndObjects(data);
    let s: string[] = [];
    for (let p in data) {
        s.push(data[p]);
    }
    return s.join();
}

export function regexFromLength(length: number) {
    return `.{${length}}`
}

export function regexForAllCharacters() {
    return `.+`
}

/**
 * Check if object contains object or array
 * 
 * @export
 * @param {Object} data
 * @returns {boolean}
 */
export function checkIfContainsArrayOrObjecct(data: Object): boolean {
    for (let p in data) {
        if (data[p] instanceof Object) return true;
    }
    return false;
}

function bodySimpelObjet(data: Object) {
    let s: string[] = [];
    for (let p in data) {
        let v = data[p];
        s.push(v);
    }
    return s.join();
}

/**
 * Change array/object in object to groovy syntax
 * 
 * @export
 * @param {Object} data
 */
export function prepareArraysAndObjects(data: Object) {
    for (let p in data) {
        let v = data[p];
        if (v instanceof Array) {
            let arr: any[] = v;
            if (arr.length > 0) {
                let first = arr[0];
                if (checkIfContainsArrayOrObjecct(first)) prepareArraysAndObjects(first);
                else data[p] = `[[
                    ${bodySimpelObjet(v)}
                ]]`;
            } else {
                data[p] = `[[ ]]`
            }
        } else if (v instanceof Object) {
            if (checkIfContainsArrayOrObjecct(v)) prepareArraysAndObjects(v);
            else data[p] = `[ ]`
        }
    }
}


/**
 * Change simple types values in object for groovy syntax
 * 
 * @export
 * @param {Object} data
 */
export function prepareSimpleTypes(data: Object) {
    for (let p in data) {
        let v = data[p];
        if (v instanceof Array) {
            let arr: any[] = v;
            if (arr.length > 0) {
                data[p] = arr.slice(0, 1);
                prepareSimpleTypes(data[p][0]);
            }
        } else if (v instanceof Object) {
            prepareSimpleTypes(v);
        } else {
            data[p] = `$(
                consumer('${data[p]}),
                producer(regex('${regexForAllCharacters()}'))
            )`;
        }
    }
}
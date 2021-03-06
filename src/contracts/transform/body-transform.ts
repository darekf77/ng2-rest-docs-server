import { FormInputBind } from '../models';

import { PathObject } from './path-object';
import { regexForAllCharacters, regexFromLength } from './transform-helper';

import { PRODUCER, CONSUMER } from './consts';


/**
 * Transform object to groovy syntax
 * 
 * @export
 * @param {Object} data
 * @param {FormInputBind[]} bindings
 * @returns {string}
 */
export function bodyTransform(data: any, bindings?: FormInputBind[]): string {

    console.log('bindings', bindings);

    // console.log('data', data);

    try {
        data = JSON.parse(data);
    } catch (error) {
        console.error('string withou object in bodyTransform');
        return '';
    }

    if (data instanceof Array) {
        let arr: any[] = data;
        if (arr.length === 0) return `[[ ]]`;
        data = arr[0];
    }


    if (bindings && bindings.length > 0) {
        bindings.forEach(binding => {
            binding.temp = PathObject.get(binding.path, data);
        });
    }
    prepareSimpleTypes(data);
    if (bindings && bindings.length > 0) {
        bindings.forEach(binding => {
            if (binding.length !== null) {
                let path = binding.path;

                let consumer = binding.temp;
                let consumerString = consumer ? `${CONSUMER}('${consumer}'),` : '';

                let value = `\t\t\t\t${PathObject.fieldName(path)}:  
                    \t\t\t$(
                        \t\t\t\t${consumerString} ${PRODUCER}(regex('${regexFromLength(binding.length)}')) 
                    \t\t\t)\n`
                PathObject.set(path, value, data);
            }
        })
    }
    prepareArraysAndObjects(data);

    let s: string[] = [];
    for (let p in data) {
        s.push(data[p]);
    }
    return 'body(\n\t\t' + s.join() + '\n\t\t)\n';
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

/**
 * We assume that all simple field are alread with groovy syntax
 * 
 * @param {Object} data
 * @returns
 */
export function bodySimpelObjet(data: Object): string {
    let s: string[] = [];
    for (let p in data) {
        let v = data[p];
        s.push(v);
    }
    if (s.length === 0) return `[]`;
    if (s.length === 1) return s[0];
    if (s.length === 2) return `${s[0]},\n${s[1]}`;
    let res = s.join(',');
    return res;
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
                if (checkIfContainsArrayOrObjecct(first)) {
                    prepareArraysAndObjects(first);
                }
                else data[p] = `${p}: [[\n
                    \t\t${bodySimpelObjet(first)}\n
                ]]\n`;
            } else {
                data[p] = `${p}: [[]]`
            }
        } else if (v instanceof Object) {
            if (checkIfContainsArrayOrObjecct(v)) prepareArraysAndObjects(v);
            else data[p] = `${p}: []`
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
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log('canno prepareSimpleTypes ', JSON.stringify(error));
            return;
        }
    }
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
            data[p] = `\n\t\t${p}: $(
                \t${CONSUMER}('${data[p]}'),
                \t${PRODUCER}(regex('${regexForAllCharacters()}'))
            \t) `;
        }
    }
    return data;
}
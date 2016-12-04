import { clean } from './transform-helper';

import { regexForAllCharacters, regexFromLength } from './transform-helper';

import { PRODUCER, CONSUMER } from './consts';
import { UrlParams } from '../models';

export function transformQueryPrams(queryParams: UrlParams[] | any): string {
    // console.log('queryParams', queryParams)

    if (queryParams === undefined) return '';

    let rows: string[] = [];
    if (typeof queryParams === 'string') {
        try {
            queryParams = JSON.parse(<string>queryParams);
        } catch (error) {
            console.error('string withou object in transformQueryPrams');
            return '';
        }
    }

    // console.log('queryParams after', queryParams)

    // when instance of urlParams[]
    if ((queryParams instanceof Array) && queryParams.length > 0) {
        let arr = <UrlParams[]>queryParams;
        arr.forEach(urlp => {
            for (let p in urlp) {
                if (p !== 'regex') {
                    let value = urlp[p];
                    if (typeof value === 'object') value = JSON.stringify(value);
                    // console.log('value after', value)
                    let reg = (urlp.regex !== undefined) ? urlp.regex.source : regexForAllCharacters();
                    rows.push(`\t\t\tparameter '${p}' : \n\t\t\tvalue(${CONSUMER}(matching('${reg}')),\n\t\t\tproducer('${value}')\n\t\t)\n`)
                    break;
                }
            }
        })
    } else {
        // when instance of old object
        for (let p in queryParams) {
            let value = queryParams[p];
            if (typeof value === 'object') value = JSON.stringify(value);
            rows.push(`\t\t\tparameter '${p}' : \n\t\t\tvalue(${CONSUMER}(matching('${regexForAllCharacters()}')),\n\t\t\tproducer('${value}')\n\t\t)\n`)
        }
    }
    if (rows.length === 0) return ``;
    if (rows.length === 1) return `queryParameters {\n${rows[0]}}`;
    if (rows.length === 2) return `queryParameters {\n${rows[0]}\n${rows[1]}}`;
    let res = rows.join('');
    return `queryParameters {\n${res}\n\t\t}`;
}


import { clean } from './transform-helper';

import { regexForAllCharacters, regexFromLength } from './transform-helper';

import { PRODUCER, CONSUMER } from './consts';
import { UrlParams } from '../models';

export function transformQueryPrams(queryParams: UrlParams[] | any): string {
    console.log('queryParams', queryParams)

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

    // when instance of urlParams[]
    if ((queryParams instanceof Array) && queryParams.length > 0) {
        let arr = <UrlParams[]>queryParams;
        arr.forEach(urlp => {
            for (let p in urlp) {
                if (p !== 'regex') {
                    let value = urlp[p];
                    let reg = (urlp.regex !== undefined) ? urlp.regex.source : regexForAllCharacters();
                    rows.push(`parameter '${p}' : value(${CONSUMER}(matching('${reg}')),producer('${value}')\n)`)
                    break;
                }
            }
        })
    } else {
        // when instance of old object
        for (let p in queryParams) {
            let value = queryParams[p];
            rows.push(`parameter '${p}' : value(${CONSUMER}(matching('${regexForAllCharacters()}')),producer('${value}'))\n`)
        }
    }
    if (rows.length === 0) return ``;
    if (rows.length === 1) return `parameter {\n${rows[0]}}`;
    if (rows.length === 2) return `parameter {\n${rows[0]}\n${rows[1]}}`;
    let res = rows.join('');
    return `queryParameters {\n${res}\n}`;
}


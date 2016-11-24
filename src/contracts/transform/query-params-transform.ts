import { clean } from './transform-helper';

import { regexForAllCharacters, regexFromLength } from './transform-helper';

import { PRODUCER, CONSUMER } from './consts';

export function transformQueryPrams(queryParams: Object): string {
    if (!queryParams) return '';
    let rows: string[] = [];
    for (let p in queryParams) {
        let value = queryParams[p];
        rows.push(`parameter '${p}' : value(${CONSUMER}(matching("${regexForAllCharacters()}")),producer('${value}')\n)`)
    }
    if (rows.length === 0) return ``;
    if (rows.length === 1) return `parameter {\n${rows[0]}}`;
    if (rows.length === 2) return `parameter {\n${rows[0]}\n${rows[1]}}`;
    let res = rows.join(''); 
    return `queryParameters {\n${res}\n}`;
}


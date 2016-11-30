import { PRODUCER, CONSUMER } from './consts';


export function transformHeaders(headers: Object): string {
    if (!headers) return '';
    let rows: string[] = [];
    for (let p in headers) {
        let value = headers[p];
        rows.push(`header '${p}' : '${value}'\n`)
    }
    if (rows.length === 0) return ``;
    if (rows.length === 1) return `headers {\n${rows[0]}}`;
    if (rows.length === 2) return `headers {\n${rows[0]},\n${rows[1]}}`;
    let res = rows.join(','); 
    return `headers {\n${res}\n}`;
}


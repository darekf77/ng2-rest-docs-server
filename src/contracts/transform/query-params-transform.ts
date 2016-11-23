
import { WITHOUT_FORM_LENGTH_INDICATOR } from './consts';

export function transformQueryPrams( queryParams: Object ): string {
    if( !queryParams ) return '';
    let res: string;
    let rows: string[] = [];
    for( let p in queryParams ) {
        // let value = queryParams[p];
        rows.push(`parameter '${p}' : value(consumer(regex('.{${WITHOUT_FORM_LENGTH_INDICATOR}}')))\n`)
    }
    return `queryParameters {\n${rows.join()}}`; 
}


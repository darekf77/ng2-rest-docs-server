
export function transformHeaders( headers: Object ): string {
    if( !headers ) return '';
    let res: string;
    let rows: string[] = [];
    for( let p in headers ) {
        let value = headers[p];
        rows.push(`header '${p}' : '${value}'\n`)
    }
    return `headers {\n${rows.join()}}`; 
}


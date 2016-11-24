
export function clean(s: any) {
    return s.trim().replace(/\s/g, '');
}

export function change(s) {
    let t = s.trim().replace(/ /g, '$$$');
    let res = t.replace(/(\t|\n)/g, '');
    console.log('RES', res);
    return res.replace(/\$/g, ' ');
}

export function regexFromLength(length: number) {
    return `.{${length}}`
}

export function regexForAllCharacters() {
    return `.+`
}
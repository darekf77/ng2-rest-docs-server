import { Pipe, PipeTransform } from '@angular/core';

import { DocModel, DocGroup } from './models';

function check(d: DocModel, word: string): boolean {
    let phrase = word.toLowerCase();
    return (
        (d.urlFull && d.urlFull.toLowerCase().search(phrase) !== -1) ||
        (d.description && d.description.toLowerCase().search(phrase) !== -1) ||
        (d.bodyRecieve && d.bodyRecieve.toLowerCase().search(phrase) !== -1) ||
        (d.bodySend && d.bodySend.toLowerCase().search(phrase) !== -1)
    )
}

@Pipe({
    name: 'searchcontracts'
})

export class SearchPipe implements PipeTransform {
    transform(value: DocGroup[], args: string): any {
        let phrase = args !== '' ? args : undefined;

        console.log('phrase', phrase)
        console.log('value', value)

        if (phrase === undefined) return value;
        let temp: DocGroup[] = [];
        value.forEach(g => {
            if (g.name && g.name.toLowerCase().search(phrase.toLowerCase()) !== -1) {
                temp.push(g);
            } else {
                let found = false;
                g.files.forEach(f => {
                    if (check(f, phrase)) {
                        temp.push(g);
                        found = true;
                        return false;
                    } else {
                        f.examples.forEach(ex => {
                            if (check(ex, phrase)) {
                                temp.push(g);
                                found = true;
                                return false;
                            }
                        });
                        if (found) return false;
                    }
                    if (found) return false;
                })
                if (found) return false;
            }

        })

        console.log('temp', temp)

        return temp;
    }
}
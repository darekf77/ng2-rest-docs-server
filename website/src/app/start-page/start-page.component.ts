import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { DocGroup, DocModel } from './models';
import { TAB_DIRECTIVES, TabDirective } from 'ng2-bootstrap/ng2-bootstrap';

import { HighlightCodeDirective } from './highlight.directive';
import { SearchPipe } from './search.pipe';
import { JsonConfigService } from './json-config.service';
import { debounceable } from './debounce';
import { Helpers } from './helpers';

function groupFiles(files: DocModel[]): DocGroup[] {
    let groups: DocGroup[] = [];
    files.forEach(f => {
        if (f.group === undefined) f.group = '-- undefined --';
        console.log(f.group);
        let a = groups.filter(g => g.name === f.group);
        if (a.length === 0) {
            groups.push({
                name: f.group,
                files: JSON.parse(JSON.stringify(
                    files.filter(ff => ff.group === f.group)))
            });
        }
    });
    return groups;
}

function mergeExamples(files: DocModel[]): DocModel[] {
    let tmpFiles: DocModel[] = [];
    files.forEach(f => {
        let a = tmpFiles.filter(d => d.url === f.url);
        if (a.length === 0) {
            let docM: DocModel = JSON.parse(JSON.stringify(f));
            docM.examples = [];
            docM.examples.push(JSON.parse(JSON.stringify(f)));
            // TODO remove some shit from docM
            tmpFiles.push(docM);

        } else {
            console.log('aaa', a);
            a[0].examples.push(JSON.parse(JSON.stringify(f)));
            // TODO remove some shit from a[0]
        }
    });
    return tmpFiles;
}


@Component({
    selector: 'start-page',
    template: require('./start-page.component.html'),
    styles: [require('./start-page.component.scss')],
    pipes: [TranslatePipe, SearchPipe],
    providers: [JsonConfigService],
    directives: [HighlightCodeDirective, TAB_DIRECTIVES, TabDirective],
    encapsulation: ViewEncapsulation.None
})
export class StartPageComponent implements OnInit, OnDestroy {
    constructor(private config: JsonConfigService) { }

    search_model: string = '';
    phrase: string = '';

    msg: string;
    activeFile: DocModel;
    groups: DocGroup[] = [];
    handlers: Subscription[] = [];
    ngOnInit() {

        this.handlers.push(this.config.model.getGroupFilesList().subscribe((names: string[]) => {
            console.log('names', names);
            this.getGroups(names);
        }));

        this.handlers.push(this.config.model.getMessage().subscribe(msg => {
            console.log('msg', msg);
            this.msg = msg;
        }))
    }

    getGroups(names: string[]) {
        if (names.length === 0) return;
        this.handlers.push(this.config.model.getGroup(names.pop()).subscribe(group => {
            this.groups.push(group);
            this.getGroups(names);
        }))
    }

    ngOnDestroy() {
        this.handlers.forEach(h => h.unsubscribe());
    }

    private closeAll() {
        this.groups.forEach(g => g.files.forEach(f => f.examples.forEach(e => e['isOpen'] = false)));
    }

    open(ex: DocModel) {
        this.closeAll();
        ex['isOpen'] = false;
    }


    isGroupPartialSelected(g: DocGroup): boolean {
        let isSomethingEmpty = false;
        let isSomethingSelected = false;
        g.files.forEach(f => {
            f.examples.forEach(e => {
                if (e['isSelected']) {
                    isSomethingSelected = true;
                } else {
                    isSomethingEmpty = true;
                }
                if (isSomethingEmpty && isSomethingSelected) return false;
            });
            if (isSomethingEmpty && isSomethingSelected) return false;
        })
        return isSomethingEmpty && isSomethingSelected;
    }

    isGroupFullSelected(g: DocGroup) {
        let isFull = true;
        g.files.forEach(f => {
            f.examples.forEach(ex => {
                if (!ex['isSelected']) {
                    isFull = false;
                    return false;
                }
            })
            if (!isFull) return false;
        })
        return isFull;
    }

    @debounceable(100, undefined)
    search() {
        console.log('search')
        this.phrase = this.search_model;
    }

    copy(d: DocModel) {
        console.log('contract', d['contract'])
        Helpers.copyToClipboard(d['contract']);
    }

    cuttedUrl(file: DocModel) {
        return file.baseURLDocsServer ? file.url.replace(file.baseURLDocsServer, '') : file.url;
    }

    lastElemem;
    lastDesc;
    lastE;
    selectFile(file: DocModel, e: Event) {
        this.lastE = e;
        if (this.activeFile === file) {
            // console.log('unselect file')
            this.activeFile = undefined;
            setTimeout(() => {
                let style = window.getComputedStyle(this.lastDesc, undefined);
                this.lastElemem.style['padding-bottom'] = '0px';
            });
            return;
        }
        // console.log('select')
        this.activeFile = file;
        if (this.lastDesc !== undefined && this.lastElemem !== undefined) {
            let style = window.getComputedStyle(this.lastDesc, undefined);
            this.lastElemem.style['padding-bottom'] = '0px';
        }
        this.recalculatePadding();
    }

    recalculatePadding() {
        setTimeout(() => {
            // console.log(e.srcElement)
            let elem: HTMLElement = this.lastE.srcElement.parentElement;
            let box = elem.getElementsByClassName('description').item(0);
            this.lastDesc = box;
            let style = window.getComputedStyle(this.lastDesc, undefined);
            let method: any = elem.getElementsByClassName('method').item(0);
            this.lastElemem = method;

            let pad = Number(style.height.replace('px', ''));
            this.lastElemem.style['padding-bottom'] = `${pad + 20}px`;
        });
    }


    openExample(ex: DocModel) {
        if (!ex['isOpen']) {
            ex['isOpen'] = true;
        } else {
            ex['isOpen'] = !ex['isOpen'];
        }
        this.recalculatePadding();
    }

    removeReturn(s: string) {

        let t = decodeURIComponent(s).replace(/\\n/g, '\n')
        return t; // rreturn t.slice(1, t.length - 1);
    }


    get selected() {
        let selected = [];
        this.groups.forEach(g => {
            g.files.forEach(f => {
                f.examples.forEach(ex => {
                    if (ex['isSelected']) selected.push(ex);
                })
            })
        })
        return selected;
    }


    downloadAll() {
        let selected = [];
        this.groups.forEach(g => {
            g.files.forEach(f => {
                f.examples.forEach(ex => {
                    if (ex['isSelected']) selected.push(ex['contractPath']);
                })
            })
        })
        console.log('this.selected', selected);
        this.config.model.downloadAll(selected).subscribe(link => {
            window.location.href = link;
        })
    }

}

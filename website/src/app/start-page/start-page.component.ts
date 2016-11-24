import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { DocGroup, DocModel, HttpMethod, DocExample } from 'ng2-rest/ng2-rest';

import { HighlightCodeDirective } from './highlight.directive';

import { JsonConfigService } from './json-config.service';


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
    pipes: [TranslatePipe],
    providers: [JsonConfigService],
    directives: [HighlightCodeDirective]
})
export class StartPageComponent implements OnInit, OnDestroy {
    constructor(private config: JsonConfigService) { }

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

    cuttedUrl(file: DocModel) {
        return file.baseURL ? file.url.replace(file.baseURL, '') : file.url;
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

    openExample(ex: DocExample) {
        if (!ex['isOpen']) {
            ex['isOpen'] = true;
        } else {
            ex['isOpen'] = !ex['isOpen'];
        }
        this.recalculatePadding();
    }

    removeReturn(s: string) {
        console.log('s', s)
        return s.replace(/\\n/g, '\n')
    }

}

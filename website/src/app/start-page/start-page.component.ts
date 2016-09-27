import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { JsonConfigService, DocModel , HttpMethod} from './json-config.service';

interface DocExample {
    body: string;
    usecase: string;
    method: HttpMethod;
}

interface Doc extends DocModel {
    examples: DocExample[];
}


@Component({
    selector: 'start-page',
    template: require('./start-page.component.html'),
    styles: [require('./start-page.component.scss')],
    pipes: [TranslatePipe],
    providers: [JsonConfigService]
})
export class StartPageComponent implements OnInit, OnDestroy {
    constructor(private config: JsonConfigService) { }

    activeFile: DocModel;
    files: DocModel[];
    handlers: Subscription[] = [];
    ngOnInit() {
        this.handlers.push(this.config.model.getAll().subscribe((files: DocModel[]) => {
            console.log('files', files);
            let tmpFiles: Doc[] = [];

            files.forEach(f => {
                let a = tmpFiles.filter(d => d.url === f.url);
                if (a.length === 0) {
                    tmpFiles.push(<Doc>{
                        url: f.url,
                        name: f.name,
                        fileName: f.fileName,
                        description: f.description,
                        examples: [{
                            usecase: f.usecase,
                            body: f.body,
                            method: f.method
                        }]
                    });
                } else {
                    a[0].examples.push({
                        body: f.body,
                        usecase: f.usecase,
                        method: f.method
                    });
                }
            });

            this.files = tmpFiles;
        }));
    }

    ngOnDestroy() {
        this.handlers.forEach(h => h.unsubscribe());
    }

    lastElemem;
    lastDesc;
    selectFile(file: DocModel, e: Event) {
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
        setTimeout(() => {
            // console.log(e.srcElement)
            let elem: HTMLElement = e.srcElement.parentElement;
            let box = elem.getElementsByClassName('description').item(0);
            this.lastDesc = box;
            let style = window.getComputedStyle(this.lastDesc, undefined);
            let method: any = elem.getElementsByClassName('method').item(0);
            this.lastElemem = method;
            this.lastElemem.style['padding-bottom'] = style.height;
        });

    }



}

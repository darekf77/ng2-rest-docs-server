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
import { JiraService, JiraAuth, JiraTask } from '../jira';

@Component({
    selector: 'start-page',
    template: require('./start-page.component.html'),
    styles: [require('./start-page.component.scss')],
    pipes: [TranslatePipe, SearchPipe],
    providers: [JsonConfigService, JiraService],
    directives: [HighlightCodeDirective, TAB_DIRECTIVES, TabDirective],
    encapsulation: ViewEncapsulation.None
})
export class StartPageComponent implements OnInit, OnDestroy {
    constructor(private config: JsonConfigService, private jira: JiraService) { }

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
        if (names.length === 0) {
            this.prepreTasks();
            return;
        };
        this.handlers.push(this.config.model.getGroup(names.pop()).subscribe(group => {
            this.groups.push(group);
            this.getGroups(names);
        }))
    }

    getStatus(key: string) {
        return this.jira.getStatusByKey(key, 'http://jira.eniro.com', 'ZGFmaTUxOkphYmxvbmthMTc=');
    }

    prepareDoc(d: DocModel) {
        let DEF_JIRA_STATUS = '-';
        let isGoodJiraKey = (!d.jiraKey && d.jiraKey !== '');


        if (isGoodJiraKey) {
            d.jiraStatus = DEF_JIRA_STATUS;
        }
        if (isGoodJiraKey && !d.jiraStatus && d.jiraStatus !== DEF_JIRA_STATUS) {
            this.getStatus(d.jiraKey).subscribe(s => {
                if (s.fields &&
                    s.fields.status &&
                    s.fields.status.statusCategory &&
                    s.fields.status.statusCategory.name) {

                    d.jiraStatus = s.fields.status.statusCategory.name;
                } else {
                    d.jiraStatus = '-- Wrong Status --';
                }
            });
        }
        if (d.examples && d.examples.length > 0 && d.examples.filter(e => !e.jiraStatus && e.jiraStatus !== DEF_JIRA_STATUS).length) {
            d.examples.forEach(ex => {
                this.prepareDoc(ex);
            });
        }
    }

    prepreTasks() {
        this.groups.forEach(g => {
            g.files.forEach(f => {
                this.prepareDoc(f);
            });
        })
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

    isEndpointPartialSelected(f: DocModel): boolean {
        let isSomethingEmpty = false;
        let isSomethingSelected = false;
        // g.files.forEach(f => {
        f.examples.forEach(e => {
            if (e['isSelected']) {
                isSomethingSelected = true;
            } else {
                isSomethingEmpty = true;
            }
            if (isSomethingEmpty && isSomethingSelected) return false;
        });
        // if (isSomethingEmpty && isSomethingSelected) return false;
        // })
        return isSomethingEmpty && isSomethingSelected;
    }

    isEndpointFullSelected(f: DocModel) {
        let isFull = true;
        // g.files.forEach(f => {
        f.examples.forEach(ex => {
            if (!ex['isSelected']) {
                isFull = false;
                return false;
            }
        })
        //     if (!isFull) return false;
        // })
        return isFull;
    }

    markFile(f: DocModel) {
        f.examples.forEach(ex => {
            ex['isSelected'] = true;
        })
    }

    unmarkFile(f: DocModel) {
        f.examples.forEach(ex => {
            ex['isSelected'] = false;
        })
    }

    markGroup(g: DocGroup) {
        g.files.forEach(f => this.markFile(f));
    }

    unmarkGroup(g: DocGroup) {
        g.files.forEach(f => this.unmarkFile(f));
    }

    fileChange(g: DocModel, isSelected: boolean) {
        if (isSelected) {
            this.unmarkFile(g);
        } else {
            this.markFile(g);
        }
    }

    groupChange(g: DocGroup, isSelected: boolean) {

        if (isSelected) {
            this.unmarkGroup(g);
        } else {
            this.markGroup(g);
        }
    }

    markAll() {
        this.groups.forEach(g => this.markGroup(g));
    }

    unmarkAll() {
        this.groups.forEach(g => this.unmarkGroup(g));
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

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation, ContentChild, OnChanges } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { DocGroup, DocModel } from './models';
import { TAB_DIRECTIVES, TabDirective, MODAL_DIRECTIVES, ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { ComponentsHelper } from 'ng2-bootstrap/components/utils/components-helper.service';

import { HighlightCodeDirective } from './highlight.directive';
import { SearchPipe } from './search.pipe';
import { JsonConfigService } from './json-config.service';
import { Helpers } from './helpers';
import { JiraService, JiraAuth, JiraTask } from '../jira';
import { JiraConfig } from './jira-config';

@Component({
    selector: 'start-page',
    template: require('./start-page.component.html'),
    styles: [require('./start-page.component.scss')],
    pipes: [TranslatePipe, SearchPipe],
    providers: [JsonConfigService, JiraService, ComponentsHelper],
    directives: [HighlightCodeDirective, TAB_DIRECTIVES, TabDirective, ModalDirective],
    encapsulation: ViewEncapsulation.None
})
export class StartPageComponent implements OnInit, OnDestroy {
    constructor(private config: JsonConfigService, private jira: JiraService) { }

    @ViewChild('lgModal') modalLogin: any;
    @ViewChild('lgModal2') modalContracts: any;
    admin: boolean = false;
    search_model: string = '';
    phrase: string = '';
    configJira: JiraConfig;
    msg: string;
    activeFile: DocModel;
    groups: DocGroup[] = [];
    handlers: Subscription[] = [];
    selectedInModal: DocModel;
    selectInModal(ex) {
        if (ex === this.selectedInModal) {
            this.selectedInModal = undefined;
            return;
        }
        console.log('ex', ex)
        this.selectedInModal = undefined;
        setTimeout(() => {
            this.selectedInModal = ex;
        });
    }

    checkModal() {

        if (this.selected && this.selected.length == 0) {
            this.modalContracts.hide();
        }
    }


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

    login(username: string, passsword: string) {
        // console.log(arguments);
        let token = btoa(`${username}:${passsword}`);
        // console.log('token ', token);
        // console.log('token jria', this.configJira.token);
        if (token.trim() === this.configJira.token.trim()) {
            this.modalLogin.isError = false;
            setTimeout(() => {
                this.admin = true;
                this.modalLogin.hide();
            }, 0)

        }
        else {
            this.admin = false;
            this.modalLogin.isError = true;
        }
    }

    private _logoutClear(f: DocModel) {
        f['isOpen'] = false;
        f['isEdited'] = false;
        f['isSelected'] = false;
    }

    logout() {
        this.admin = false;
        this.groups.forEach(g => {
            g.files.forEach(f => {
                this._logoutClear(f);
                if (f.examples && f.examples.length > 0) f.examples.forEach(ex => this._logoutClear(ex));
            })
        })
    }

    getGroups(names: string[]) {
        if (names.length === 0) {
            this.getJiraConfig();
            return;
        };
        this.handlers.push(this.config.model.getGroup(names.pop()).subscribe(group => {
            this.groups.push(group);
            this.getGroups(names);
        }))
    }

    bindJiraData(d: DocModel) {
        let f = this.configJira.models.filter(m => {
            return (m.usecase === d.usecase &&
                m.method === d.method &&
                m.urlFull === d.urlFull &&
                m.group === d.group &&
                m.contract === d.contract
            );
        });
        console.log('Bind results', f)
        if (f.length > 0) {
            let first = f[0];
            d.jiraKey = first.jiraKey;
        }
        // TODO is this super correct ?
    }


    getJiraConfig() {
        this.config.model.getJiraConfig().subscribe(c => {
            console.log('new config jira', c);
            if (c !== undefined) {
                this.configJira = c;
                if (this.configJira.models && this.configJira.models.length > 0) {
                    this.groups.forEach(g => {
                        g.files.forEach(f => {
                            this.bindJiraData(f);
                            if (f.examples && f.examples.length > 0) {
                                f.examples.forEach(ex => this.bindJiraData(ex));
                            }
                        })
                    })
                    this.prepareTasks();
                }
            }
        });
    }


    getStatus(key: string) {
        key = encodeURIComponent(key);
        return this.jira.getStatusByKey(key, this.configJira.url, this.configJira.token);
        // 'http://jira.eniro.com', 'ZGFmaTUxOkphYmxvbmthMTc='
    }

    getClassName(statusName: string) {
        let n = statusName.trim().toLowerCase().replace(/\s/g, '-');
        return `status-${n}`;
    }


    @Helpers.debounceable(1000, undefined)
    saveConfig() {
        // console.log('saving jira config ');
        let newConfig = this.configJira;
        newConfig.models = [];
        function pushTo(f: DocModel) {
            let tmp: DocModel = JSON.parse(JSON.stringify(f));
            tmp.bodySend = undefined;
            tmp.bodyRecieve = undefined;
            // console.log('push new data', tmp)
            newConfig.models.push(tmp)
        }
        this.groups.forEach(g => {
            g.files.forEach(f => {
                if (f.jiraKey && f.jiraKey.trim() !== '') {
                    // console.log('f.jiraKey', f.jiraKey)
                    pushTo(f);
                }
                if (f.examples && f.examples.length > 0) {
                    f.examples.forEach(ex => {
                        // console.log('ex.jiraKey', ex.jiraKey)
                        if (ex.jiraKey && ex.jiraKey.trim() !== '') pushTo(ex);
                    })
                }
            });
        });
        this.handlers.push(this.config.model.getSaveJiraConfig(newConfig).subscribe(() => {
            console.log('saving jira config done');
        }));

    }

    prepareDoc(d: DocModel, wait: boolean = false) {
        if (wait) { // quick fix for keyup and ngmodel
            setTimeout(() => {
                this.prepareDoc(d);
            })
            return;
        }
        console.log(`preparing statuses for key: ${d.jiraKey}`)
        if (d.jiraKey && d.jiraKey.trim() !== '') {
            console.log('send request');
            this.saveConfig();
            this.handlers.push(this.getStatus(d.jiraKey).subscribe(s => {
                console.log('Data from jira', s);
                if (s.fields &&
                    s.fields.status &&
                    s.fields.status.name) {
                    d.jiraStatus = s.fields.status.name;
                    console.log('status shoudl changed', d)
                }
            }));            
        }
        if (d.examples && d.examples.filter(e => e.jiraKey && e.jiraKey.trim() !== '').length > 0) {
            d.examples.forEach(ex => {
                this.prepareDoc(ex);
            });
        }
    }

    prepareTasks() {
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


    @Helpers.debounceable(100, undefined)
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

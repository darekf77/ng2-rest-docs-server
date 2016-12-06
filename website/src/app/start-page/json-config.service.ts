import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Subject } from 'rxjs';
import { Resource } from 'ng2-rest/ng2-rest';
import { ENDPOINTS } from '../app.component';
import { DocModel } from './models';
import { JiraConfig } from './jira-config';

@Injectable()
export class JsonConfigService {

    headers: Headers = new Headers();

    model = {
        getGroupFilesList: () => this.http.get(`json/groups.json`).map(r => r.json()),
        getGroup: (groupFilesName: string) => {
            let g = groupFilesName.trim()
                .replace(/\s/g, '')
                .toUpperCase();
            return this.http.get(`json/group-${g}.json`).map(r => r.json())
        },
        getMessage: () => this.http.get(`json/msg.txt`).map(r => {
            return r.text()
        }),
        downloadAll: (files: any[]) => this.http.post('/api/downloadall', files).map(r => r.text()),
        getJiraConfig: () => {
            return this.http.get('json/jira/config.json', { headers: this.headers }).map(c => {
                let config: JiraConfig;
                try {
                    config = c.json()
                } catch (error) {
                    console.error(error)
                    config = undefined;
                }
                if (!config) return undefined;
                this.headers.append('Authorization', `Basic ${config.token}`)
                return config;
            })
        },
        getSaveJiraConfig: ( config: JiraConfig) => {
            return this.http.post('api/config/jira', JSON.stringify(config), {
                headers: this.headers
            }).map(c => c.json());
        }
    };



    private _headers = {
        'Content-Type': 'application/json'
    }
    constructor(private http: Http) {
        for (let h in this._headers) {
            this.headers.append(h, this._headers[h]);
        }
    }
}
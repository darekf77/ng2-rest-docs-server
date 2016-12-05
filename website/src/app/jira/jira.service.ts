import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { JiraTask } from './status';
import { JiraAuth, getToken } from './auth';
import { DocModel } from '../start-page';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class JiraService {

    private headers: Headers = new Headers();
    private _getStatus = new Subject<JiraTask>();
    getStatusByKey(key: string, jiraUrl: string, auth: JiraAuth | string): Observable<JiraTask> {
        let a = (typeof auth === 'string') ? auth : getToken(auth);
        this.headers.append('Authorization', `Basic ${a}`)
        if (jiraUrl.search('http://') !== -1) jiraUrl = jiraUrl.replace('http://', '');
        if (jiraUrl.search('https://') !== -1) jiraUrl = jiraUrl.replace('https://', '');
        let path = encodeURIComponent(`/rest/api/latest/issue/${key}?fields=status`);
        let url = encodeURIComponent(`${jiraUrl}`);
        this.http.get(`api/cross/get/${url}/${path}`, {
            headers: this.headers
        }).map(d => d.json()).subscribe((res) => this._getStatus.next(res), err => this._getStatus.error(err));
        return this._getStatus.asObservable();
    }



    bindModelWithTask(model: DocModel, key: string) {
        // model.
    }


    private _headers = {
        'Content-Type': 'application/json'
    }

    constructor(private http: Http) {
        for (let h in this._headers) {
            this.headers.append(h, this._headers[h]);
        }
    }






}
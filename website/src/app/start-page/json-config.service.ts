import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subject } from 'rxjs';
import { Resource } from 'ng2-rest/ng2-rest';
import { ENDPOINTS } from '../app.component';


@Injectable()
export class JsonConfigService {


    model = {
        getGroupFilesList: () => this.http.get(`json/groups.json`).map(r => r.json()),
        getGroup: (groupFilesName: string) => this.http.get(`json/${groupFilesName}`).map(r => r.json()),
        getMessage: () => this.http.get(`json/msg.txt`).map(r => {
            return r.text()
        })
    };


    constructor(private http: Http) {

    }
}
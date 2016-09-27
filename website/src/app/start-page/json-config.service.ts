import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subject } from 'rxjs';
import { Resource } from 'ng2-rest/ng2-rest';
import { ENDPOINTS } from '../app.component';


export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface DocModel {
    url: string;
    fileName: string;
    name: string;
    group: string;
    description: string;
    usecase: string;
    body: string;
    method: HttpMethod;
}

@Injectable()
export class JsonConfigService {


    model = {
        getAll: () => this.http.get(`json/config.json`).map( r  => r.json() )
    };

    constructor(private http: Http) {

    }
}
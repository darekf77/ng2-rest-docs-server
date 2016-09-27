export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ResponseJSON {
    method: HttpMethod;
    description: string;
    body: string;
}

export interface DocModel {
    url: string;
    fileName: string;
    name: string;
    group: string;
    examples: ResponseJSON[];
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface DocModel {
    url: string;
    fileName: string;
    name: string;
    group: string;
    description: string;
    body: string;
    method: HttpMethod;
}
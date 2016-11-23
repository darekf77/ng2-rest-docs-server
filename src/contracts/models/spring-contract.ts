import { HttpMethod, HttpStatus } from '../../http';

export interface SpringContract {
    method: HttpMethod,
    url: string;
    queryParams: any;
    requestBody: any;
    responseBody: any;
    status: HttpStatus;    
    headers: any;
}

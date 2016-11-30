import { HttpMethod, HttpCode } from '../../http';

export interface SpringContract {
    method: HttpMethod,
    url: string;
    queryParams: any;
    requestBody: any;
    responseBody: any;
    status: HttpCode;    
    headers: any;
}

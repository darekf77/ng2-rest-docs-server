// export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'JSONP';

// export type HttpCode = 200 | 400 | 404 | 500;

export interface FormInputBind {
    length: number;
    path: string;
    temp?: any;
};

export interface UrlParams {
    [urlModelName: string]: string | number | boolean | RegExp;
    regex?: RegExp;
}[];



export interface RequestData {
    headers: Object;
    bodySend: string;
    bodyRecieve: string;
    urlParams: string;
    url: string;
    status: number;
    method: string;
    urlFull: string;
};

export interface RequestMetaData {
    fileName: string;
    usecase: string;
    name: string;
    group: string;
    description: string;
};

export interface DocsServerSide {
    examples: DocModel[];
    baseURLDocsServer: string;
};

export interface DocModel extends RequestData, RequestMetaData, DocsServerSide {
    form: FormInputBind[];
    contract: string;
    contractPath: string;
};


export interface DocGroup {
    files: DocModel[];
    name: string;
};



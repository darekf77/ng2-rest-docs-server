import { FormInputBind, SpringContract } from './models';
import { DocModel } from '../docs';
import { HttpStatus } from '../http';

import {
    transformQueryPrams,
    bodyTransform,
    transformHeaders

} from './transform';

export function getContract(ex: DocModel): string {

    let c: SpringContract = <SpringContract>{};
    c.requestBody = bodyTransform(ex.bodySend, ex.form);
    c.responseBody = bodyTransform(ex.bodyRecieve);
    // c.headers = transformHeaders(ex.form);
    c.queryParams = transformQueryPrams(ex.urlParams);
    c.method = ex.method;
    c.status = 200;
    c.url = ex.url.replace(ex.baseURLDocsServer, '');
    let res = JSON.stringify(contractGenerator(c));
    console.log('------------------------------------------------')
    console.log(res);
    return res;
}


function contractGenerator(contract: SpringContract) {

    return `org.springframework.cloud.contract.spec.Contract.make {
        request {
            urlPath('${contract.url}') {
                ${contract.queryParams}                
            }
            method ${contract.method}
            ${contract.headers}
            ${contract.requestBody}
        }
        response {
            status ${contract.status}
            ${contract.responseBody}
        }
    }`;

}


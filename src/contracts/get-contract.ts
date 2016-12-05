import { FormInputBind, SpringContract } from './models';
import { DocModel } from '../docs';
import { HttpCode } from '../http';

import {
    transformQueryPrams,
    bodyTransform,
    transformHeaders

} from './transform';

export function getContract(ex: DocModel): string {

    let c: SpringContract = <SpringContract>{};
    c.requestBody = bodyTransform(ex.bodySend, ex.form);
    c.responseBody = bodyTransform(ex.bodyRecieve);
    c.headers = transformHeaders(ex.headers);
    // console.log('ex.headers', ex.headers);
    // console.log('c.headers', c.headers);
    c.queryParams = transformQueryPrams(ex.urlParams);
    c.method = ex.method;
    c.status = ex.status;
    c.url = ex.url.replace(ex.baseURLDocsServer, '');
    let res = contractGenerator(c);
    // console.log('------------------------------------------------')
    // console.log(res);
    return res;
}


function contractGenerator(contract: SpringContract) {

    let url = (contract.queryParams && contract.queryParams.trim() !== '') ? `urlPath('${contract.url}') {
                ${contract.queryParams}                
            }`: `url '${contract.url}'\n`

    return `
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        ${url}
        method ${contract.method}
        ${contract.requestBody}
    }
    response {
        status: '${contract.status}'
        ${contract.responseBody}
    }
    ${contract.headers}
}
    
    `;

}



import * as _ from 'lodash';

export class PathObject {

    static get(path, obj) {
        return _.get(obj, path);
    }


    static set(path: string, value: any, data: Object) {
        return _.set(data, path, value);
    }


    static parent(path: string) {
        let d = path.split('.');
        if (d.length === 1 && d[0] === path) return undefined;
        d.pop();
        let res = d.join('.');
        return res;
    }

    /**
     * field name
     * 
     * @static
     * @param {string} path
     * 
     * @memberOf PathObject
     */
    static fieldName(path: string) {
        let res = path.split('.');
        return res[res.length - 1];
    }

}
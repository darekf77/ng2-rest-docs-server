import chai = require('chai');
const expect = chai.expect;

import {
    PathObject
} from './path-object';

import { clean, change } from './transform-helper';

describe("Path Objecct", function () {

    it('shoud set property value by path (objects only) ', () => {
        let obj = {
            dd: {
                aa: {
                    c: 12
                }
            }
        }
        PathObject.set('dd.aa', 50, obj);
        expect(obj.dd.aa).to.eq(50);
    })


    it('shoud set property value by path (array case) ', () => {
        let obj = {
            dd: {
                aa: [
                    { c: 22 }
                ]
            }
        }
        PathObject.set('dd.aa[0].c', 12, obj);
        expect(obj.dd.aa[0]['c']).to.eq(12);
    })

    it('shoud get property value by path ', () => {
        let obj = {
            dd: {
                aa: {
                    c: 12
                }
            }
        }
        expect(PathObject.get('dd.aa.c', obj)).to.eq(12);
    })

    it('shoud get last field in path ', () => {
        expect(PathObject.parent('dd.aa.c')).to.eq('dd.aa');
    })



});


!function(e,r){for(var n in r)e[n]=r[n]}(exports,function(e){function r(t){if(n[t])return n[t].exports;var o=n[t]={exports:{},id:t,loaded:!1};return e[t].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var n={};return r.m=e,r.c=n,r.p="",r(0)}([function(e,r,n){"use strict";function t(e){void 0===e&&(e=""),v.Helpers.deleteFolderRecursive(S),c.mkdirSync(S),c.mkdirSync(b),c.mkdirSync(j),c.mkdirSync(E),c.mkdirSync(F),c.writeFileSync(O,e,"utf8"),v.Helpers.copyFolderRecursiveSync(m,S),P.length=0,q.length=0,console.log(y.yellow("Docs folder recreated ("+S+")"))}function o(e,n,o){void 0===e&&(e=3333),void 0===n&&(n="http://localhost:3000"),void 0===o&&(o=!1),n&&console.log(y.green("Base URL form angular2 app: "+n)),c.existsSync(S)&&!o||t();try{q=JSON.parse(c.readFileSync(x,"utf8").toString())}catch(e){q.length=0}var v=a();v.use(l()),v.use(d()),v.use(g.urlencoded({extended:!0})),v.use(g.json()),v.use("/",a.static(S)),v.get("/api/start",function(e,r){t(),console.log("started"),r.status(200).send()}),v.get("/api/start/:msg",function(e,r){t(e.params.msg),console.log("started, with message"),r.status(200).send()}),v.post("/api/downloadall",function(e,r){if(console.log("req.body",e.body),e.body&&e.body instanceof Array&&e.body.length>0){var n=new p,t=(new Date).getTime(),o=E+"/contracts-"+t;c.mkdirSync(o),e.body.forEach(function(e){console.log("file",e),c.writeFileSync(o+"/"+f.basename(e),c.readFileSync(e,"utf8"),"utf8")}),n.zipFolder(o,function(){n.writeToFile(o+".zip"),r.status(200).send("json/contracts/zip/contracts-"+t+".zip")})}else r.status(400)}),v.post("/api/save",function(e,t){var o=e.body;if(!o)return console.log(y.gray("no body in request")),void t.status(400).send();if(s(o,n),i(o))t.status(400).send();else{var a=b+"/"+r.filePrefix+q.length+".json";o.fileName=a,c.writeFileSync(a,JSON.stringify(o),"utf8"),q.push(o),P=h.genereateDocsGroups(q);var f=[];P.forEach(function(e){e.files.forEach(function(e){var r=0;e.examples.forEach(function(n){var t=j+"/"+e.name+"-"+u(n.usecase)+r++ +".groovy";n.contractPath=t,c.writeFileSync(t,n.contract,"utf8")})}),c.writeFileSync(R(e),JSON.stringify(e),"utf8"),f.push(e.name)}),c.writeFileSync(N,JSON.stringify(f),"utf8"),t.status(200).send(JSON.stringify(o))}}),v.listen(e,function(){console.log(y.green("Server is working on http://localhost:"+e))})}function i(e){var r=q.filter(function(r){return r.urlFull===e.urlFull&&r.method===e.method&&r.usecase===e.usecase&&r.bodyRecieve===e.bodyRecieve&&r.bodySend===e.bodySend&&r.group===e.group});return r.length>0}function s(e,r){e.url&&""!==e.url.trim()||(e.url="<< undefined url >>"),e.usecase&&""!==e.usecase.trim()||(e.usecase="<< undefined usecase >>"),e.description&&""!==e.description.trim()||(e.description="<< undefined description >>"),e.group&&""!==e.group.trim()||(e.group="<< undefined group >>"),e.name&&""!==e.name.trim()||(e.name="<< undefined name >>"),e.baseURLDocsServer&&""!==e.baseURLDocsServer.trim()||(e.baseURLDocsServer=r)}var a=n(1),c=n(2),u=n(3),f=n(4),l=n(5),p=n(6).EasyZip,d=n(7),g=n(8),y=n(9),h=n(10),v=n(24),m=__dirname+"/website/dist",S=process.cwd()+"/docs",b=S+"/json",x=b+"/requests.json",O=b+"/msg.txt",F=b+"/jira",j=b+"/contracts",E=b+"/contracts/zip",N=b+"/groups.json",R=function(e){var r=e.name.trim().replace(/\s/g,"").toUpperCase();return b+"/group-"+r+".json"};r.filePrefix="url";var P=[],q=[];r.run=o},function(e,r){e.exports=require("express")},function(e,r){e.exports=require("fs")},function(e,r){e.exports=require("md5")},function(e,r){e.exports=require("path")},function(e,r){e.exports=require("method-override")},function(e,r){e.exports=require("easy-zip")},function(e,r){e.exports=require("cors")},function(e,r){e.exports=require("body-parser")},function(e,r){e.exports=require("chalk")},function(e,r,n){"use strict";function t(e){for(var n in e)r.hasOwnProperty(n)||(r[n]=e[n])}t(n(11))},function(e,r,n){"use strict";function t(e){console.log("files",e);var r=o.groupFiles(e);return r.forEach(function(e){return e.files=i.mergeExamples(e.files)}),r.forEach(function(e){e.files.forEach(function(e){e.examples.forEach(function(e){e.contract=s.getContract(e)})})}),r}var o=n(12),i=n(13),s=n(14);r.genereateDocsGroups=t},function(e,r){"use strict";function n(e){var r=[];return e.forEach(function(n){void 0===n.group&&(n.group="-- undefined --"),console.log(n.group);var t=r.filter(function(e){return e.name===n.group});0===t.length&&r.push({name:n.group,files:JSON.parse(JSON.stringify(e.filter(function(e){return e.group===n.group})))})}),r}r.groupFiles=n},function(e,r){"use strict";function n(e){var r=[];return e.forEach(function(e){var n=r.filter(function(r){return r.url===e.url});if(0===n.length){var t=JSON.parse(JSON.stringify(e));t.examples=[],t.examples.push(JSON.parse(JSON.stringify(e))),r.push(t)}else console.log("aaa",n),n[0].examples.push(JSON.parse(JSON.stringify(e)))}),r}r.mergeExamples=n},function(e,r,n){"use strict";function t(e){for(var n in e)r.hasOwnProperty(n)||(r[n]=e[n])}t(n(15))},function(e,r,n){"use strict";function t(e){var r={};r.requestBody=i.bodyTransform(e.bodySend,e.form),r.responseBody=i.bodyTransform(e.bodyRecieve),r.headers=i.transformHeaders(e.headers),r.queryParams=i.transformQueryPrams(e.urlParams),r.method=e.method,r.status=e.status,r.url=e.url.replace(e.baseURLDocsServer,"");var n=o(r);return n}function o(e){var r=e.queryParams&&""!==e.queryParams.trim()?"urlPath('"+e.url+"') {\n                "+e.queryParams+"                \n            }":"url '"+e.url+"'\n";return"\npackage contracts\n\norg.springframework.cloud.contract.spec.Contract.make {\n    request {\n        "+r+"\n        method "+e.method+"\n        "+e.requestBody+"\n    }\n    response {\n        status: '"+e.status+"'\n        "+e.responseBody+"\n    }\n    "+e.headers+"\n}\n    \n    "}var i=n(16);r.getContract=t},function(e,r,n){"use strict";function t(e){for(var n in e)r.hasOwnProperty(n)||(r[n]=e[n])}t(n(17)),t(n(20)),t(n(23))},function(e,r,n){"use strict";function t(e){if(void 0===e)return"";var r=[];if("string"==typeof e)try{e=JSON.parse(e)}catch(e){return console.error("string withou object in transformQueryPrams"),""}if(e instanceof Array&&e.length>0){var n=e;n.forEach(function(e){for(var n in e)if("regex"!==n){var t=e[n];"object"==typeof t&&(t=JSON.stringify(t));var s=void 0!==e.regex?e.regex:o.regexForAllCharacters();r.push("\t\t\tparameter '"+n+"' : \n\t\t\tvalue("+i.CONSUMER+"(matching('"+s+"')),\n\t\t\tproducer('"+t+"')\n\t\t)\n");break}})}else for(var t in e){var s=e[t];"object"==typeof s&&(s=JSON.stringify(s)),r.push("\t\t\tparameter '"+t+"' : \n\t\t\tvalue("+i.CONSUMER+"(matching('"+o.regexForAllCharacters()+"')),\n\t\t\tproducer('"+s+"')\n\t\t)\n")}if(0===r.length)return"";if(1===r.length)return"queryParameters {\n"+r[0]+"}";if(2===r.length)return"queryParameters {\n"+r[0]+"\n"+r[1]+"}";var a=r.join("");return"queryParameters {\n"+a+"\n\t\t}"}var o=n(18),i=n(19);r.transformQueryPrams=t},function(e,r){"use strict";function n(e){return e.trim().replace(/\s/g,"")}function t(e){var r=e.trim().replace(/ /g,"$$$"),n=r.replace(/(\t|\n)/g,"");return console.log("RES",n),n.replace(/\$/g," ")}function o(e){return".{"+e+"}"}function i(){return".+"}r.clean=n,r.change=t,r.regexFromLength=o,r.regexForAllCharacters=i},function(e,r){"use strict";r.WITHOUT_FORM_LENGTH_INDICATOR=255,r.PRODUCER="producer",r.CONSUMER="consumer"},function(e,r,n){"use strict";function t(e,r){console.log("bindings",r);try{e=JSON.parse(e)}catch(e){return console.error("string withou object in bodyTransform"),""}if(e instanceof Array){var n=e;if(0===n.length)return"[[ ]]";e=n[0]}r&&r.length>0&&r.forEach(function(r){r.temp=c.PathObject.get(r.path,e)}),a(e),r&&r.length>0&&r.forEach(function(r){if(null!==r.length){var n=r.path,t=r.temp,o=t?f.CONSUMER+"('"+t+"'),":"",i="\t\t\t\t"+c.PathObject.fieldName(n)+":  \n                    \t\t\t$(\n                        \t\t\t\t"+o+" "+f.PRODUCER+"(regex('"+u.regexFromLength(r.length)+"')) \n                    \t\t\t)\n";c.PathObject.set(n,i,e)}}),s(e);var t=[];for(var o in e)t.push(e[o]);return"body(\n\t\t"+t.join()+"\n\t\t)\n"}function o(e){for(var r in e)if(e[r]instanceof Object)return!0;return!1}function i(e){var r=[];for(var n in e){var t=e[n];r.push(t)}if(0===r.length)return"[]";if(1===r.length)return r[0];if(2===r.length)return r[0]+",\n"+r[1];var o=r.join(",");return o}function s(e){for(var r in e){var n=e[r];if(n instanceof Array){var t=n;if(t.length>0){var a=t[0];o(a)?s(a):e[r]=r+": [[\n\n                    \t\t"+i(a)+"\n\n                ]]\n"}else e[r]=r+": [[]]"}else n instanceof Object&&(o(n)?s(n):e[r]=r+": []")}}function a(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){return void console.log("canno prepareSimpleTypes ")}for(var r in e){var n=e[r];if(n instanceof Array){var t=n;t.length>0&&(e[r]=t.slice(0,1),a(e[r][0]))}else n instanceof Object?a(n):e[r]="\n\t\t"+r+": $(\n                \t"+f.CONSUMER+"('"+e[r]+"'),\n                \t"+f.PRODUCER+"(regex('"+u.regexForAllCharacters()+"'))\n            \t) "}return e}var c=n(21),u=n(18),f=n(19);r.bodyTransform=t,r.checkIfContainsArrayOrObjecct=o,r.bodySimpelObjet=i,r.prepareArraysAndObjects=s,r.prepareSimpleTypes=a},function(e,r,n){"use strict";var t=n(22),o=function(){function e(){}return e.get=function(e,r){return t.get(r,e)},e.set=function(e,r,n){return t.set(n,e,r)},e.parent=function(e){var r=e.split(".");if(1!==r.length||r[0]!==e){r.pop();var n=r.join(".");return n}},e.fieldName=function(e){var r=e.split(".");return r[r.length-1]},e}();r.PathObject=o},function(e,r){e.exports=require("lodash")},function(e,r){"use strict";function n(e){if(!e)return"";var r=[];for(var n in e){var t=e[n];r.push("\t\theader '"+n+"' : '"+t+"'")}if(0===r.length)return"";if(1===r.length)return"headers {\n"+r[0]+"}";if(2===r.length)return"headers {\n"+r[0]+",\n"+r[1]+"\n\t\t}";var o=r.join(",\n");return"headers {\n"+o+"\n\t\t}"}r.transformHeaders=n},function(e,r,n){"use strict";var t=n(2),o=n(4),i=function(){function e(){}return e.deleteFolderRecursive=function(r){t.existsSync(r)&&(t.readdirSync(r).forEach(function(n,o){var i=r+"/"+n;t.lstatSync(i).isDirectory()?e.deleteFolderRecursive(i):t.unlinkSync(i)}),t.rmdirSync(r))},e.copyFileSync=function(e,r){var n=r;t.existsSync(r)&&t.lstatSync(r).isDirectory()&&(n=o.join(r,o.basename(e))),t.writeFileSync(n,t.readFileSync(e))},e.copyFolderRecursiveSync=function(r,n){var i=[],s=n;t.existsSync(s)||t.mkdirSync(s),t.lstatSync(r).isDirectory()&&(i=t.readdirSync(r),i.forEach(function(n){var i=o.join(r,n);t.lstatSync(i).isDirectory()?e.copyFolderRecursiveSync(i,s):e.copyFileSync(i,s)}))},e}();r.Helpers=i}]));
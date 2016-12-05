import express = require('express');
import fs = require('fs');
import md5 = require('md5');
import path = require('path');
import methodOverride = require('method-override');
const EasyZip = require('easy-zip').EasyZip;

const cors = require('cors');
const bodyParser = require('body-parser')
const chalk = require('chalk');
import http = require('http')

import { DocModel, DocGroup, genereateDocsGroups } from './docs';
import { getJSON } from './http';
import { JiraAuth, JiraTask } from './jira';
import { Helpers } from './helpers';

const websitePath = `${__dirname}/website/dist`;

const docsPath: string = `${process.cwd()}/docs`;
const jsonsPath = `${docsPath}/json`;

const requestListPath = `${jsonsPath}/requests.json`;

const msgPath = `${jsonsPath}/msg.txt`;
const jiraPath = `${jsonsPath}/jira`;
const jiraConfigPath = `${jsonsPath}/jira/config.json`;

const contractsPath = `${jsonsPath}/contracts`;
const contractsZipPath = `${jsonsPath}/contracts/zip`;


const groupListPath = `${jsonsPath}/groups.json`;
let groupPath = (group: DocGroup) => {
    let groupFileName = group.name
        .trim()
        .replace(/\s/g, '')
        .toUpperCase();
    return `${jsonsPath}/group-${groupFileName}.json`;
}

export function getToken(auth): string {
    return btoa(`${auth.username}:${auth.password}`);
}

export const filePrefix = 'url';
let localGroup: DocGroup[] = [];
let localRequests: DocModel[] = [];




function recreate(msg: string = '') {
    Helpers.deleteFolderRecursive(docsPath);
    fs.mkdirSync(docsPath);
    fs.mkdirSync(jsonsPath);
    fs.mkdirSync(contractsPath);
    fs.mkdirSync(contractsZipPath);
    fs.mkdirSync(jiraPath);
    let tt = {
        url: 'http://jira.eniro.com',
        token: 'ZGFmaTUxOkphYmxvbmthMTc=',
        models: []
    };
    fs.writeFileSync(jiraConfigPath, JSON.stringify(tt), 'utf8');
    fs.writeFileSync(msgPath, msg, 'utf8');
    Helpers.copyFolderRecursiveSync(websitePath, docsPath);
    localGroup.length = 0;
    localRequests.length = 0;
    console.log(chalk.yellow(`Docs folder recreated (${docsPath})`));
}

export function run(port: number = 3333,
    mainURL: string = 'http://localhost:3000',
    clean: boolean = false,
    jiraUrl: string = undefined,
    jiraAuth: JiraAuth = undefined
) {

    if (mainURL) {
        console.log(chalk.green(`Base URL form angular2 app: ${mainURL}`));
    }

    if (!fs.existsSync(docsPath) || clean) recreate();

    try {
        localRequests = JSON.parse(fs.readFileSync(requestListPath, 'utf8').toString());
    } catch (error) {
        localRequests.length = 0;
    }


    let app = express();
    app.use(methodOverride());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());


    app.use('/', express.static(docsPath));

    app.get('/api/start', (req, res) => {
        recreate();
        console.log('started');
        res.status(200).send();
    })

    app.get('/api/start/:msg', (req, res) => {
        recreate(req.params['msg']);
        console.log('started, with message');
        res.status(200).send();
    })

    app.get('/api/cross/get/:website/:path', (req, res) => {

        let websiteUrl = decodeURIComponent(req.params['website']);
        let websitePath = decodeURIComponent(req.params['path']);
        console.log('websiteUrl', websiteUrl);
        console.log('websitePath', websitePath);
        let authorizaiton = req.headers['authorization'];
        console.log('authorizaiton', authorizaiton);
        // console.log('websiteHeaders', JSON.stringify(req.headers));
        var options = {

            hostname: websiteUrl,
            path: websitePath,
            method: 'GET',
            port: 443,
            headers: {
                "Content-Type": "application/json",
                Authorization: req.headers['authorization']
            }
        };

        getJSON(options, function (statusCode, result) {
            // I could work with the result html/json here.  I could also just return it
            console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
            res.statusCode = statusCode;
            res.send(result);
        })


    })

    app.post('/api/config', (req, res) => {
        let token = getToken(jiraAuth);
        if (res.get('Authorization') === `Basic ${token}`) {
            let data = fs.readFileSync(jiraConfigPath, 'utf8');
            res.send(200, JSON.stringify(data))
        } else {
            res.status(400).send();
        }

    })

    app.post('/api/downloadall', (req, res) => {
        console.log('req.body', req.body);
        if (req.body && req.body instanceof Array && req.body.length > 0) {
            let zip = new EasyZip();
            let time = (new Date()).getTime();
            let p = `${contractsZipPath}/contracts-${time}`;
            fs.mkdirSync(p);
            req.body.forEach((f: string) => {
                console.log('file', f);
                fs.writeFileSync(`${p}/${path.basename(f)}`, fs.readFileSync(f, 'utf8'), 'utf8');
            });
            zip.zipFolder(p, () => {
                zip.writeToFile(`${p}.zip`);
                res.status(200).send(`json/contracts/zip/contracts-${time}.zip`);
            });

        } else {
            res.status(400);
        }
    })

    app.post('/api/save', (req, res) => {

        let body: DocModel = req.body;

        if (!body) {
            console.log(chalk.gray('no body in request'));
            res.status(400).send();
            return;
        }

        prepare(body, mainURL);

        if (existInLocalRequests(body)) {
            res.status(400).send();
        } else {

            // requests            
            let filename = `${jsonsPath}/${filePrefix}${localRequests.length}.json`;
            body.fileName = filename;
            fs.writeFileSync(filename, JSON.stringify(body), 'utf8');
            localRequests.push(body);

            // groups
            // TODO optymalization to only read selected group
            localGroup = genereateDocsGroups(localRequests);


            let names = [];
            localGroup.forEach(g => {
                g.files.forEach(f => {
                    let counter = 0;
                    f.examples.forEach(c => {
                        let p = `${contractsPath}/${f.name}-${md5(c.usecase)}${counter++}.groovy`;
                        c.contractPath = p;
                        fs.writeFileSync(p, c.contract, 'utf8');
                    });
                })
                fs.writeFileSync(groupPath(g), JSON.stringify(g), 'utf8');
                names.push(g.name);
            });
            fs.writeFileSync(groupListPath, JSON.stringify(names), 'utf8');

            res.status(200).send(JSON.stringify(body));
        }

    });


    app.listen(port, () => {
        console.log(chalk.green(`Server is working on http://localhost:${port}`));
    });
}

function existInLocalRequests(body: DocModel) {
    let filterd = localRequests.filter(r => {
        return (
            r.urlFull === body.urlFull &&
            r.method === body.method &&
            r.usecase === body.usecase &&
            r.bodyRecieve === body.bodyRecieve &&
            r.bodySend === body.bodySend &&
            r.group === body.group
        )
    })
    return filterd.length > 0;
}


function prepare(body: DocModel, baseUrl: string) {


    if (!body.url || body.url.trim() === '') {
        body.url = '<< undefined url >>';
    }

    if (!body.usecase || body.usecase.trim() === '') {
        body.usecase = '<< undefined usecase >>';
    }

    if (!body.description || body.description.trim() === '') {
        body.description = '<< undefined description >>';
    }

    if (!body.group || body.group.trim() === '') {
        body.group = '<< undefined group >>';
    }

    if (!body.name || body.name.trim() === '') {
        body.name = '<< undefined name >>';
    }

    if (!body.baseURLDocsServer || body.baseURLDocsServer.trim() === '') {
        body.baseURLDocsServer = baseUrl;
    }

    // if (body.bodyRecieve && typeof body.bodyRecieve === 'string') {
    //     try {
    //         body.bodyRecieve = JSON.parse(body.bodyRecieve)
    //     } catch (error) {
    //         console.log('bad body.bodyRecieve');
    //     }
    // }

    // if (body.bodySend && typeof body.bodySend === 'string') {
    //     try {
    //         body.bodySend = JSON.parse(body.bodySend)
    //     } catch (error) {
    //         console.log('bad body.bodyRecieve');
    //     }
    // }


}
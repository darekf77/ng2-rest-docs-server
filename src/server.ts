import express = require('express');
import fs = require('fs');
import md5 = require('md5');
import path = require('path');
import methodOverride = require('method-override');

const cors = require('cors');
const bodyParser = require('body-parser')
const chalk = require('chalk');

import { DocModel, DocGroup, genereateDocsGroups } from './docs';
import { Helpers } from './helpers';

const websitePath = `${__dirname}/../website/dist`;

const docsPath: string = `${process.cwd()}/docs`;
const jsonsPath = `${docsPath}/json`;

const requestListPath = `${jsonsPath}/requests.json`;

const msgPath = `${jsonsPath}/msg.txt`;

const contractsPath = `${jsonsPath}/contracts`;


const groupListPath = `${jsonsPath}/groups.json`;
let groupPath = (group: DocGroup) => {
    let groupFileName = group.name
        .trim()
        .replace(/\s/g, '')
        .toUpperCase();
    return `${jsonsPath}/group-${groupFileName}.json`;
}



export const filePrefix = 'url';
let localGroup: DocGroup[] = [];
let localRequests: DocModel[] = [];



function recreate(msg: string = '') {
    Helpers.deleteFolderRecursive(docsPath);
    fs.mkdirSync(docsPath);
    fs.mkdirSync(jsonsPath);
    fs.mkdirSync(contractsPath);
    fs.writeFileSync(msgPath, msg, 'utf8');
    Helpers.copyFolderRecursiveSync(websitePath, docsPath);
    localGroup.length = 0;
    localRequests.length = 0;
}

export function run(port: number = 3333, mainURL: string = 'http://localhost:3000') {

    if (mainURL) {
        console.log(chalk.green(`Base URL form angular2 app: ${mainURL}`));
    }

    if (!fs.existsSync(docsPath)) recreate();

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
                    f.contracts.forEach(c => {
                        fs.writeFileSync(`${contractsPath}/${f.name}-${md5(c)}${counter++}.groovy`, c, 'utf8');
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
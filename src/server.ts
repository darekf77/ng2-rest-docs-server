
import express = require('express');
import fs = require('fs');
import path = require('path');
import methodOverride = require('method-override');
const cors = require('cors');

import { DocModel } from './docs';

var bodyParser = require('body-parser')

const docsPath: string = `${process.cwd()}/docs`;
const jsonsPath = `${docsPath}/json`;
const configPath = `${jsonsPath}/config.json`;

var chalk = require('chalk');

export const filePrefix = 'url';
let localFiles: DocModel[] = [];


function recreate() {
    deleteFolderRecursive(docsPath);
    fs.mkdirSync(docsPath);
    fs.mkdirSync(jsonsPath);
    copyFolderRecursiveSync(`${__dirname}/../website/dist`, docsPath);
    localFiles.length = 0;
}

export function run(port: number = 3333, mainURL: string = 'http://localhost:3000') {

    if (mainURL) {
        console.log(chalk.green(`Base URL form angular2 app: ${mainURL}`));
    }
    // console.log('process.cwd',process.cwd())
    // console.log('__dirname',__dirname)
    // console.log('process.argv[1]',process.argv[1])
    // console.log('docsPath', docsPath)
    // console.log('jsonsPath', jsonsPath)
    // console.log('configPath', configPath)
    recreate();

    let app = express();
    app.use(methodOverride());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());


    app.use('/', express.static(docsPath));

    app.get('/api/start', (req, res) => {
        recreate();
        console.log('started');
        localFiles.length = 0;
        res.status(200).send();

    })

    app.post('/api/save', (req, res) => {

        // console.log('save', JSON.stringify(req.body))
        let body: DocModel = req.body;
        if (!body) {
            console.log(chalk.gray('no body in request'));
            res.status(400).send();
            return;
        }

        if (!body.url || body.url.trim() === '') {
            body.url = '<< undefined url >>';
        }

        // console.log('body.usecase', body.usecase);
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

        if (!body.baseURL || body.baseURL.trim() === '') {
            body.baseURL = mainURL;
        }


        let filename = `${jsonsPath}/${filePrefix}${localFiles.length}.json`
        localFiles.push(body);

        console.log('filename', filename);

        fs.writeFileSync(filename, JSON.stringify(body), 'utf8');

        body.fileName = filename;

        fs.writeFileSync(configPath, JSON.stringify(localFiles), 'utf8');
        res.status(200).send(JSON.stringify(body));

    })


    app.listen(port, () => {
        console.log(chalk.green(`server listending on port: ${port}`));
    });
}



function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function deleteFiles(callback: () => void) {
    if (localFiles.length === 0) {
        callback();
        return;
    }
    let f: DocModel = localFiles.shift();
    fs.unlink(f.fileName, (err) => {
        if (err) {
            console.log(err);
        }
        if (localFiles.length === 0) {
            callback();
            return;
        }
        deleteFiles(callback)
    })
}


function copyFileSync(source, target) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = target;// path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

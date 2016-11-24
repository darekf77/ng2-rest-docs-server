"use strict";
var express = require('express');
var fs = require('fs');
var md5 = require('md5');
var methodOverride = require('method-override');
var cors = require('cors');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var docs_1 = require('./docs');
var helpers_1 = require('./helpers');
var websitePath = __dirname + "/../website/dist";
var docsPath = process.cwd() + "/docs";
var jsonsPath = docsPath + "/json";
var requestListPath = jsonsPath + "/requests.json";
var msgPath = jsonsPath + "/msg.txt";
var contractsPath = jsonsPath + "/contracts";
var groupListPath = jsonsPath + "/groups.json";
var groupPath = function (group) {
    var groupFileName = group.name
        .trim()
        .replace(/\s/g, '')
        .toUpperCase();
    return jsonsPath + "/group-" + groupFileName + ".json";
};
exports.filePrefix = 'url';
var localGroup = [];
var localRequests = [];
function recreate(msg) {
    if (msg === void 0) { msg = ''; }
    helpers_1.Helpers.deleteFolderRecursive(docsPath);
    fs.mkdirSync(docsPath);
    fs.mkdirSync(jsonsPath);
    fs.mkdirSync(contractsPath);
    fs.writeFileSync(msgPath, msg, 'utf8');
    helpers_1.Helpers.copyFolderRecursiveSync(websitePath, docsPath);
    localGroup.length = 0;
    localRequests.length = 0;
}
function run(port, mainURL) {
    if (port === void 0) { port = 3333; }
    if (mainURL === void 0) { mainURL = 'http://localhost:3000'; }
    if (mainURL) {
        console.log(chalk.green("Base URL form angular2 app: " + mainURL));
    }
    if (!fs.existsSync(docsPath))
        recreate();
    try {
        localRequests = JSON.parse(fs.readFileSync(requestListPath, 'utf8').toString());
    }
    catch (error) {
        localRequests.length = 0;
    }
    var app = express();
    app.use(methodOverride());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use('/', express.static(docsPath));
    app.get('/api/start', function (req, res) {
        recreate();
        console.log('started');
        res.status(200).send();
    });
    app.get('/api/start/:msg', function (req, res) {
        recreate(req.params['msg']);
        console.log('started, with message');
        res.status(200).send();
    });
    app.post('/api/save', function (req, res) {
        var body = req.body;
        if (!body) {
            console.log(chalk.gray('no body in request'));
            res.status(400).send();
            return;
        }
        prepare(body, mainURL);
        if (existInLocalRequests(body)) {
            res.status(400).send();
        }
        else {
            // requests            
            var filename = jsonsPath + "/" + exports.filePrefix + localRequests.length + ".json";
            body.fileName = filename;
            fs.writeFileSync(filename, JSON.stringify(body), 'utf8');
            localRequests.push(body);
            // groups
            // TODO optymalization to only read selected group
            localGroup = docs_1.genereateDocsGroups(localRequests);
            var names_1 = [];
            localGroup.forEach(function (g) {
                g.files.forEach(function (f) {
                    var counter = 0;
                    f.contracts.forEach(function (c) {
                        fs.writeFileSync(contractsPath + "/" + f.name + "-" + md5(c) + counter++ + ".groovy", c, 'utf8');
                    });
                });
                fs.writeFileSync(groupPath(g), JSON.stringify(g), 'utf8');
                names_1.push(g.name);
            });
            fs.writeFileSync(groupListPath, JSON.stringify(names_1), 'utf8');
            res.status(200).send(JSON.stringify(body));
        }
    });
    app.listen(port, function () {
        console.log(chalk.green("Server is working on http://localhost:" + port));
    });
}
exports.run = run;
function existInLocalRequests(body) {
    var filterd = localRequests.filter(function (r) {
        return (r.urlFull === body.urlFull &&
            r.method === body.method &&
            r.usecase === body.usecase &&
            r.bodyRecieve === body.bodyRecieve &&
            r.bodySend === body.bodySend &&
            r.group === body.group);
    });
    return filterd.length > 0;
}
function prepare(body, baseUrl) {
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
//# sourceMappingURL=server.js.map
"use strict";
var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var docsPath = process.cwd() + "/docs/";
var jsonsPath = docsPath + "json/";
var configPath = jsonsPath + "config.json";
exports.filePrefix = 'url';
var localFiles = [];
function recreate() {
    if (fs.existsSync(docsPath)) {
        console.log('path exist delete ' + docsPath);
        deleteFolderRecursive(docsPath);
        fs.mkdirSync(docsPath);
        fs.mkdirSync(jsonsPath);
        copyFolderRecursiveSync(__dirname + "/../website/dist", docsPath);
    }
    localFiles.length = 0;
}
function run(port) {
    if (port === void 0) { port = 3333; }
    // console.log('process.cwd',process.cwd())
    // console.log('__dirname',__dirname)
    // console.log('process.argv[1]',process.argv[1])
    // console.log('docsPath', docsPath)
    // console.log('jsonsPath', jsonsPath)
    // console.log('configPath', configPath)
    recreate();
    var app = express();
    app.use(bodyParser.json());
    app.use('/public', express.static(docsPath));
    app.get('/start', function (req, res) {
        recreate();
        console.log('started');
        localFiles.length = 0;
        res.status(200).send();
    });
    app.post('/save', function (req, res) {
        console.log('save');
        var body = req.body;
        if (!body) {
            console.log('no body in request');
            res.status(400).send();
            return;
        }
        var filename = "" + jsonsPath + exports.filePrefix + localFiles.length + ".json";
        localFiles.push(body);
        console.log('filename', filename);
        fs.writeFileSync(filename, JSON.stringify(body), 'utf8');
        body.fileName = filename;
        fs.writeFileSync(configPath, JSON.stringify(localFiles), 'utf8');
        res.status(200).send(JSON.stringify(body));
    });
    app.listen(port, function () {
        console.log("server listending on port: " + port);
    });
}
exports.run = run;
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
;
function deleteFiles(callback) {
    if (localFiles.length === 0) {
        callback();
        return;
    }
    var f = localFiles.shift();
    fs.unlink(f.fileName, function (err) {
        if (err) {
            console.log(err);
        }
        if (localFiles.length === 0) {
            callback();
            return;
        }
        deleteFiles(callback);
    });
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
    var targetFolder = target; // path.join(target, path.basename(source));
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
            }
            else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}
//# sourceMappingURL=server.js.map
"use strict";
var fs = require('fs');
var path = require('path');
var Helpers = (function () {
    function Helpers() {
    }
    Helpers.deleteFolderRecursive = function (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    Helpers.deleteFolderRecursive(curPath);
                }
                else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
    ;
    Helpers.copyFileSync = function (source, target) {
        var targetFile = target;
        //if target is a directory a new file with the same name will be created
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    };
    Helpers.copyFolderRecursiveSync = function (source, target) {
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
                    Helpers.copyFolderRecursiveSync(curSource, targetFolder);
                }
                else {
                    Helpers.copyFileSync(curSource, targetFolder);
                }
            });
        }
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map
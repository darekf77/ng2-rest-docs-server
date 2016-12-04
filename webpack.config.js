var webpack = require('webpack'),
    path = require('path'),
    fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './src/server.ts',
    target: 'node',
    output: {
        // path: __dirname + '/bin',
        libraryTarget: "commonjs",
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loaders: ['ts-loader'] },
            { test: /\.json$/, loaders: ['json-loader'] }
        ]
    },
    externals: nodeModules,
    node: {
        fs: "empty",
        __dirname: false,
        __filename: false
    }
}


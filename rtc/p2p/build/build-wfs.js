'use strict';

var path = require('path');
let externals = _externals();
module.exports = {
    entry: './wfs-ws.js',
    // externals: externals,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'wfs/'),
        filename: 'wfs-ws.js'
    },
    node: {
        __dirname: true
    },
    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: [['@babel/preset-env', {
                    //         "targets": {
                    //             "node": true
                    //         }
                    //     }]]
                    // }
                },
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    }
};

function _externals() {
    let manifest = require('../package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}
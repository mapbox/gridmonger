#!/usr/bin/env node
var gridmonger = require('./index');

var argv = require('minimist')(process.argv, {
    string: ['input', 'zxy'],
    boolean: ['help'],
});

if (argv.help) {
    console.log("index.js --input [INPUT FILE] --zxy 'z/x/y' ");
    console.log('----------');
    console.log('Takes an input utf8grid json file and output geojson to stdout');
    process.exit(1);
}

if (!argv.input) throw new Error('--input arg required');
if (!argv.zxy || argv.zxy.split('/').length !== 3) throw new Error('--zxy arg required');
var zxy = argv.zxy.split('/');
var input = require(argv.input);

var geojson = gridmonger(input, zxy);

console.log(JSON.stringify(geojson));

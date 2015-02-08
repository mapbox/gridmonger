#!/usr/bin/env node

var merge = require('turf-merge');
var sm = new (require('sphericalmercator'))({
    size: 64
});

var argv = require('minimist')(process.argv, {
    string: ['input', 'zxy'],
    boolean: ['help'],
});

if (argv.help) {
    console.log("index.js --input [INPUT FILE] --zxy 'z/x/y' ");
    console.log('----------');
    console.log('Takes an input utf8grid json file and output geojson to stdout');
    process.exit(0);
}

if (!argv.input) throw new Error('--input arg required');
if (!argv.zxy || argv.zxy.split('/').length !== 3) throw new Error('--zxy arg required');

var zxy = argv.zxy.split('/');
var input = require(argv.input);

var objHash = {};
input.keys.forEach(function(key) {
    objHash[key] = [];
});

var xy = [ zxy[1] * 64, zxy[2] * 64 ]

input.grid.forEach(function(gridLine, row) {
    var gridLine = gridLine.split('');
    gridLine.forEach(function(element, col) {
        var json = toGeoJSON(xy[0] + col, xy[1] + row, zxy[0])
        if (element !== " ") {
            objHash[input.keys[element.charCodeAt(0)-33]].push(json);
        }
    });
});

delete objHash[""]

var output = {
    type: "FeatureCollection",
    features: []
}

Object.keys(objHash).forEach(function(key) {
    if (objHash[key].length) {
        objHash[key] = merge({
            type: "FeatureCollection",
            features: objHash[key]
        });
        objHash[key].properties = input.data[key];
        output.features.push(objHash[key]);
    }
});

console.log(JSON.stringify(output));

function toGeoJSON(x, y, z) {
    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [[
                sm.ll([x,y], z),
                sm.ll([x+1,y],z),
                sm.ll([x+1,y+1], z),
                sm.ll([x,y+1], z),
                sm.ll([x,y], z)
            ]]
        }
    }
}

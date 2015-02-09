#!/usr/bin/env node

var merge = require('turf-merge');
var sm = new (require('sphericalmercator'))({
    size: 64
});

/**
 * Convert UTF8 Grid to GeoJSON
 *
 * @param input {Object} UTF8 Grid Object
 * @param zxy {Array} tile location array
 * @returns {Object} GeoJSON Result
 */
module.exports = function(input, zxy) {
    var objHash = {};
    input.keys.forEach(function(key) {
        objHash[key] = [];
    });

    var xy = [ zxy[1] * 64, zxy[2] * 64 ];

    input.grid.forEach(function(gridLine, row) {
        gridLine = gridLine.split('');
        gridLine.forEach(function(element, col) {
            var json = toGeoJSON(xy[0] + col, xy[1] + row, zxy[0]);
            if (element !== " " && objHash[input.keys[element.charCodeAt(0)-33]]) {
                objHash[input.keys[element.charCodeAt(0)-33]].push(json);
            }
        });
    });
    delete objHash[""];

    var output = {
        type: "FeatureCollection",
        features: []
    };

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

    return output;
};

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
    };
}

module.exports.toGeoJSON = toGeoJSON;

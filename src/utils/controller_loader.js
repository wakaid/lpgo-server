'use strict';

var assert = require('assert-plus');
var fs = require('fs');

function ControllerLoader() {}

ControllerLoader.loadToAppFromPath = function(app, controllerPath) {
    assert.string(controllerPath);

    fs.readdirSync(controllerPath).forEach(function(objectName) {
        var objectPath = controllerPath + '/' + objectName;
        var objectStats = fs.lstatSync(objectPath);

        if (ControllerLoader._isSystemObject(objectName)) {
            return;
        }

        if (objectStats.isFile()) {
            require(objectPath)(app);
        } else if (objectStats.isDirectory()) {
            ControllerLoader.loadToAppFromPath(app, objectPath);
        }
    });
};

ControllerLoader._isSystemObject = function(objectName) {
    return objectName.indexOf('.') === 0;
};

module.exports = ControllerLoader;

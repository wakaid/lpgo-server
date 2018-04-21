'use strict';

var assert = require('assert-plus');

module.exports = function(errorCodeMap) {
    assert.object(errorCodeMap);

    return function(req, res, next) {
        req.errorCodeMap = errorCodeMap;

        next();
    };
};

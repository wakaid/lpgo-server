'use strict';

var assert = require('assert-plus');
var mongoose = require('mongoose');

class MongooseConnectionBuilder {
    static build(mongoConfig) {
        assert.object(mongoConfig);
        assert.string(mongoConfig.uri);

        const conn = mongoose.createConnection(mongoConfig.uri);

        return conn;
    }
}

module.exports = MongooseConnectionBuilder;

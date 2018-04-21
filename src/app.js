'use strict';

const express = require('express');
const expressValidation = require('express-validation');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MongooseConnectionBuilder = require('./utils/mongoose_connection_builder');
const ControllerLoader = require('./utils/controller_loader');
const ResponseHandler = require('./utils/response_handler');
const BuildResponse = require('./utils/build_response');

const mongoConfig = require('../config/mongo');

mongoose.Promise = Promise;

(async () => {
    try {
        const mongoConnection = MongooseConnectionBuilder.build(mongoConfig);

        const app = express();

        app.mongoConnection = mongoConnection;

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '20mb' }));

        ControllerLoader.loadToAppFromPath(
            app,
            require('path').join(__dirname, 'controllers')
        );

        app.use(ResponseHandler(expressValidation));
        app.use(BuildResponse);

        app.listen(process.env.PORT || 8000);
    } catch (e) {
        console.log('Server crashed or failed to start\n', e);
        process.exit(1);
    }
})();

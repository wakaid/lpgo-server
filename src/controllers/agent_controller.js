'use strict';

const Joi = require('joi');
const expressValidation = require('express-validation');
const handleRequest = require('../utils/handle_request_async');
// const authenticate = require('../middlewares/authenticate_access_token');

const AgentDAO = require('../daos/agent_dao');

module.exports = app => {
    const agentDAO = new AgentDAO(app.mongoConnection);

    app.post(
        '/agents',
        expressValidation({
            body: {
                name: Joi.string().required(),
                city: Joi.string().required(),
                address: Joi.string().required()
            }
        }),
        handleRequest(async req => {
            const data = {
                name: req.body.name,
                city: req.body.city,
                address: req.body.address
            };

            return await agentDAO.createAgent(data);
        })
    );
};

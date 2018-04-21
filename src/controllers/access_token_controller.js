'use strict';

const Joi = require('joi');
const expressValidation = require('express-validation');
const handleRequest = require('../utils/handle_request_async');

const AccessTokenDAO = require('../daos/access_token_dao');

module.exports = app => {
    const accessTokenDAO = new AccessTokenDAO(app.mongoConnection);

    app.get(
        '/agents/:agent_id/tokens',
        expressValidation({
            params: {
                agent_id: Joi.string().required()
            }
        }),
        handleRequest(async req => {
            console.log(req.params.agent_id);
            return await accessTokenDAO.createAccessToken(req.params.agent_id);
        })
    );

    app.get(
        '/agents/:agent_id/refresh_tokens',
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

            return await accessTokenDAO.createAgent(data);
        })
    );
};

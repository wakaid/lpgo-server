'use strict';

const Joi = require('joi');
const expressValidation = require('express-validation');
const handleRequest = require('../utils/handle_request_async');

const LPGDAO = require('../daos/lpg_dao');
const lpgTypes = require('../daos/lpg_dao/enums/lpg_types');

module.exports = app => {
    const lpgDAO = new LPGDAO(app.mongoConnection);

    app.get(
        '/lpgs',
        handleRequest(async () => {
            return await lpgDAO.getLpgs();
        })
    );

    app.post(
        '/lpgs',
        expressValidation({
            body: {
                type: Joi.string()
                    .valid(lpgTypes)
                    .required(),
                price: Joi.number().required()
            }
        }),
        handleRequest(async req => {
            return await lpgDAO.createLpg(req.body.type, req.body.price);
        })
    );

    app.post(
        '/agents/:agent_id/lpgs/:id/track!',
        expressValidation({
            params: {
                agent_id: Joi.string().required(),
                id: Joi.string().required()
            }
        }),
        handleRequest(async req => {
            return await lpgDAO.trackLpg(req.params.id, req.params.agent_id);
        })
    );

    app.get(
        '/agents/:agent_id/lpgs',
        expressValidation({
            params: { agent_id: Joi.string().required() }
        }),
        handleRequest(async req => {
            return await lpgDAO.getLpgsDetailForAgent(req.params.agent_id);
        })
    );
};

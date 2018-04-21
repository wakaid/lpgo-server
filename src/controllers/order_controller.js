'use strict';

const Joi = require('joi');
const expressValidation = require('express-validation');
const handleRequest = require('../utils/handle_request_async');
// const authenticate = require('../middlewares/authenticate_access_token');

const OrderDAO = require('../daos/order_dao');

module.exports = app => {
    const orderDAO = new OrderDAO(app.mongoConnection);

    app.post(
        '/agents/:agent_id/orders',
        expressValidation({
            params: { agent_id: Joi.string().required() },
            body: {
                lpg_id: Joi.string().required(),
                quantity: Joi.number().required(),
                total_price: Joi.number().required()
            }
        }),
        handleRequest(async req => {
            const data = {
                agent_id: req.params.agent_id,
                lpg_id: req.body.lpg_id,
                quantity: req.body.quantity,
                total_price: req.body.total_price
            };

            return await orderDAO.createOrder(data);
        })
    );

    app.post(
        '/agents/:agent_id/orders/:order_id/pay!',
        expressValidation({
            params: {
                agent_id: Joi.string().required(),
                order_id: Joi.string().required()
            }
        }),
        handleRequest(async req => {
            return await orderDAO.payOrder(
                req.params.order_id,
                req.params.agent_id
            );
        })
    );

    app.post(
        '/orders/:order_id/process!',
        expressValidation({
            params: { order_id: Joi.string().required() }
        }),
        handleRequest(async req => {
            return await orderDAO.notifyOrderProcessed(req.params.order_id);
        })
    );

    app.post(
        '/orders/:order_id/complete!',
        expressValidation({
            params: { order_id: Joi.string().required() }
        }),
        handleRequest(async req => {
            return await orderDAO.notifyOrderCompleted(req.params.order_id);
        })
    );

    app.get(
        '/orders',
        expressValidation({
            query: { status: Joi.string().required() }
        }),
        handleRequest(async req => {
            return await orderDAO.getOrderByStatus(req.query.status);
        })
    );
};

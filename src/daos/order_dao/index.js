'use strict';

const assert = require('assert-plus');
const orderStatuses = require('./enums/order_status');

const MONGOOSE_DUPLICATE_ERROR_CODE = 11000;

class OrderDAO {
    constructor(mongoConnection) {
        assert.object(mongoConnection);

        this.models = {
            Order: mongoConnection.model('Order', require('./models/order'))
        };

        this.ErrorCodes = {
            ORDER_MONGOOSE_ERROR: 'ORDER_MONGOOSE_ERROR',
            ORDER_NOT_FOUND_ERROR: 'ORDER_NOT_FOUND_ERROR',
            DUPLICATE_ORDER_ERROR: 'DUPLICATE_ORDER_ERROR'
        };
    }

    async createOrder(orderData) {
        assert.object(orderData);
        assert.string(orderData.agent_id);
        assert.string(orderData.lpg_id);
        assert.number(orderData.quantity);
        assert.number(orderData.total_price);

        try {
            const order = await this.models.Order.create(orderData);

            return order.toJSON();
        } catch (e) {
            if (e.code === MONGOOSE_DUPLICATE_ERROR_CODE) {
                throw {
                    error_code: this.ErrorCodes.DUPLICATE_ORDER_ERROR,
                    message: 'Duplicate order error'
                };
            }

            throw {
                error_code: this.ErrorCodes.ORDER_MONGOOSE_ERROR,
                message: 'Error when creating order'
            };
        }
    }

    async notifyOrderProcessed(orderId) {
        assert.string(orderId);

        try {
            const order = await this.models.Order.findOneAndUpdate(
                {
                    _id: orderId,
                    status: orderStatuses.PENDING
                },
                {
                    $set: {
                        status: orderStatuses.PROCESSED
                    }
                },
                { new: true }
            );

            if (!_.isObject(order)) {
                throw {
                    error_code: this.ErrorCodes.ORDER_NOT_FOUND_ERROR,
                    message: 'Order not found error'
                };
            }

            return order.toJSON();
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.ORDER_MONGOOSE_ERROR,
                message: 'Error when creating order'
            };
        }
    }

    async payOrder(orderId, agentId) {
        assert.string(orderId);
        assert.string(agentId);

        try {
            const order = await this.models.Order.findOneAndUpdate(
                {
                    _id: orderId,
                    agent_id: agentId,
                    status: orderStatuses.PROCESSED
                },
                {
                    $set: {
                        status: orderStatuses.PAID
                    }
                },
                { new: true }
            );

            if (!_.isObject(order)) {
                throw {
                    error_code: this.ErrorCodes.ORDER_NOT_FOUND_ERROR,
                    message: 'Order not found error'
                };
            }

            return order.toJSON();
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.ORDER_MONGOOSE_ERROR,
                message: 'Error when creating order'
            };
        }
    }

    async notifyOrderCompleted(orderId) {
        assert.string(orderId);

        try {
            const order = await this.models.Order.findOneAndUpdate(
                {
                    _id: orderId,
                    status: orderStatuses.PROCESSED
                },
                {
                    $set: {
                        status: orderStatuses.COMPLETED
                    }
                },
                { new: true }
            );

            if (!_.isObject(order)) {
                throw {
                    error_code: this.ErrorCodes.ORDER_NOT_FOUND_ERROR,
                    message: 'Order not found error'
                };
            }

            return order.toJSON();
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.ORDER_MONGOOSE_ERROR,
                message: 'Error when creating order'
            };
        }
    }
}

module.exports = OrderDAO;

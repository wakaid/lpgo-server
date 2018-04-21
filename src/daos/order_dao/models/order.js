'use strict';

const mongoose = require('mongoose');
const orderStatuses = require('./enums/order_status');

const LpgSchema = new mongoose.Schema(
    {
        agent_id: { type: String, required: true },
        lpg_id: { type: String, required: true },
        quantity: { type: Number, required: true },
        total_price: { type: Number, required: true },
        status: { type: String, default: orderStatuses.PENDING }
    },
    {
        timestamps: { createdAt: 'created', updatedAt: 'updated' },
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id.toString();

                delete ret._id;
                delete ret.__v;

                return ret;
            }
        }
    }
);

module.exports = LpgSchema;

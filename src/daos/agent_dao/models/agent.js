'use strict';

const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true }
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

module.exports = AgentSchema;

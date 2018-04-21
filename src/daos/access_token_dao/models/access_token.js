'use strict';

const mongoose = require('mongoose');

const AccessTokenSchema = new mongoose.Schema(
    {
        agent_id: { type: String, required: true },
        access_token: { type: String, required: true },
        expiry_time: { type: Number, required: true }
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

AccessTokenSchema.index({ access_token: 1 }, { unique: true });

module.exports = AccessTokenSchema;

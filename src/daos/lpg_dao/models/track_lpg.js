'use strict';

const mongoose = require('mongoose');

const TrackLpgSchema = new mongoose.Schema(
    {
        lpg_id: { type: String, required: true },
        agent_id: { type: String, required: true }
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

module.exports = TrackLpgSchema;

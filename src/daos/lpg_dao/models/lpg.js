'use strict';

const mongoose = require('mongoose');

const LpgSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        photo_url: { type: String },
        price: { type: Number, required: true }
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

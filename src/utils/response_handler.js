'use strict';

var _ = require('underscore');

module.exports = function(expressValidation) {
    return function(err, req, res, next) {
        if (!err) {
            return next();
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(err);
        }

        if (err instanceof expressValidation.ValidationError) {
            return res.status(400).json({
                error_code: 'API_VALIDATION_ERROR',
                errors: err.errors
            });
        }

        var errorCodeMap = req.errorCodeMap || {};

        var statusCode = errorCodeMap[err.error_code];

        if (_.isNumber(statusCode)) {
            return res.status(statusCode).send({
                error_code: err.error_code,
                message: err.message
            });
        }

        res.status(500).send({
            error_code: 'SERVER_ERROR',
            message:
                'Something unexpected happened, we are investigating this issue right now'
        });
    };
};

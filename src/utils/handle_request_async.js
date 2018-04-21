'use strict';

module.exports = function(asyncHandler) {
    return function(req, res, next) {
        let response = asyncHandler(req);

        response
            .then(function(response) {
                res.locals.response_data = response;

                next(null);
            })
            .catch(function(err) {
                return next(err);
            });
    };
};

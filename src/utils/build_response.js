'use strict';

module.exports = function(req, res) {
    res.status(200).json(res.locals.response_data);
};

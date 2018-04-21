'use strict';

module.exports = function(mongoConnection) {
    const accessTokenDAO = new AccessTokenDAO(mongoConnection);

    return async function(req, res, next) {
        const token = req.get('token');
        const isTokenValid = await accessTokenDAO.authenticate(token);

        if (isTokenValid === false) {
            return res.status(401).send({
                error_code: 'INVALID_TOKEN',
                message: 'Unauthorized, please check your token'
            });
        }

        next();
    };
};

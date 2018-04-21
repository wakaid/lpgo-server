'use strict';

const _ = require('underscore');
const assert = require('assert-plus');
const uuid = require('uuid/v4');

const MONGOOSE_DUPLICATE_ERROR_CODE = 11000;
const DEFAULT_EXPIRY_TIME = 3600;

class AccessTokenDAO {
    constructor(mongoConnection) {
        assert.object(mongoConnection);

        this.models = {
            AccessToken: mongoConnection.model(
                'AccessToken',
                require('./models/access_token')
            )
        };

        this.ErrorCodes = {
            ACCESS_TOKEN_MONGOOSE_ERROR: 'ACCESS_TOKEN_MONGOOSE_ERROR',
            ACCESS_TOKEN_NOT_FOUND_ERROR: 'ACCESS_TOKEN_NOT_FOUND_ERROR',
            DUPLICATE_ACCESS_TOKEN_ERROR: 'DUPLICATE_ACCESS_TOKEN_ERROR'
        };
    }

    async createAccessToken(agentId) {
        assert.string(agentId);

        const generatedToken = this._generateAccessToken();

        try {
            const accessTokenData = {
                agent_id: agentId,
                expiry_time: DEFAULT_EXPIRY_TIME,
                access_token: generatedToken
            };

            const accessToken = await this.models.AccessToken.create(
                accessTokenData
            );

            return accessToken.toJSON();
        } catch (e) {
            if (e.code === MONGOOSE_DUPLICATE_ERROR_CODE) {
                throw {
                    error_code: this.ErrorCodes.DUPLICATE_ACCESS_TOKEN_ERROR,
                    message:
                        'access token duplicate error, please try one more time'
                };
            }

            throw {
                error_code: this.ErrorCodes.ACCESS_TOKEN_MONGOOSE_ERROR,
                message: 'Error when creating access token'
            };
        }
    }

    _generateAccessToken() {
        return uuid();
    }

    async authenticateToken(token) {
        assert.string(token);

        try {
            const accessToken = await this.models.AccessToken.findOne({
                access_token: token
            });

            if (!_.isString(accessToken)) {
                return false;
            }

            const elapsedTime =
                Date.now() - new Date(accessToken.created).getTime();

            if (elapsedTime > accessToken.expiry_time) {
                return false;
            }

            return true;
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.ACCESS_TOKEN_MONGOOSE_ERROR,
                message: 'Error when creating access token'
            };
        }
    }
}

module.exports = AccessTokenDAO;

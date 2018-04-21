'use strict';

const _ = require('underscore');
const assert = require('assert-plus');

const MONGOOSE_DUPLICATE_ERROR_CODE = 11000;

class LpgDAO {
    constructor(mongoConnection) {
        assert.object(mongoConnection);

        this.models = {
            Lpg: mongoConnection.model('Lpg', require('./models/lpg')),
            TrackLpg: mongoConnection.model(
                'TrackLpg',
                require('./models/track_lpg')
            )
        };

        this.ErrorCodes = {
            LPG_MONGOOSE_ERROR: 'LPG_MONGOOSE_ERROR',
            LPG_NOT_FOUND_ERROR: 'LPG_NOT_FOUND_ERROR',
            DUPLICATE_LPG_ERROR: 'DUPLICATE_LPG_ERROR',
            TRACK_LPG_MONGOOSE_ERROR: 'TRACK_LPG_MONGOOSE_ERROR',
            TRACK_LPG_NOT_FOUND_ERROR: 'TRACK_LPG_NOT_FOUND_ERROR',
            DUPLICATE_TRACK_LPG_ERROR: 'DUPLICATE_TRACK_LPG_ERROR'
        };
    }

    async createLpg(type, price) {
        assert.string(type);
        assert.number(price);

        try {
            const lpg = await this.models.Lpg.create({
                type: type,
                price: price
            });

            return lpg;
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.LPG_MONGOOSE_ERROR,
                message: 'Error when getting lpg'
            };
        }
    }

    async getLpgs() {
        try {
            const lpgs = await this.models.Lpg.find();

            return _.map(lpgs, function(lpg) {
                return lpg.toJSON();
            });
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.LPG_MONGOOSE_ERROR,
                message: 'Error when getting lpg'
            };
        }
    }

    async trackLpg(lpgId, agentId) {
        assert.string(lpgId);
        assert.string(agentId);

        try {
            const trackLpg = await this.models.TrackLpg.create({
                lpg_id: lpgId,
                agent_id: agentId
            });

            return trackLpg.toJSON();
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.LPG_MONGOOSE_ERROR,
                message: 'Error when creating track lpg'
            };
        }
    }

    async getLpgsDetailForAgent(agentId) {
        assert.string(agentId);

        const self = this;

        try {
            const trackLpgs = await this.models.TrackLpg.find({
                agent_id: agentId
            });

            if (_.isEmpty(trackLpgs)) {
                throw {
                    error_code: this.ErrorCodes.TRACK_LPG_NOT_FOUND_ERROR,
                    message: 'There is no tracked lpg in this agent'
                };
            }

            return Promise.all(
                trackLpgs.map(async trackLpg => {
                    const lpg = await self._getLpgById(trackLpg.lpg_id);

                    return { ...trackLpg.toJSON(), ...lpg };
                })
            )
                .then(result => {
                    return result;
                })
                .catch(e => {
                    throw e;
                });
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.LPG_MONGOOSE_ERROR,
                message: 'Error when getting track lpg'
            };
        }
    }

    async _getLpgById(id) {
        assert.string(id);

        try {
            const lpg = await this.models.Lpg.findById(id);

            if (!_.isObject(lpg)) {
                throw {
                    error_code: this.ErrorCodes.LPG_NOT_FOUND_ERROR,
                    message: 'LPG not found error'
                };
            }

            return lpg.toJSON();
        } catch (e) {
            throw {
                error_code: this.ErrorCodes.LPG_MONGOOSE_ERROR,
                message: 'Error when getting lpg'
            };
        }
    }
}

module.exports = LpgDAO;

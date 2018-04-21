'use strict';

const assert = require('assert-plus');

const MONGOOSE_DUPLICATE_ERROR_CODE = 11000;

class AgentDAO {
    constructor(mongoConnection) {
        assert.object(mongoConnection);

        this.models = {
            Agent: mongoConnection.model('Agent', require('./models/agent'))
        };

        this.ErrorCodes = {
            AGENT_MONGOOSE_ERROR: 'AGENT_MONGOOSE_ERROR',
            AGENT_NOT_FOUND_ERROR: 'AGENT_NOT_FOUND_ERROR',
            DUPLICATE_AGENT_ERROR: 'DUPLICATE_AGENT_ERROR'
        };
    }

    async createAgent(agentData) {
        assert.object(agentData);
        assert.string(agentData.name);
        assert.string(agentData.city);
        assert.string(agentData.address);

        try {
            const agent = await this.models.Agent.create(agentData);

            return agent.toJSON();
        } catch (e) {
            if (e.code === MONGOOSE_DUPLICATE_ERROR_CODE) {
                throw {
                    error_code: this.ErrorCodes.DUPLICATE_AGENT_ERROR,
                    message: 'Duplicate agent error'
                };
            }

            throw {
                error_code: this.ErrorCodes.AGENT_MONGOOSE_ERROR,
                message: 'Error when creating agent'
            };
        }
    }
}

module.exports = AgentDAO;

'use strict';

switch (process.env.NODE_ENV) {
    case 'development':
        module.exports = {
            uri: 'mongodb://waka:wakaforever@128.199.226.142:27017/lpgo'
        };
        break;
    default:
        module.exports = {
            uri: 'mongodb://waka:wakaforever@localhost:27017/lpgo'
        };
}

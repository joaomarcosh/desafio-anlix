const TokenServices = require('./TokenServices');

class RefreshTokenServices extends TokenServices {
    constructor() {
        super('whitelist');
    }
}

module.exports = RefreshTokenServices;

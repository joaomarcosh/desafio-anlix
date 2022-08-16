const { createHash } = require('crypto');
const jwt = require('jsonwebtoken');
const Lista = require('./Lista');

class Blacklist extends Lista {
    constructor() {
        super('blacklist');
    }

    geraTokenHash(token) {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }

    async adiciona(token) {
        const dataExpiracao = jwt.decode(token).exp;
        const tokenHash = this.geraTokenHash(token);
        await super.adiciona(tokenHash, '', dataExpiracao);
    }

    async contemToken(token) {
        const tokenHash = this.geraTokenHash(token);
        return super.contemChave(tokenHash);
    }
}

module.exports = Blacklist;

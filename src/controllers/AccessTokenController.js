const jwt = require("jsonwebtoken");

class AccessTokenController {
    constructor(services) {
        this.services = services;
    }

    cria(id) {
        const payload = { id };
        return jwt.sign(payload, process.env.KEY, { expiresIn: '15m' });
    }

    async verifica(token) {
        await this.verificaNaBlacklist(token);
        const { id } = jwt.verify(token, process.env.KEY);
        return id;
    }

    async verificaNaBlacklist(token) {
        const tokenNaBlacklist = await this.services.contemToken(token);
        if (tokenNaBlacklist) {
            throw new jwt.JsonWebTokenError(`Access token inválido por logout!`);
        }
    }

    invalida(token) {
        return this.services.adiciona(token);
    }

}

module.exports = AccessTokenController;

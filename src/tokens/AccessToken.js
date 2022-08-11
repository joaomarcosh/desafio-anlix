const jwt = require("jsonwebtoken");
const blacklist = require("../redis/blacklist");

class AccessToken {

    static cria(id) {
        const payload = { id };
        return jwt.sign(payload, process.env.KEY, { expiresIn: '15m' });
    }

    static async verifica(token) {
        await this.verificaNaBlacklist(token);
        const { id } = jwt.verify(token, process.env.KEY);
        return id;
    }

    static async verificaNaBlacklist(token) {
        const tokenNaBlocklist = await blacklist.contemToken(token);
        if (tokenNaBlocklist) {
            throw new jwt.JsonWebTokenError(`Access token inválido por logout!`);
        }
    }

    static invalida(token) {
        return blacklist.adiciona(token);
    }

}

module.exports = AccessToken;

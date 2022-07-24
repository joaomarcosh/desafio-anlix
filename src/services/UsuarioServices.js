require('dotenv/config');
const Services = require('./Services');
const jwt = require('jsonwebtoken');
const {randomBytes} = require('crypto');
const whitelist = require('../redis/whitelist');

class UsuarioServices extends Services {
    constructor() {
        super('Usuarios');
    }

    criaTokenJWT(usuario) {
        const payload = {id: usuario.id};
        return jwt.sign(payload, process.env.KEY, { expiresIn: '15m' });
    }

    async criaTokenOpaco(usuario) {
        const tokenOpaco = randomBytes(24).toString('hex');
        const dataExpiracao = Date.now()+432000000; // 5 dias
        await whitelist.adiciona(tokenOpaco, usuario.id, dataExpiracao);

        return tokenOpaco;
    }
}

module.exports = UsuarioServices;
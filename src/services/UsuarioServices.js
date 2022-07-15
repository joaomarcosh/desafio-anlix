const Services = require('./Services');
const jwt = require('jsonwebtoken');
require('dotenv/config');

class UsuarioServices extends Services {
    constructor() {
        super('Usuarios');
    }

    criaTokenJWT(usuario) {
        const payload = {
            id: usuario.id
        };

        return jwt.sign(payload, process.env.KEY, { expiresIn: '15m' });
    }
}

module.exports = UsuarioServices;
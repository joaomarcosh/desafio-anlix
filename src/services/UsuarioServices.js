const Services = require('./Services');

class UsuarioServices extends Services {
    constructor(db) {
        super(db, 'Usuarios');
    }
}

module.exports = UsuarioServices;

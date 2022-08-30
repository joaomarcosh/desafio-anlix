const Services = require('./Services');

class TipoServices extends Services {
    constructor(db) {
        super(db, 'Tipos_Leituras');
    }
}

module.exports = TipoServices;

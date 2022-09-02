const Services = require('./Services');
const {RegistroNaoEncontradoError} = require("../erros");

class UsuarioServices extends Services {
    constructor(db) {
        super(db, 'Usuarios');
    }

    async pegaTodosOsRegistros(options = {}) {
        if (!options.attributes) options.attributes = { exclude: ['senha'] };
        const registros =  await this.db[this.nomeDoModelo].findAll(options);
        if (registros.length === 0) throw new RegistroNaoEncontradoError;
        return registros;
    }

    async pegaUmRegistroPorID(id, options = {}) {
        if (!options.attributes) options.attributes = { exclude: ['senha'] };
        const registro = await this.db[this.nomeDoModelo].findByPk(id, options);
        if (registro === null) throw new RegistroNaoEncontradoError;
        return registro;
    }

    async pegaUmRegistro(options) {
        if (!options.attributes) options.attributes = { exclude: ['senha'] };
        const registro = await this.db[this.nomeDoModelo].findOne(options);
        if (registro === null) throw new RegistroNaoEncontradoError;
        return registro;
    }
}

module.exports = UsuarioServices;

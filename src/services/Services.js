const { RegistroNaoEncontradoError } = require('../erros');

class Services {
    constructor(db, modelo) {
        this.db = db;
        this.nomeDoModelo = modelo;
    }

    async pegaTodosOsRegistros(options = {}) {
        return await this.db[this.nomeDoModelo].findAll(options);
    }

    async pegaUmRegistroPorID(id) {
        const registro = await this.db[this.nomeDoModelo].findByPk(id);
        if (registro === null) throw new RegistroNaoEncontradoError;
        return registro;
    }

    async pegaUmRegistro(condicao) {
        const registro = await this.db[this.nomeDoModelo].findOne(condicao);
        if (registro === null) throw new RegistroNaoEncontradoError;
        return registro;
    }

    criaUmRegistro(dados) {
        return this.db[this.nomeDoModelo].create(dados);
    }

    async atualizaUmRegistro(id,dados) {
        return await this.db[this.nomeDoModelo].update(dados,{where: {id: Number(id)}});
    }

    async apagaUmRegistro(id) {
        const registro = await this.pegaUmRegistroPorID(id)
        return await registro.destroy();
    }
}

module.exports = Services;

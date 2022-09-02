const { RegistroNaoEncontradoError } = require('../erros');

class Services {
    constructor(db, modelo) {
        this.db = db;
        this.nomeDoModelo = modelo;
    }

    async pegaTodosOsRegistros(options = {}) {
        const registros =  await this.db[this.nomeDoModelo].findAll(options);
        if (registros.length === 0) throw new RegistroNaoEncontradoError;
        return registros;
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
        if (dados.length > 1) return this.db[this.nomeDoModelo].bulkCreate(dados);
        if (dados[0]) dados = dados[0];
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

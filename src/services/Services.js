const db = require('../models');

class Services {
    constructor(modelo) {
        this.nomeDoModelo = db[modelo];
    }

    async pegaTodosOsRegistros(where = {}) {
        return this.nomeDoModelo.findAll({where});
    }

    async pegaUmRegistroPorID(id) {
        return this.nomeDoModelo.findByPk(id);
    }

    async pegaUmResgistro(condicao) {
        return this.nomeDoModelo.findOne({condicao});
    }

    async criaUmRegistro(dados) {
        return this.nomeDoModelo.create(dados);
    }

    async atualizaUmRegistro(id,dados) {
        return this.nomeDoModelo.update(dados,{where: {id: Number(id)}});
    }

    async apagaUmRegistro(id) {
        const registro = await this.pegaUmRegistroPorID(id)
        return registro.destroy();
    }
}

module.exports = Services;

const Services = require('./Services');
const { Op } = require('sequelize');

class PacienteServices extends Services {
    constructor(db) {
        super(db, 'Pacientes');
    }

    //Consultar pacientes que contenham um nome ou parte de um nome a ser especificado na chamada da API.
    async pegaPorNome(nome) {
        let options = { where: {} };
        if (nome) {
            options.where = this.db.sequelize.where(
                this.db.sequelize.fn('lower', this.db.sequelize.col('nome')),
                { [Op.like]: this.db.sequelize.fn('lower', `%${nome}%`) }
            );
        }
        return await this.pegaTodosOsRegistros(options);
    }
}

module.exports = PacienteServices;

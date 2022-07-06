const Services = require('./Services');
const db = require("../models");

class LeituraServices extends Services {
    constructor() {
        super('Leituras');
        this.pacientes = new Services('Pacientes');
    }

    async pegaUmRegistroPorNome(where={},attributes=['*'],raw=false) {
        return this.pacientes.pegaUmResgistro({where,attributes:attributes,raw:raw});
    }

    async pegaLeiturasRecentes(condicao) {
        return db.sequelize.query(
            `SELECT r.*
                FROM "Leituras" AS r
                JOIN (
                    SELECT MAX(data) AS date, tipo_id, paciente_id
                    FROM "Leituras" AS gp
                    ${condicao}
                    GROUP BY tipo_id, paciente_id
                ) AS gp
                ON r.data = gp.date
                AND r.tipo_id = gp.tipo_id
                ORDER BY paciente_id ASC, tipo_id ASC;`,
            {type: db.sequelize['QueryTypes'].SELECT}
        );
    }

    async pegaRegistrosPorData(where={},order = [[]]) {
        return this.nomeDoModelo.findAll({where,order: order});
    }

    async pegaLeituraRecentesParaUmPorTipo(where={},order = [[]]) {
        return this.nomeDoModelo.findAll({where,order:order,limit:1});
    }
}

module.exports = LeituraServices;
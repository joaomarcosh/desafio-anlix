const Services = require('./Services');
const PacienteServices = require('./PacienteServices');
const {Op} = require("sequelize");

class LeituraServices extends Services {
    constructor(db) {
        super(db, 'Leituras');
        this.pacientes = new PacienteServices(db);
    }

    async pegaLeiturasRecentes(condicao) {
        return await this.db.sequelize.query(
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
            {type: this.db.sequelize['QueryTypes'].SELECT}
        );
    }

    async setCondicao(params, query) {
        let where = {};

        const { nome, valorInicial, valorFinal, dataInicial, dataFinal, data } = query;
        const { id, paciente_id, tipo_id } = params;

        if (paciente_id && tipo_id) {
            where = {
                paciente_id: paciente_id,
                tipo_id: tipo_id
            }
        }

        if (valorInicial || valorFinal) {
            where.valor = {};
            valorInicial ? where.valor[Op.gte] = valorInicial : null;
            valorFinal ? where.valor[Op.lte] = valorFinal : null;
        }

        if (dataInicial || dataFinal) {
            where.data = {};
            dataInicial ? where.data[Op.gte] = dataInicial : null;
            dataFinal ? where.data[Op.lte] = dataFinal : null;
        } else if (data) {
            where = this.db.sequelize.where(
                this.db.sequelize.fn('date', this.db.sequelize.col('data')),
                `${data}`
            )
        }

        let condicao = where;

        if (nome) {
            where.nome = {[Op.substring]: nome};
            condicao = await this.pacientes.pegaUmRegistro({
                where: where, attributes: ['id'], raw: true
            }).then(({id}) => `WHERE paciente_id = ${id}`);
        }

        if (id) {
            condicao = `WHERE paciente_id = ${id}`;
        }

        if (isEmpty(query) && isEmpty(params)) {
            condicao = '';
        }

        return condicao;
    }
}

function isEmpty(value) {
    return Object.prototype.toString.call(value) === '[object Object]' &&
        JSON.stringify(value) === '{}'
}

module.exports = LeituraServices;

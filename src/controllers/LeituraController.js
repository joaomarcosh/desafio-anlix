const db = require('../models');
const { Op } = require('sequelize');
const {LeituraServices} = require('../services');

const leituraServices = new LeituraServices();

class LeituraController {

    static async pegaLeituras(req,res) {
        try {
            const {dataInicial,dataFinal,data} = req.query;
            let where = {};

            //Consultar para um intervalo de datas (dia, mês e ano), todas as 
            //características existentes de todos os pacientes da base de dados;
            if (dataInicial || dataFinal) {
                where.data = {};
                dataInicial ? where.data[Op.gte] = dataInicial : null;
                dataFinal ? where.data[Op.lte] = dataFinal : null;

            //Consultar para uma determinada data (dia, mês e ano), todas as 
            //características existentes de todos os pacientes da base de dados;
            } else if (data) {
                where = db.sequelize.where(
                    db.sequelize.fn('date', db.sequelize.col('data')),
                    `${data}`
                )
            }

            //const leituras = await db.Leituras.findAll({where});
            const leituras = await leituraServices.pegaTodosOsRegistros(where);
            return res.status(200).json(leituras);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async pegaLeitura(req,res) {
        try {
            const { id } = req.params;
            //const leitura = await db.Leituras.findByPk(id);
            const leitura = await leituraServices.pegaUmRegistroPorID(id);
            return res.status(200).json(leitura);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async criaLeitura(req,res) {
        try {
            const novaLeitura = req.body;
            //const leitura = await db.Leituras.create(novaLeitura);
            const leitura = await leituraServices.criaUmRegistro(novaLeitura);
            return res.status(201).json(leitura);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async atualizaLeitura(req,res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            //await db.Leituras.update(dados,{ where: { id:id } });
            //const leitura = await db.Leituras.findByPk(id);
            await leituraServices.atualizaUmRegistro(id,dados);
            const leitura = await leituraServices.pegaUmRegistroPorID(id);
            return res.status(200).json(leitura);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async apagaLeitura(req,res) {
        try {
            const { id } = req.params;
            //const leitura = await db.Leituras.findByPk(id);
            //await leitura.destroy();
            await leituraServices.apagaUmRegistro(id);
            return res.status(200).json({mensagem: `leitura com id ${id} deletada!`})
        } catch(erro) {
            return res.status(500).json({erro: "leitura não existe!"});
        }
    }

    //Consultar, para cada paciente, cada uma das características individualmente e 
    //cada uma delas sendo a mais recente disponível;
    //
    //Buscar um paciente por nome e exibir o valor mais recente de cada uma de suas características;
    static async pegaLeiturasRecentesParaTodos(req,res) {
        try {
            const { nome } = req.query;
            const where = {};
            let condicao = "";
            if (nome) {
                where.nome = {[Op.substring]: nome};
                /*condicao = await db['Pacientes'].findOne({
                    where,
                    attributes:['id'],
                    raw:true
                }).then(({id}) => `WHERE paciente_id = ${id}`);*/
                condicao = await leituraServices.pegaUmRegistroPorNome(where,['id'],true)
                    .then(({id}) => `WHERE paciente_id = ${id}`);
            }

            /*const leituras = await db.sequelize.query(
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
            );*/
            const leituras = await leituraServices.pegaLeiturasRecentes(condicao);
            return res.status(200).json(leituras);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    //Consultar em uma única chamada, todas as características de um paciente, 
    //com os valores mais recentes de cada uma;
    static async pegaLeiturasRecentesParaUm(req,res) {
        try {
            const { id } = req.params;
            const condicao = `WHERE paciente_id = ${id}`;
            /*const leituras = await db.sequelize.query(
                `SELECT r.*
                FROM "Leituras" AS r
                JOIN (
                    SELECT MAX(data) AS date, tipo_id, paciente_id
                    FROM "Leituras" AS gp
                    WHERE paciente_id = ${id}
                    GROUP BY tipo_id, paciente_id
                ) AS gp
                ON r.data = gp.date
                AND r.tipo_id = gp.tipo_id;`,
                {type: db.sequelize.QueryTypes.SELECT}
            );*/
            const leituras = await leituraServices.pegaLeiturasRecentes(condicao);
            return res.status(200).json(leituras);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    //Consultar uma característica qualquer de um paciente para um intervalo 
    //de datas a ser especificado na chamada da API;
    static async pegaLeiturasParaUmPorTipo(req,res) {
        try {
            const {paciente_id,tipo_id} = req.params;
            const {dataInicial,dataFinal} = req.query;
            const where = {
                paciente_id:paciente_id,
                    tipo_id:tipo_id
            };
            dataInicial || dataFinal ? where.data = {} : null;
            dataInicial ? where.data[Op.gte] = dataInicial : null;
            dataFinal ? where.data[Op.lte] = dataFinal : null;

            /*const leituras = await db.Leituras.findAll({
                where,
                order: [['data','ASC']]
            });*/
            const leituras = await leituraServices.pegaRegistrosPorData(where,[['data','ASC']]);
            return res.status(200).json(leituras);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    //Consultar o valor mais recente de uma característica de um paciente 
    //que esteja entre um intervalo de valores a ser especificado na chamada da API;
    static async pegaLeiturasRecentesParaUmPorTipo(req,res) {
        try {
            const {paciente_id,tipo_id} = req.params;
            const {valorInicial,valorFinal} = req.query;
            const where = {
                paciente_id: paciente_id,
                tipo_id: tipo_id
            };
            valorInicial || valorFinal ? where.valor = {} : null;
            valorInicial ? where.valor[Op.gte] = valorInicial : null;
            valorFinal ? where.valor[Op.lte] = valorFinal : null;

            /*const leitura = await db.Leituras.findAll({
                where,
                order: [['data','DESC']],
                limit: 1
            });*/
            const leitura = await leituraServices.pegaLeituraRecentesParaUmPorTipo(where,[['data','DESC']]);
            return res.status(200).json(leitura)
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

}

module.exports = LeituraController;

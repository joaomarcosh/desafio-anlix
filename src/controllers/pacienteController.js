const db = require('../models');
const { Op } = require('sequelize');

class PacienteController {

    //Consultar pacientes que contenham um nome ou parte de um nome a ser especificado na chamada da API.
    static async pegaPacientes(req,res) {
        try {
            const { nome } = req.query;
            let where = {};
            if (nome) {
                where = db.sequelize.where(
                    db.sequelize.fn('lower', db.sequelize.col('nome')),
                    {
                        [Op.like]: db.sequelize.fn('lower', `%${nome}%`)
                    }
                )
            }
            const pacientes = await db.Pacientes.findAll({where});
            return res.status(200).json(pacientes);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async pegaPaciente(req,res) {
        try {
            const { id } = req.params;
            const paciente = await db.Pacientes.findByPk(id);
            return res.status(200).json(paciente);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async criaPaciente(req,res) {
        try {
            const novoPaciente = req.body;
            const paciente = await db.Pacientes.create(novoPaciente);
            return res.status(201).json(paciente);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async atualizaPaciente(req,res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            await db.Pacientes.update(dados,{ where: { id:id } });
            const paciente = await db.Pacientes.findByPk(id);
            return res.status(200).json(paciente);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async apagaPaciente(req,res) {
        try {
            const { id } = req.params;
            const paciente = await db.Pacientes.findByPk(id);
            await paciente.destroy();
            return res.status(200).json({mensagem: `paciente com id ${id} deletado!`})
        } catch(erro) {
            return res.status(500).json({erro: "paciente não existe!"});
        }
    }

}

module.exports = PacienteController;
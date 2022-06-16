const db = require('../models');

class LeituraController {

    static async pegaLeituras(req,res) {
        try {
            const leituras = await db.Leituras.findAll();
            return res.status(200).json(leituras);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async pegaLeitura(req,res) {
        try {
            const { id } = req.params;
            const leitura = await db.Leituras.findByPk(id);
            return res.status(200).json(leitura);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async criaLeitura(req,res) {
        try {
            const novaLeitura = req.body;
            const leitura = await db.Leituras.create(novaLeitura);
            return res.status(201).json(leitura);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async atualizaLeitura(req,res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            await db.Leituras.update(dados,{ where: { id:id } });
            const leitura = await db.Leituras.findByPk(id);
            return res.status(200).json(leitura);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async apagaLeitura(req,res) {
        try {
            const { id } = req.params;
            const leitura = await db.Leituras.findByPk(id);
            await leitura.destroy();
            return res.status(200).json({mensagem: `leitura com id ${id} deletada!`})
        } catch(erro) {
            return res.status(500).json({erro: "leitura não existe!"});
        }
    }

}

module.exports = LeituraController;
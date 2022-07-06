const {TipoServices} = require('../services');

const tipoServices = new TipoServices();

class TipoController {

    static async pegaTipos(req,res) {
        try {
            //const tipos = await db.Tipos_Leituras.findAll();
            const tipos = await tipoServices.pegaTodosOsRegistros();
            return res.status(200).json(tipos);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async pegaTipo(req,res) {
        try {
            const { id } = req.params;
            //const tipo = await db.Tipos_Leituras.findByPk(id);
            const tipo = await tipoServices.pegaUmRegistroPorID(id);
            return res.status(200).json(tipo);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async criaTipo(req,res) {
        try {
            const novoTipo = req.body;
            //const tipo = await db.Tipos_Leituras.create(novoTipo);
            const tipo = await tipoServices.criaUmRegistro(novoTipo);
            return res.status(201).json(tipo);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async atualizaTipo(req,res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            //await db.Tipos_Leituras.update(dados,{ where: { id:id } });
            //const tipo = await db.Tipos_Leituras.findByPk(id);
            await tipoServices.atualizaUmRegistro(id,dados);
            const tipo = await tipoServices.pegaUmRegistroPorID(id);
            return res.status(200).json(tipo);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async apagaTipo(req,res) {
        try {
            const { id } = req.params;
            //const tipo = await db.Tipos_Leituras.findByPk(id);
            //await tipo.destroy();
            await tipoServices.apagaUmRegistro(id);
            return res.status(200).json({mensagem: `Tipo de Leitura com id ${id} deletado!`})
        } catch(erro) {
            if (erro.name === "SequelizeForeignKeyConstraintError") {
                return res.status(500).json({erro: erro.message});
            }
            return res.status(500).json({erro: "Tipo de Leitura não existe!"});
        }
    }

}

module.exports = TipoController;
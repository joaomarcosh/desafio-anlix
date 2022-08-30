class Controller {
    constructor(services) {
        this.services = services;
    }

    pegaTodos = async (req,res) => {
        try {
            const registros = await this.services.pegaTodosOsRegistros();
            return res.status(200).json(registros);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    pegaUm = async (req,res) => {
        try {
            const { id } = req.params;
            const registro = await this.services.pegaUmRegistroPorID(id);
            return res.status(200).json(registro);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    criaUm = async (req,res) => {
        try {
            const novoRegistro = req.body;
            const registro = await this.services.criaUmRegistro(novoRegistro);
            return res.status(201).json(registro);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    atualizaUm = async (req,res) => {
        try {
            const { id } = req.params;
            const dados = req.body;
            await this.services.atualizaUmRegistro(id,dados);
            const registro = await this.services.pegaUmRegistroPorID(id);
            return res.status(200).json(registro);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    apagaUm = async (req,res) => {
        try {
            const { id } = req.params;
            await this.services.apagaUmRegistro(id);
            return res.status(200).json({mensagem: `Registro com id ${id} deletado!`})
        } catch(erro) {
            if (erro.name === "RegistroNaoEncontradoError") {
                return res.status(404).json({erro: "Registro não encontrado!"});
            }
            return res.status(500).json({erro: erro.message});
        }
    }
}

module.exports = Controller;

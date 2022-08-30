const Controller = require("./Controller");

class PacienteController extends Controller {
    constructor(services) {
        super(services);
    }

    //Consultar pacientes que contenham um nome ou parte de um nome a ser especificado na chamada da API.
    pegaTodos = async (req, res) => {
        try {
            const { nome } = req.query;
            const pacientes = await this.services.pegaPorNome(nome);
            return res.status(200).json(pacientes);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }
}

module.exports = PacienteController;

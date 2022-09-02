const Controller = require('./Controller');

class LeituraController extends Controller {
    constructor(services) {
        super(services);
    }

    //Consultar uma característica qualquer de um paciente para um intervalo
    //de datas a ser especificado na chamada da API;
    pegaTodos = async (req,res) => {
        try {
            const condicao = await this.services.setCondicao(req.params, req.query);
            const options = { where: condicao };
            const leituras = await this.services.pegaTodosOsRegistros(options);
            return res.status(200).json(leituras);
        } catch(erro) {
            let status = 500;
            if (erro.name === "RegistroNaoEncontradoError") status = 404;
            return res.status(status).json({erro: erro.message});
        }
    }

    //Consultar, para cada paciente, cada uma das características individualmente e 
    //cada uma delas sendo a mais recente disponível;
    //
    //Buscar um paciente por nome e exibir o valor mais recente de cada uma de suas características;
    //
    //Consultar em uma única chamada, todas as características de um paciente, 
    //com os valores mais recentes de cada uma;
    pegaLeiturasRecentes = async (req, res) => {
        try {
            const condicao = await this.services.setCondicao(req.params, req.query);
            const leituras = await this.services.pegaLeiturasRecentes(condicao);
            return res.status(200).json(leituras);
        } catch(erro) {
            let status = 500;
            if (erro.name === "RegistroNaoEncontradoError") status = 404;
            return res.status(status).json({erro: erro.message});
        }
    }

    //Consultar o valor mais recente de uma característica de um paciente 
    //que esteja entre um intervalo de valores a ser especificado na chamada da API;
    pegaLeiturasRecentesParaUmPorTipo = async (req,res) => {
        try {
            const condicao = await this.services.setCondicao(req.params, req.query);
            const options = { where: condicao, order: [['data', 'ASC']] };
            const leituras = await this.services.pegaTodosOsRegistros(options);
            return res.status(200).json(leituras);
        } catch(erro) {
            let status = 500;
            if (erro.name === "RegistroNaoEncontradoError") status = 404;
            return res.status(status).json({erro: erro.message});
        }
    }
}

module.exports = LeituraController;

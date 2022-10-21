const Controller = require('./Controller');

class UsuarioController extends Controller {
    constructor(services, accessToken, refreshToken) {
        super(services);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    login = async (req,res) => {
        try {
            const accessToken = this.accessToken.cria(req.user.id);
            const refreshToken = await this.refreshToken.cria(req.user.id);
            res.set('Authorization', 'Bearer ' + accessToken);
            res.status(200).json({refreshToken});
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    logout = async (req, res) => {
        try {
            const token = req.token;
            await this.accessToken.invalida(token);
            res.status(200).json({mensagem: "logout efetuado com succeso!"});
        } catch (erro) {
            res.status(500).json({erro: erro.message});
        }
    }
}

module.exports = UsuarioController;

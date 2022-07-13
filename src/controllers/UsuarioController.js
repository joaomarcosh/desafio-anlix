const {UsuarioServices} = require('../services');

const usuarioServices = new UsuarioServices();

class UsuarioController {
    static async pegaUsuarios(req,res) {
        try {
            const usuarios = await usuarioServices.pegaTodosOsRegistros();
            return res.status(200).json(usuarios);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async pegaUsuario(req,res) {
        try {
            const { id } = req.params;
            const usuario = await usuarioServices.pegaUmRegistroPorID(id);
            return res.status(200).json(usuario);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async criaUsuario(req,res) {
        try {
            const novoUsuario = req.body;
            const usuario = await usuarioServices.criaUmRegistro(novoUsuario);
            return res.status(201).json(usuario);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async atualizaUsuario(req,res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            await usuarioServices.atualizaUmRegistro(id,dados);
            const usuario = await usuarioServices.pegaUmRegistroPorID(id);
            return res.status(200).json(usuario);
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }

    static async apagaUsuario(req,res) {
        try {
            const { id } = req.params;
            await usuarioServices.apagaUmRegistro(id);
            return res.status(200).json({mensagem: `Usuario com id ${id} deletado!`})
        } catch(erro) {
            if (erro.name === "SequelizeForeignKeyConstraintError") {
                return res.status(500).json({erro: erro.message});
            }
            return res.status(500).json({erro: "Usuario não existe!"});
        }
    }

    static async Login(req,res) {
        try {
            const token = "Bearer " + usuarioServices.criaTokenJWT(req.user);
            res.set('Authorization', token);
            res.status(204).end();
            //res.redirect(301, '/dashboard');
        } catch(erro) {
            return res.status(500).json({erro: erro.message});
        }
    }
}

module.exports = UsuarioController;
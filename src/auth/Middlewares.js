const passport = require('passport');

class Middlewares {
    constructor(refreshToken, usuarios) {
        this.refreshToken = refreshToken;
        this.usuarios = usuarios;
    }

    local(req, res, next) {
        passport.authenticate(
            'local',
            { session: false },
            (erro, usuario) => {
                if (erro && erro.name === 'RegistroNaoEncontradoError') {
                    return res.status(404).json({ erro: 'Usuario ou senha invalidos' });
                }

                if (erro) {
                    return res.status(500).json({ erro: erro.message });
                }

                if (!usuario) {
                    return res.status(401).json();
                }

                req.user = usuario;
                return next();
            }
        )(req, res, next);
    }

    bearer(req, res, next) {
        passport.authenticate(
            'bearer',
            { session: false },
            (erro, usuario, info) => {
                if (erro && erro.name === 'JsonWebTokenError') {
                    return res.status(401).json({ erro: erro.message });
                }

                if (erro && erro.name === 'TokenExpiredError') {
                    return res
                        .status(401)
                        .json({ erro: erro.message, expiradoEm: erro.expiredAt });
                }

                if (erro) {
                    return res.status(500).json({ erro: erro.message });
                }

                if (!usuario) {
                    return res.status(401).json();
                }

                req.token = info.token;
                req.user = usuario;
                return next();
            }
        )(req, res, next);
    }

    refresh = async (req, res, next) => {
        try {
            const token = req.body.refreshToken;
            const id = await this.refreshToken.verifica(token);
            await this.refreshToken.invalida(token);
            req.user = await this.usuarios.pegaUmRegistroPorID(id, { raw: true });
            return next();
        } catch (erro) {
            let status = 500;
            if (erro.message === 'Refresh token inválido!') status = 400;
            return res.status(status).json({erro: erro.message});
        }
    }
}

module.exports = Middlewares;

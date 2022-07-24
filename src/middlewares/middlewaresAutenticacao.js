const passport = require('passport');
const db = require('../models');
const whitelist = require('../redis/whitelist');

async function verificaRefreshToken(refreshToken) {
    if (!refreshToken) {
        throw new Error('Refresh token não enviado!');
    }
    const id = await whitelist.buscaValor(refreshToken);
    if (!id) {
        throw new Error('Refresh token inválido!');
    }
    return id;
}

async function invalidaRefreshToken(refreshToken) {
    await whitelist.apaga(refreshToken);
}

function local(req, res, next) {
    passport.authenticate(
        'local',
        { session: false },
        (erro, usuario, info) => {
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

function bearer(req, res, next) {
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

async function refresh(req, res, next) {
    try {
        const {refreshToken} = req.body;
        const id = await verificaRefreshToken(refreshToken);
        await invalidaRefreshToken(refreshToken);
        req.user = await db['Usuarios'].findByPk(id);
        return next();
    } catch (erro) {
        return res.status(500).json({erro: erro.message});
    }
}

module.exports = {local, bearer, refresh};

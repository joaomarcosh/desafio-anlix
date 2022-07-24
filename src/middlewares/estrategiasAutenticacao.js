const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklist = require('../redis/blacklist');

function verificaUsuario(usuario) {
    if (!usuario) {
        throw new Error('Esse usuário não existe!');
    }
}

async function verificaTokenNaBlacklist(token) {
    const tokenNaBlacklist = await blacklist.contemToken(token);
    if (tokenNaBlacklist) {
        throw new jwt.JsonWebTokenError('Token inválido por logout!');
    }
}

async function verificaSenha(senha, senhaHash) {
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if (!senhaValida) {
        throw new Error('Usuário ou senha inválidos!');
    }
}

passport.use(
    new LocalStrategy(
        {
            usernameField: 'usuario',
            passwordField: 'senha',
            session: false
        },
        async (usuario, senha, done) => {
            try {
                const user = await db['Usuarios'].findOne({where: {usuario: usuario},raw:true});
                verificaUsuario(user);
                await verificaSenha(senha, user.senha);
                done(null, user);
            } catch (erro) {
                done(erro,null);
            }
        }
    )
);

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                await verificaTokenNaBlacklist(token);
                const payload = jwt.verify(token, process.env.KEY);
                const usuario = await db['Usuarios'].findByPk(payload.id);
                done(null, usuario, { token: token });
            } catch (erro) {
                done(erro);
            }
        }
    )
);
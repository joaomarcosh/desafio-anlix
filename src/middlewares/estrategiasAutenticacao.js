const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function verificaUsuario(usuario) {
    if (!usuario) {
        throw new Error('Esse usuário não existe!');
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
                const payload = jwt.verify(token, process.env.KEY);
                const usuario = await db['Usuarios'].findByPk(payload.id);//Usuario.buscaPorId(payload.id);
                done(null, usuario);
            } catch (erro) {
                done(erro);
            }
        }
    )
);
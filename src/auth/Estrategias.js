const bcrypt = require('bcryptjs');

class Estrategias {
    constructor(accessToken, usuarios) {
        this.accessToken = accessToken;
        this.usuarios = usuarios;
    }

    localStrategyCallback = async (usuario, senha, done) => {
        try {
            const user = await this.usuarios.pegaUmRegistro({
                where: { usuario: usuario }, raw: true, attributes: ['id', 'senha'],
            });

            if (!this.senhaValida(senha, user.senha)) return done(null, false);
            return done(null, user);

        } catch (erro) {
            return done(erro, null);
        }
    }

    bearerStrategyCallback = async (token, done) => {
        try {
            const id = await this.accessToken.verifica(token);
            const usuario = await this.usuarios.pegaUmRegistroPorID(id, { raw: true });
            return done(null, usuario, { token: token });

        } catch (erro) {
            return done(erro, null);
        }
    }

    senhaValida(senha, senhaHash) {
        return bcrypt.compareSync(senha, senhaHash);
    }
}

module.exports = Estrategias;

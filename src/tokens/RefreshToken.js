const crypto = require("crypto");
const { whitelist } = require("../redis");

class RefreshToken {

    static async cria(id) {
        const tokenOpaco = crypto.randomBytes(24).toString('hex');
        const dataExpiracao = Date.now()+432000000; // 5 dias
        await whitelist.adiciona(tokenOpaco, id, dataExpiracao);
        return tokenOpaco;
    }

    static async verifica(token) {
        this.verificaEnviado(token);
        const id = await whitelist.buscaValor(token);
        this.verificaValido(id);
        return id;
    }

    static verificaValido(id) {
        if (!id) {
            throw new Error(`Refresh token inválido!`);
        }
    }

    static verificaEnviado(token) {
        if (!token) {
            throw new Error(`Refresh token não enviado!`);
        }
    }

    static async invalida(token) {
        await whitelist.apaga(token);
    }

}

module.exports = RefreshToken;

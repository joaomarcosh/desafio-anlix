const crypto = require("crypto");

class RefreshTokenController {
    constructor(services) {
        this.services = services;
    }

    async cria(id) {
        const tokenOpaco = crypto.randomBytes(24).toString('hex');
        const dataExpiracao = Date.now()+432000000; // 5 dias
        await this.services.adiciona(tokenOpaco, id, dataExpiracao);
        return tokenOpaco;
    }

    async verifica(token) {
        this.verificaEnviado(token);
        const id = await this.services.buscaValor(token);
        this.verificaValido(id);
        return id;
    }

    verificaValido(id) {
        if (!id) {
            throw new Error(`Refresh token inválido!`);
        }
    }

    verificaEnviado(token) {
        if (!token) {
            throw new Error(`Refresh token não enviado!`);
        }
    }

    async invalida(token) {
        await this.services.apaga(token);
    }
}

module.exports = RefreshTokenController;

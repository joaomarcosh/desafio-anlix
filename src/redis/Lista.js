const redis = require('redis');

class Lista {
    constructor(prefixo) {
        this.prefixo = prefixo;
        this.client = redis.createClient();
        (async () => {
            await this.client.connect();
        })();
    }

    async adiciona(chave, valor, dataExpiracao) {
        await this.client.set(`${this.prefixo}:${chave}`, valor);
        await this.client.expireAt(chave, dataExpiracao);
    }

    async buscaValor(chave) {
        return this.client.get(`${this.prefixo}:${chave}`);
    }

    async contemChave(chave) {
        const resultado = await this.client.exists(`${this.prefixo}:${chave}`);
        return resultado === 1;
    }

    async apaga(chave) {
        await this.client.del(`${this.prefixo}:${chave}`);
    }
}

module.exports = Lista;

class RegistroNaoEncontradoError extends Error {
    constructor() {
        super();
        this.name = 'RegistroNaoEncontradoError';
        this.message = 'Registro não encontrado';
    }
}

module.exports = { RegistroNaoEncontradoError };

const { RefreshTokenController } = require('../../src/controllers');
const crypto = require('crypto');

jest.mock('crypto', () => ({
    randomBytes: jest.fn().mockReturnThis(),
    toString: jest.fn().mockReturnValue('token'),
}));

describe('Testes para a classe RefreshTokenController:', () => {

    const fakeError = new Error('mock error');
    let token;

    beforeEach(() => {
        token = new RefreshTokenController({});
    });

    describe('cria()', () => {

        test('deve chamar crypto.randomBytes.toString e whitelist.adiciona', async () => {

            jest.useFakeTimers();
            jest.setSystemTime(0);

            token.services.adiciona = jest.fn();

            const retorno = await token.cria(10);

            expect(crypto.randomBytes).toHaveBeenCalledTimes(1);
            expect(crypto.randomBytes).toHaveBeenCalledWith(24);
            expect(token.services.adiciona).toHaveBeenCalledTimes(1);
            expect(token.services.adiciona).toHaveBeenCalledWith('token',10,432000000);
            expect(retorno).toBe('token');
        });

        test('deve lancar um erro', async () => {

            token.services.adiciona = jest.fn().mockRejectedValue(fakeError);

            await expect(token.cria()).rejects.toThrow('mock error');
        });
    });

    describe('verifica()', () => {

        test('deve chamar services.buscaValor, verificaEnviado e verificaValido', async () => {

            token.verificaEnviado = jest.fn();
            token.verificaValido = jest.fn();
            token.services.buscaValor = jest.fn().mockResolvedValue(10);

            const retorno = await token.verifica('token');

            expect(token.verificaEnviado).toHaveBeenCalledTimes(1);
            expect(token.verificaEnviado).toHaveBeenCalledWith('token');
            expect(token.services.buscaValor).toHaveBeenCalledTimes(1);
            expect(token.services.buscaValor).toHaveBeenCalledWith('token');
            expect(token.verificaValido).toHaveBeenCalledTimes(1);
            expect(token.verificaValido).toHaveBeenCalledWith(10);
            expect(retorno).toBe(10);
        });

        test('deve lancar um erro', async () => {

            token.verificaEnviado = jest.fn();
            token.services.buscaValor = jest.fn().mockRejectedValue(fakeError);

            await expect(token.verifica('')).rejects.toThrow('mock error');
        });
    });

    describe('verificaValido()', () => {

        test('deve não retornar um erro', () => {

            expect(() => token.verificaValido(10)).not.toThrow();
        });

        test('deve lancar um Error se id não valido', async () => {

            expect(() => token.verificaValido(false)).toThrow('Refresh token inválido!');
        });
    });

    describe('verificaEnviado()', () => {

        test('deve não retornar um erro', () => {

            expect(() => token.verificaEnviado('token')).not.toThrow();
        });

        test('deve lancar um Error se id não valido', async () => {

            expect(() => token.verificaEnviado(false)).toThrow('Refresh token não enviado!');
        });
    });

    describe('invalida()', () => {

        test('deve chamar blacklist.adiciona', async () => {

            token.services.apaga = jest.fn();

            await token.invalida('token');

            expect(token.services.apaga).toHaveBeenCalledTimes(1);
            expect(token.services.apaga).toHaveBeenCalledWith('token');
        });

        test('deve lancar um erro', async () => {

            token.services.apaga = jest.fn().mockRejectedValue(fakeError);

            await expect(token.invalida('')).rejects.toThrow('mock error');
        });
    });
});

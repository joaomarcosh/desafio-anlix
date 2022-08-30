const { TokenServices } = require('../../src/services');

jest.mock('redis',() => ({
    createClient: () => ({
        connect: jest.fn(),
        set: jest.fn(),
        expireAt: jest.fn(),
        get: jest.fn().mockResolvedValue('valor-retornado'),
        exists: jest.fn().mockResolvedValue(1),
        del: jest.fn(),
    }),
}));

describe('Testes para a classe TokenServices:', () => {

    let lista;
    const fakeError = new Error('mock error');

    beforeEach(() => {
        lista = new TokenServices('prefixo');
    });

    describe('adiciona()', () => {

        test('deve chamar os metodos set e expireAt', async () => {

            await lista.adiciona('chave', 'valor', 'data-expiracao');

            expect(lista.client.set).toHaveBeenCalledTimes(1);
            expect(lista.client.set).toHaveBeenCalledWith('prefixo:chave', 'valor');
            expect(lista.client.expireAt).toHaveBeenCalledTimes(1);
            expect(lista.client.expireAt).toHaveBeenCalledWith('prefixo:chave', 'data-expiracao');
        });

        test('deve lancar um erro', async () => {

            lista.client.set = jest.fn().mockRejectedValue(fakeError);

            await expect(lista.adiciona('')).rejects.toThrow('mock error');
        });
    });

    describe('buscaValor()', () => {

        test('deve chamar o metodo get', async () => {

            const resultado = await lista.buscaValor('chave');

            expect(lista.client.get).toHaveBeenCalledTimes(1);
            expect(lista.client.get).toHaveBeenCalledWith('prefixo:chave');
            expect(resultado).toBe('valor-retornado');
        });

        test('deve lancar um erro', async () => {

            lista.client.get = jest.fn().mockRejectedValue(fakeError);

            await expect(lista.buscaValor('')).rejects.toThrow('mock error');
        });
    });

    describe('contemChave()', () => {

        test('deve chamar o metodo exists', async () => {

            const resultado = await lista.contemChave('chave');

            expect(lista.client.exists).toHaveBeenCalledTimes(1);
            expect(lista.client.exists).toHaveBeenCalledWith('prefixo:chave');
            expect(resultado).toBe(true);
        });

        test('deve lancar um erro', async () => {

            lista.client.exists = jest.fn().mockRejectedValue(fakeError);

            await expect(lista.contemChave('')).rejects.toThrow('mock error');
        });
    });

    describe('apaga()', () => {

        test('deve chamar o metodo del', async () => {

            await lista.apaga('chave');

            expect(lista.client.del).toHaveBeenCalledTimes(1);
            expect(lista.client.del).toHaveBeenCalledWith('prefixo:chave');
        });

        test('deve lancar um erro', async () => {

            lista.client.del = jest.fn().mockRejectedValue(fakeError);

            await expect(lista.apaga('')).rejects.toThrow('mock error');
        });
    });
});
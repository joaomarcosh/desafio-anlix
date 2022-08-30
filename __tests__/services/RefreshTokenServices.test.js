const { RefreshTokenServices } = require('../../src/services');

jest.mock('redis',() => ({
    createClient: () => ({
        connect: jest.fn(),
    }),
}));

describe('Testes para a classe RefreshTokenServices:', () => {

    test('deve criar um objeto RefreshTokenServices', () => {

        const lista = new RefreshTokenServices();

        expect(lista).toBeInstanceOf(RefreshTokenServices);
        expect(lista.prefixo).toBe('whitelist');
    });
});
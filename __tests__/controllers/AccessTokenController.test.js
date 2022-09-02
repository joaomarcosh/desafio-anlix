const { AccessTokenController } = require('../../src/controllers');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('retorno'),
    verify: jest.fn().mockReturnValue({ id:10 }),
    JsonWebTokenError: jest.fn().mockImplementation((message) => ({
        message: message
    })),
}));

describe('Testes para a classe AccessTokenController:', () => {

    const fakeError = new Error('mock error');
    let token;

    beforeEach(() => {
        token = new AccessTokenController({});
    });

    describe('cria()', () => {

        test('deve chamar jwt.sign', () => {

            const retorno = token.cria(10);

            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(jwt.sign).toHaveBeenCalledWith({id: 10}, expect.any(String), {expiresIn: '15m'});
            expect(retorno).toBe('retorno');
        });

        test('deve lancar um erro', () => {

            jwt.sign = jest.fn().mockImplementation(() => {throw fakeError});

            expect(token.cria).toThrow('mock error');
        });
    });

    describe('verifica()', () => {

        test('deve chamar jwt.verify e verificaNaBlacklist', async () => {

            token.verificaNaBlacklist = jest.fn();

            const retorno = await token.verifica('token');

            expect(token.verificaNaBlacklist).toHaveBeenCalledTimes(1);
            expect(token.verificaNaBlacklist).toHaveBeenCalledWith('token');
            expect(jwt.verify).toHaveBeenCalledTimes(1);
            expect(jwt.verify).toHaveBeenCalledWith('token', expect.any(String));
            expect(retorno).toBe(10);
        });

        test('deve lancar um erro', async () => {

            token.verificaNaBlacklist = jest.fn().mockRejectedValue(fakeError);

            await expect(token.verifica('')).rejects.toThrow('mock error');
        });
    });

    describe('verificaNaBlacklist()', () => {

        test('deve chamar services.contemToken', async () => {

            token.services.contemToken = jest.fn().mockResolvedValue(false);

            await token.verificaNaBlacklist('token');

            expect(token.services.contemToken).toHaveBeenCalledTimes(1);
            expect(token.services.contemToken).toHaveBeenCalledWith('token');
        });

        test('deve lancar um JsonWebTokenError se encontrar token na blacklist', async () => {

            token.services.contemToken = jest.fn().mockResolvedValue(true);

            try {
                await token.verificaNaBlacklist('');
            } catch(erro) {
                expect(erro.message).toBe('Access token inválido por logout!')
            }
        });

        test('deve lancar um erro', async () => {

            token.services.contemToken = jest.fn().mockRejectedValue(fakeError);

            await expect(token.verificaNaBlacklist('')).rejects.toThrow('mock error');
        });
    });

    describe('invalida()', () => {

        test('deve chamar services.adiciona', async () => {

            token.services.adiciona = jest.fn().mockReturnValue('retorno');

            const retorno = await token.invalida('token');

            expect(token.services.adiciona).toHaveBeenCalledTimes(1);
            expect(token.services.adiciona).toHaveBeenCalledWith('token');
            expect(retorno).toBe('retorno');
        });

        test('deve lancar um erro', async () => {

            token.services.adiciona = jest.fn().mockRejectedValue(fakeError);

            await expect(token.invalida('')).rejects.toThrow('mock error');
        });
    });
});

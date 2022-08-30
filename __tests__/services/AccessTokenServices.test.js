const { AccessTokenServices, TokenServices } = require('../../src/services');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

jest.mock('redis',() => ({
    createClient: () => ({
        connect: jest.fn(),
    }),
}));
jest.mock('crypto');
jest.mock('jsonwebtoken');

describe('Testes para a classe AccessTokenServices:', () => {

    const fakeError = new Error('mock error');
    let lista;

    beforeEach(() => {
        lista = new AccessTokenServices('prefixo');
    });

    afterEach(() => {
       jest.clearAllMocks();
    });

    describe('geraTokenHash()', () => {

        test('cria token', () => {

            const hashMock = {
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValueOnce('token-gerado'),
            };
            const createHashMock = jest.spyOn(crypto,'createHash')
                .mockImplementation(() => hashMock);

            const token = lista.geraTokenHash('token');

            expect(createHashMock).toHaveBeenCalledTimes(1);
            expect(createHashMock).toHaveBeenCalledWith('sha256');
            expect(hashMock.update).toHaveBeenCalledTimes(1);
            expect(hashMock.update).toHaveBeenCalledWith('token');
            expect(hashMock.digest).toHaveBeenCalledTimes(1);
            expect(hashMock.digest).toHaveBeenCalledWith('hex');
            expect(token).toBe('token-gerado');
        });

        test('deve lancar um erro', async () => {

            jest.spyOn(crypto,'createHash')
                .mockImplementation(() => {throw fakeError});

            expect(() => lista.geraTokenHash()).toThrow('mock error');
        });
    });

    describe('adiciona()', () => {

        test('deve chamar jwt.decode, geraTokenHash e super.adiciona', async () => {

            const jwtMock = jest.spyOn(jwt,'decode')
                .mockImplementation(() => ({ exp: 1 }));

            const geraTokenHashMock = jest.spyOn(lista,'geraTokenHash')
                .mockImplementation(() => 'token');

            const TokenServicesMock = jest.spyOn(TokenServices.prototype, 'adiciona')
                .mockImplementation(() => jest.fn())

            await lista.adiciona('token');

            expect(jwtMock).toHaveBeenCalledTimes(1);
            expect(jwtMock).toHaveBeenCalledWith('token');
            expect(geraTokenHashMock).toHaveBeenCalledTimes(1);
            expect(geraTokenHashMock).toHaveBeenCalledWith('token');
            expect(TokenServicesMock).toHaveBeenCalledTimes(1);
            expect(TokenServicesMock).toHaveBeenCalledWith('token','',1);
        });

        test('deve lancar um erro', async () => {

            jest.spyOn(jwt,'decode')
                .mockImplementation(() => {throw fakeError});

            await expect(lista.adiciona('')).rejects.toThrow('mock error');
        });
    });

    describe('contemToken()', () => {

        test('deve chamar geraTokenHash e super.contemChave', async () => {

            const geraTokenHashMock = jest.spyOn(lista,'geraTokenHash')
                .mockImplementation(() => 'token');

            const TokenServicesMock = jest.spyOn(TokenServices.prototype, 'contemChave')
                .mockImplementation(() => 'resultado-retornado')

            const resultado = await lista.contemToken('token');

            expect(geraTokenHashMock).toHaveBeenCalledTimes(1);
            expect(geraTokenHashMock).toHaveBeenCalledWith('token');
            expect(TokenServicesMock).toHaveBeenCalledTimes(1);
            expect(TokenServicesMock).toHaveBeenCalledWith('token');
            expect(resultado).toBe('resultado-retornado');
        });

        test('deve lancar um erro', async () => {

            jest.spyOn(lista,'geraTokenHash')
                .mockImplementation(() => {throw fakeError});

            await expect(lista.contemToken('')).rejects.toThrow('mock error');
        });
    });
});
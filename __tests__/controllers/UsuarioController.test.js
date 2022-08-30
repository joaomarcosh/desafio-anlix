const { UsuarioController } = require('../../src/controllers');

describe('Testes para a classe UsuarioController:', () => {

    const fakeError = new Error('mock error');
    let controller;
    let req;
    let res;

    beforeEach(() => {

        controller = new UsuarioController({},{},{});

        req = {
            params: {},
            query: {},
            body: {},
            user: {
                id: 3,
            },
            token: 'token',
        };

        res = {
            json: jest.fn(),
            status: jest.fn(() => res),
            set: jest.fn(),
        };
    });

    describe('login()', () => {

        test('cria os tokens e retorna json com refresh token', async () => {

            controller.accessToken.cria = jest.fn().mockReturnValue('access-token');
            controller.refreshToken.cria = jest.fn().mockResolvedValue('refresh-token');

            await controller.login(req, res);

            expect(controller.accessToken.cria).toHaveBeenCalledTimes(1);
            expect(controller.accessToken.cria).toHaveBeenCalledWith(req.user.id);
            expect(controller.refreshToken.cria).toHaveBeenCalledTimes(1);
            expect(controller.refreshToken.cria).toHaveBeenCalledWith(req.user.id);
            expect(res.set).toHaveBeenCalledTimes(1);
            expect(res.set).toHaveBeenCalledWith('Authorization', 'access-token');
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ refreshToken: 'refresh-token' });
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.accessToken.cria = jest.fn();
            controller.refreshToken.cria = jest.fn().mockRejectedValue(fakeError);

            await controller.login(req, res);

            expect(controller.refreshToken.cria).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });

    describe('logout()', () => {

        test('invalida refresh token e retorna json com mensagem de logout', async () => {

            controller.accessToken.invalida = jest.fn();

            await controller.logout(req, res);

            expect(controller.accessToken.invalida).toHaveBeenCalledTimes(1);
            expect(controller.accessToken.invalida).toHaveBeenCalledWith('token');
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ mensagem: "logout efetuado com succeso!" });
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.accessToken.invalida = jest.fn().mockRejectedValue(fakeError);

            await controller.logout(req, res);

            expect(controller.accessToken.invalida).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });
});
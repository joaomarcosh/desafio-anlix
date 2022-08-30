const { LeituraController } = require('../../src/controllers');

describe('testes para a Classe LeituraController', () => {

    const fakeError = new Error('mock error');
    let controller;
    let req;
    let res;

    beforeEach(() => {

        controller = new LeituraController({});

        req = {
            params: {},
            query: {},
            body: {},
        };

        res = {
            json: jest.fn(),
            status: jest.fn(() => res),
        };
    });

    describe('pegaTodos()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.setCondicao = jest.fn();
            controller.services.pegaTodosOsRegistros = jest.fn().mockResolvedValue('leituras');

            await controller.pegaTodos(req, res);

            expect(controller.services.pegaTodosOsRegistros).toHaveBeenCalledTimes(1);
            expect(controller.services.setCondicao).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith('leituras');
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.setCondicao = jest.fn().mockRejectedValue(fakeError);

            await controller.pegaTodos(req, res);

            expect(controller.services.setCondicao).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });

    describe('pegaLeiturasRecentes()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.setCondicao = jest.fn();
            controller.services.pegaLeiturasRecentes = jest.fn().mockResolvedValue('leituras');

            await controller.pegaLeiturasRecentes(req, res);

            expect(controller.services.pegaLeiturasRecentes).toHaveBeenCalledTimes(1);
            expect(controller.services.setCondicao).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith('leituras');
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.setCondicao = jest.fn().mockRejectedValue(fakeError);

            await controller.pegaLeiturasRecentes(req, res);

            expect(controller.services.setCondicao).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });

    describe('pegaLeiturasRecentesParaUmPorTipo()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.setCondicao = jest.fn();
            controller.services.pegaTodosOsRegistros = jest.fn().mockResolvedValue('leituras');

            await controller.pegaLeiturasRecentesParaUmPorTipo(req, res);

            expect(controller.services.pegaTodosOsRegistros).toHaveBeenCalledTimes(1);
            expect(controller.services.setCondicao).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith('leituras');
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.setCondicao = jest.fn().mockRejectedValue(fakeError);

            await controller.pegaLeiturasRecentesParaUmPorTipo(req, res);

            expect(controller.services.setCondicao).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });
});

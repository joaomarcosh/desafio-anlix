const { Controller } = require('../../src/controllers');
const { RegistroNaoEncontradoError } = require('../../src/erros');
const { todosRegistros, novoRegistro, registroAtualizado } = require("../../__mocks__/db.mock");

describe('Testes para a classe Controller:', () => {

    let fakeError;
    let controller;
    let req;
    let res;

    beforeEach(() => {

        controller = new Controller({});

        req = {
            params: {
                id: 3,
            },
            query: {},
            body: {},
        };

        res = {
            json: jest.fn(),
            status: jest.fn(() => res),
        };

        fakeError = new Error('mock error')
    });

    describe('pegaTodos()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.pegaTodosOsRegistros = jest.fn().mockReturnValue(todosRegistros);

            await controller.pegaTodos(req, res);

            expect(controller.services.pegaTodosOsRegistros).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(todosRegistros);
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.pegaTodosOsRegistros = jest.fn().mockRejectedValue(fakeError);

            await controller.pegaTodos(req, res);

            expect(controller.services.pegaTodosOsRegistros).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });

    describe('pegaUm()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.pegaUmRegistroPorID = jest.fn().mockReturnValue(todosRegistros[0]);

            await controller.pegaUm(req, res);

            expect(controller.services.pegaUmRegistroPorID).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(todosRegistros[0]);
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.pegaUmRegistroPorID = jest.fn().mockRejectedValue(fakeError);

            await controller.pegaUm(req, res);

            expect(controller.services.pegaUmRegistroPorID).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });

    describe('criaUm()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.criaUmRegistro = jest.fn().mockReturnValue(novoRegistro);

            await controller.criaUm(req, res);

            expect(controller.services.criaUmRegistro).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(novoRegistro);
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.criaUmRegistro = jest.fn().mockRejectedValue(fakeError);

            await controller.criaUm(req, res);

            expect(controller.services.criaUmRegistro).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });

    describe('atualizaUm()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.atualizaUmRegistro = jest.fn();
            controller.services.pegaUmRegistroPorID = jest.fn().mockReturnValue(registroAtualizado);

            await controller.atualizaUm(req, res);

            expect(controller.services.atualizaUmRegistro).toHaveBeenCalledTimes(1);
            expect(controller.services.pegaUmRegistroPorID).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(registroAtualizado);
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.atualizaUmRegistro = jest.fn();
            controller.services.pegaUmRegistroPorID = jest.fn().mockRejectedValue(fakeError);

            await controller.atualizaUm(req, res);

            expect(controller.services.atualizaUmRegistro).toHaveBeenCalledTimes(1);
            expect(controller.services.pegaUmRegistroPorID).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });

    describe('apagaUm()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.apagaUmRegistro = jest.fn();

            await controller.apagaUm(req, res);

            expect(controller.services.apagaUmRegistro).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({mensagem: 'Registro com id 3 deletado'});
        });

        test('retorna um erro se nao encontrar um registro', async () => {

            fakeError = new RegistroNaoEncontradoError();

            controller.services.apagaUmRegistro = jest.fn().mockRejectedValue(fakeError);

            await controller.apagaUm(req, res);

            expect(controller.services.apagaUmRegistro).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'Registro não encontrado' });
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.apagaUmRegistro = jest.fn().mockRejectedValue(fakeError);

            await controller.apagaUm(req, res);

            expect(controller.services.apagaUmRegistro).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });
});

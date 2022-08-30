const { PacienteController } = require('../../src/controllers');
const { todosRegistros } = require("../../__mocks__/db.mock");

describe('Testes para a classe Controller:', () => {

    const fakeError = new Error('mock error');
    let controller;
    let req;
    let res;

    beforeEach(() => {

        controller = new PacienteController({});

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
    });

    describe('pegaTodos()', () => {

        test('chama o servico e retorna resultado do metodo json', async () => {

            controller.services.pegaPorNome = jest.fn().mockReturnValue(todosRegistros);

            await controller.pegaTodos(req, res);

            expect(controller.services.pegaPorNome).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(todosRegistros);
        });

        test('retorna um erro se o servico falhar', async () => {

            controller.services.pegaPorNome = jest.fn().mockRejectedValue(fakeError);

            await controller.pegaTodos(req, res);

            expect(controller.services.pegaPorNome).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ erro: 'mock error' });
        });
    });
});
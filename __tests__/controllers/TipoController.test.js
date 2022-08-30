const { TipoController } = require('../../src/controllers');

describe('testes para a Classe TipoController', () => {

    test('deve criar um objeto TipoController', () => {

        const controller = new TipoController({});

        expect(controller).toBeInstanceOf(TipoController);
        expect(controller.services).toMatchObject({});
    });
});

const { TipoServices } = require('../../src/services');

describe('testes para a Classe TipoServices', () => {

    test('deve criar um objeto TipoServices', () => {

        const services = new TipoServices({});

        expect(services).toBeInstanceOf(TipoServices);
        expect(services.nomeDoModelo).toBe('Tipos_Leituras');
        expect(services.db).toMatchObject({});
    });
});

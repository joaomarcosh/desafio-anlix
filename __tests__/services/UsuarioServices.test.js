const { UsuarioServices } = require('../../src/services');

describe('testes para a Classe UsuarioServices', () => {

    test('deve criar um objeto UsuarioServices', () => {

        const services = new UsuarioServices({});

        expect(services).toBeInstanceOf(UsuarioServices);
        expect(services.nomeDoModelo).toBe('Usuarios');
        expect(services.db).toMatchObject({});
    });
});
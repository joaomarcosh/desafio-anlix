const { PacienteServices } = require('../../src/services');
const { todosRegistros } = require("../../__mocks__/db.mock");

describe('Testes para a classe PacienteServices:', () => {

    const db = { Pacientes: {}, sequelize: {
        col: jest.fn(),
        fn: jest.fn(),
    }};
    let services;
    const fakeError = new Error('mock error');

    beforeEach(() => {
        services = new PacienteServices(db);
    });

    describe('pegaPorNome()', () => {

        test('deve retornar todos os registros', async () => {

            services.pegaTodosOsRegistros = jest.fn().mockResolvedValue(todosRegistros);
            services.db.sequelize.where = jest.fn().mockReturnValue('test');

            const registro = await services.pegaPorNome('test');

            expect(services.pegaTodosOsRegistros).toHaveBeenCalledTimes(1);
            expect(services.pegaTodosOsRegistros).toHaveBeenCalledWith({where: 'test'});
            expect(registro).toBe(todosRegistros);
        });

        test('deve lancar um erro', async () => {

            services.pegaTodosOsRegistros = jest.fn().mockRejectedValue(fakeError);

            await expect(services.pegaPorNome())
                .rejects.toThrow('mock error');
        });
    });
});
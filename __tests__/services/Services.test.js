const { Services } = require('../../src/services');
const { RegistroNaoEncontradoError } = require('../../src/erros');
const { todosRegistros, novoRegistro, registroAtualizado } = require('../../__mocks__/db.mock');

describe('Testes para a classe Services:', () => {

    const db = { tabela: {} };
    let services;
    const fakeError = new Error('mock error');

    beforeEach(() => {
        services = new Services(db, 'tabela');
    });

    describe('pegaTodosOsRegistros()', () => {

        test('deve retornar todos os registros', async () => {

            services.db.tabela.findAll = jest.fn().mockResolvedValue(todosRegistros);

            const registros = await services.pegaTodosOsRegistros();

            expect(services.db.tabela.findAll).toHaveBeenCalledTimes(1);
            expect(services.db.tabela.findAll).toHaveBeenCalledWith({});
            expect(registros).toBe(todosRegistros);
        });

        test('deve lancar um erro', async () => {

            services.db.tabela.findAll = jest.fn().mockRejectedValue(fakeError);

            await expect(services.pegaTodosOsRegistros()).rejects.toThrow('mock error');
        });
    });

    describe('pegaUmRegistro()', () => {

        test('deve retornar um registro', async () => {

            services.db.tabela.findOne = jest.fn().mockResolvedValue(todosRegistros[0]);

            const registro = await services.pegaUmRegistro({ where: { id: 1 } });

            expect(services.db.tabela.findOne).toHaveBeenCalledTimes(1);
            expect(services.db.tabela.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(registro).toBe(todosRegistros[0]);
        });

        test('deve lancar um erro', async () => {

            services.db.tabela.findOne = jest.fn().mockRejectedValue(fakeError);

            await expect(services.pegaUmRegistro({ where: { id: 1 } }))
                .rejects.toThrow('mock error');
        });

        test('deve lancar RegistroNaoEncontradoError se nao encontrar um registro', async () => {

            services.db.tabela.findOne = jest.fn().mockResolvedValue(null);

            await expect(services.pegaUmRegistro({ where: { id: 100 } }))
                .rejects.toThrow(RegistroNaoEncontradoError);
        });
    });

    describe('pegaUmRegistroPorID()', () => {

        test('deve retornar um registro', async () => {

            services.db.tabela.findByPk = jest.fn().mockResolvedValue(todosRegistros[0]);

            const registro = await services.pegaUmRegistroPorID(1);

            expect(services.db.tabela.findByPk).toHaveBeenCalledTimes(1);
            expect(services.db.tabela.findByPk).toHaveBeenCalledWith(1);
            expect(registro).toBe(todosRegistros[0]);
        });

        test('deve lancar um erro', async () => {

            services.db.tabela.findByPk = jest.fn().mockRejectedValue(fakeError);

            await expect(services.pegaUmRegistroPorID(1)).rejects.toThrow('mock error');
        });

        test('deve lancar RegistroNaoEncontradoError se nao encontrar um registro', async () => {

            services.db.tabela.findByPk = jest.fn().mockResolvedValue(null);

            await expect(services.pegaUmRegistroPorID(1))
                .rejects.toThrow(RegistroNaoEncontradoError);
        });
    });

    describe('criaUmRegistro()', () => {

        test('deve retornar um registro', async () => {

            services.db.tabela.create = jest.fn().mockResolvedValue(novoRegistro);

            const registro = await services.criaUmRegistro(novoRegistro);

            expect(services.db.tabela.create).toHaveBeenCalledTimes(1);
            expect(services.db.tabela.create).toHaveBeenCalledWith(novoRegistro);
            expect(registro).toBe(novoRegistro);
        });

        test('deve lancar um erro', async () => {

            services.db.tabela.create = jest.fn().mockRejectedValue(fakeError);

            await expect(services.criaUmRegistro(novoRegistro)).rejects.toThrow('mock error');
        });
    });

    describe('atualizaUmRegistro()', () => {

        test('deve retornar um registro atualizado', async () => {

            services.db.tabela.update = jest.fn().mockResolvedValue(registroAtualizado);

            const registro = await services
                .atualizaUmRegistro(3, { tipo_id: 1 });

            expect(services.db.tabela.update).toHaveBeenCalledTimes(1);
            expect(services.db.tabela.update).toHaveBeenCalledWith(
                { tipo_id: 1 },
                { where: { id: 3 } },
            );
            expect(registro).toBe(registroAtualizado);
        });

        test('deve lancar um erro', async () => {

            services.db.tabela.update = jest.fn().mockRejectedValue(fakeError);

            await expect(services.atualizaUmRegistro(3, { tipo_id: 1 }))
                .rejects.toThrow('mock error');
        });
    });

    describe('apagaUmRegistro()', () => {

        test('deve retornar 1', async () => {

            services.db.tabela.findByPk = jest.fn().mockResolvedValue(services.db.tabela);
            services.db.tabela.destroy = jest.fn().mockResolvedValue(1);

            const apagado = await services.apagaUmRegistro(3);

            expect(services.db.tabela.findByPk).toHaveBeenCalledTimes(1);
            expect(services.db.tabela.findByPk).toHaveBeenCalledWith(3);
            expect(services.db.tabela.destroy).toHaveBeenCalledTimes(1);
            expect(services.db.tabela.destroy).toHaveBeenCalledWith();
            expect(apagado).toBe(1);
        });

        test('deve lancar um erro', async () => {

            services.db.tabela.findByPk = jest.fn().mockResolvedValue(services.db.tabela);
            services.db.tabela.destroy = jest.fn().mockRejectedValue(fakeError);

            await expect(services.apagaUmRegistro(3)).rejects.toThrow('mock error');
        });
    });
});

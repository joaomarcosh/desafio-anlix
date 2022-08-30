const { LeituraServices } = require('../../src/services');
const { todosRegistros, leiturasRecentesQueryString } = require('../../__mocks__/db.mock');

jest.mock('sequelize', () => ({
    Op: {
        gte: 'gte',
        lte: 'lte',
        substring: 'substring',
    }
}));

describe('Testes para a classe LeituraServices:', () => {

    const db = { Pacientes: {}, Leituras: {}, sequelize: {
        QueryTypes: { SELECT: 'SELECT' },
        fn: jest.fn(),
        col: jest.fn(),
    }};
    let services;
    const fakeError = new Error('mock error');

    beforeEach(() => {
        services = new LeituraServices(db);
    });

    describe('pegaLeiturasRecentes()', () => {

        test('deve retornar todos registros recentes', async () => {

            services.db.sequelize.query = jest.fn().mockResolvedValue(todosRegistros);

            const registros = await services.pegaLeiturasRecentes('');

            expect(services.db.sequelize.query).toHaveBeenCalledTimes(1);
            expect(services.db.sequelize.query).toHaveBeenCalledWith(
                leiturasRecentesQueryString(''),
                { type: 'SELECT' }
            );
            expect(registros).toBe(todosRegistros);
        });

        test('deve lancar um erro', async () => {

            services.db.sequelize.query = jest.fn().mockRejectedValue(fakeError);

            await expect(services.pegaLeiturasRecentes(''))
                .rejects.toThrow('mock error');
        });
    });

    describe('setCondicao()', () => {

        test('deve retornar "" se chamado com params e query vazios', async () => {

            const condicao = await services.setCondicao({},{});

            expect(condicao).toBe('');
        });

        test(`deve retornar WHERE paciente_id = id se chamado com id no params`, async () => {

            const condicao = await services.setCondicao({ id: 1 },{});

            expect(condicao).toBe('WHERE paciente_id = 1');
        });

        test(`deve retornar WHERE paciente_id = id se chamado com nome na query`, async () => {

            services.pacientes.pegaUmRegistro = jest.fn().mockResolvedValue({id: 1});

            const condicao = await services.setCondicao({},{nome: 'tuberaldo'});

            expect(condicao).toBe('WHERE paciente_id = 1');
        });

        test(`deve retornar WHERE paciente_id = id se chamado com nome na query`, async () => {

            services.pacientes.pegaUmRegistro = jest.fn().mockResolvedValue({id: 1});

            const condicao = await services.setCondicao({},{nome: 'tuberaldo'});

            expect(condicao).toBe('WHERE paciente_id = 1');
        });

        test(`deve retornar WHERE date("data") = '2022-08-25' se chamado com data na query`, async () => {

            services.db.sequelize.where = jest.fn()
                .mockReturnValue(`WHERE date("data") = '2022-08-25'`);


            const condicao = await services.setCondicao({},{data: '2022-08-25'});

            expect(condicao).toBe(`WHERE date("data") = '2022-08-25'`);
        });

        test(`deve retornar data se chamado com dataIncial e dataFinal na query`, async () => {

            let condicao;

            condicao = await services.setCondicao({},{
                dataInicial: '2022-08-24',
                dataFinal: '2022-08-26',
            });

            expect(condicao).toMatchObject({
                data: {
                    lte: '2022-08-26',
                    gte: '2022-08-24',
                },
            });

            condicao = await services.setCondicao({},{
                dataInicial: '2022-08-24',
            });

            expect(condicao).toMatchObject({
                data: {
                    gte: '2022-08-24',
                },
            });

            condicao = await services.setCondicao({},{
                dataFinal: '2022-08-26',
            });

            expect(condicao).toMatchObject({
                data: {
                    lte: '2022-08-26',
                },
            });
        });

        test(`deve retornar valor se chamado com valorIncial e valorFinal na query`, async () => {

            let condicao;

            condicao = await services.setCondicao({},{
                valorInicial: 0.3,
                valorFinal: 0.6,
            });

            expect(condicao).toMatchObject({
                valor: {
                    lte: 0.6,
                    gte: 0.3,
                },
            });

            condicao = await services.setCondicao({},{
                valorInicial: 0.3,
            });

            expect(condicao).toMatchObject({
                valor: {
                    gte: 0.3,
                },
            });

            condicao = await services.setCondicao({},{
                valorFinal: 0.6,
            });

            expect(condicao).toMatchObject({
                valor: {
                    lte: 0.6,
                },
            });
        });

        test(`deve retornar paciente e tipo se chamado com paciente_id e 
        tipo_id no params`, async () => {

            const condicao = await services.setCondicao({
                paciente_id: 1,
                tipo_id: 1,
            },{});

            expect(condicao).toMatchObject({
                paciente_id: 1,
                tipo_id: 1,
            });
        });
    });
});

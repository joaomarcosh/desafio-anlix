const request = require('supertest');
const app = require('../../src/app');
const { novosTipos } = require('../../__mocks__/tipos/tipos.mock');
const { tipoRetornado } = require('../../__mocks__/tipos/tipoRetornado.mock');

describe('Testes para as rotas de Tipos:', () => {

    describe('GET /api/tipos', () => {

        test('retorna array com todos os tipos de leituras', async () => {

            let res = await request(app).get('/api/tipos');

            expect(res.statusCode).toBe(200);

            res.body.forEach(tipo => {
                expect(tipo).toMatchObject(tipoRetornado);
            });
        });
    });

    describe('GET /api/tipos/:id', () => {

        test('retorna tipo com id indicado', async () => {

            const res = await request(app).get('/api/tipos/2');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject(tipoRetornado);
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).get('/api/tipos/5');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('POST /api/tipos', () => {

        test.each(novosTipos)('cria um novo tipo de leitura', async (tipo) => {

            const res = await request(app).post('/api/tipos').send(tipo);

            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject(tipoRetornado);
        });

        test('retorna erro se campo vazio', async () => {

            const res = await request(app).post('/api/tipos').send([
                { descr_tipo: null }
            ]);

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'descr_tipo não pode ser nulo'
            });
        });
    });

    describe('PUT /api/tipos/:id', () => {

        test('retorna tipo com descricao atualizada', async () => {

            const res = await request(app).put('/api/tipos/2').send({
                descr_tipo: 'indice_ocular',
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject(tipoRetornado);
        });

        test('retorna erro se campo vazio', async () => {

            const res = await request(app).put('/api/tipos/2').send({
                descr_tipo: null,
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'descr_tipo não pode ser nulo'
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).put('/api/tipos/9').send({
                descr_tipo: 'indice',
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('DELETE /api/tipos/:id', () => {

        test('retorna mensagem sobre registro apagado', async () => {

            const res = await request(app).delete('/api/tipos/3');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                mensagem: 'Registro com id 3 deletado',
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).delete('/api/tipos/9');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });
});

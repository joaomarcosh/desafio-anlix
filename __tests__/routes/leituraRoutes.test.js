const request = require('supertest');
const app = require('../../src/app');
const { leituras } = require('../../__mocks__/leituras/leituras.mock');
const { leituraRetornada } = require('../../__mocks__/leituras/leituraRetornada.mock');

describe('Testes para as rotas de Leituras:', () => {

    describe('GET /api/leituras', () => {

        test('retorna array com todas as leituras', async () => {

            let res = await request(app).get('/api/leituras');

            expect(res.statusCode).toBe(200);

            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna todas leituras no intervalo de data indicado', async () => {

            let res = await request(app).get('/api/leituras?data=2021-06-01');

            expect(res.statusCode).toBe(200);

            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna todas leituras no intervalo de data indicado', async () => {

            let res = await request(app).get('/api/leituras?dataInicial=2021-06-01&dataFinal=2021-06-03');

            expect(res.statusCode).toBe(200);

            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna erro se leitura não encontrada', async () => {

            let res = await request(app).get('/api/leituras?data=2021-05-05');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: 'Registro não encontrado',
            });
        });
    });

    describe('GET /api/leituras/:id', () => {

        test('retorna leitura com id indicado', async () => {

            const res = await request(app).get('/api/leituras/2');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject(leituraRetornada);
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).get('/api/leituras/9');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('GET /api/leituras/:paciente_id/:tipo_id', () => {

        test('retorna leitura com paciente e tipo indicados', async () => {

            const res = await request(app).get('/api/leituras/1/1');

            expect(res.statusCode).toBe(200);
            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna leitura com paciente e tipo indicados no intervalo de data', async () => {

            const res = await request(app).get('/api/leituras/1/1?dataInicial=2021-06-01&dataFinal=2021-06-15');

            expect(res.statusCode).toBe(200);
            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).get('/api/leituras/1/3');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('GET /api/leituras/recentes', () => {

        test('retorna leituras mais recentes de todos pacientes', async () => {

            const res = await request(app).get('/api/leituras/recentes');

            expect(res.statusCode).toBe(200);
            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna leituras mais recentes para paciente com nome indicado', async () => {

            const res = await request(app).get('/api/leituras/recentes?nome=Caio');

            expect(res.statusCode).toBe(200);
            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).get('/api/leituras/recentes?nome=Tuberaldo');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('GET /api/leituras/recentes/:paciente_id', () => {

        test('retorna leituras recentes para paciente com id indicado', async () => {

            const res = await request(app).get('/api/leituras/recentes/1');

            expect(res.statusCode).toBe(200);
            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).get('/api/leituras/recentes/9');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('GET /api/leituras/recentes/:paciente_id/:tipo_id', () => {

        test('retorna leituras recentes para paciente e tipo indicados', async () => {

            const res = await request(app).get('/api/leituras/recentes/1/1');

            expect(res.statusCode).toBe(200);
            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna leituras recentes para paciente e tipo indicados entre intervalo de valor', async () => {

            const res = await request(app).get('/api/leituras/recentes/1/2?valorInicial=0.3&valorFinal=0.6');

            expect(res.statusCode).toBe(200);
            res.body.forEach(leitura => {
                expect(leitura).toMatchObject(leituraRetornada);
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).get('/api/leituras/recentes/9/9');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('POST /api/leituras', () => {

        test.each([
            leituras[0],
            leituras[1],
        ])('cria uma nova leitura', async (leitura) => {

            const res = await request(app).post('/api/leituras').send(leitura);

            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject(leituraRetornada);
        });

        test('retorna erro se campo vazio', async () => {

            const res = await request(app).post('/api/leituras').send([
                { valor: null }
            ]);

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'valor não pode ser nulo'
            });
        });
    });

    describe('PUT /api/leituras/:id', () => {

        test('retorna leitura com descricao atualizada', async () => {

            const res = await request(app).put('/api/leituras/2').send({
                valor: 0.99,
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                valor: 0.99,
            });
        });

        test('retorna erro se campo vazio', async () => {

            const res = await request(app).put('/api/leituras/2').send({
                valor: null,
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'valor não pode ser nulo'
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).put('/api/leituras/9').send({
                valor: 0.99,
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('DELETE /api/leituras/:id', () => {

        test('retorna mensagem sobre registro apagado', async () => {

            const res = await request(app).delete('/api/leituras/2');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                mensagem: 'Registro com id 2 deletado',
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).delete('/api/leituras/9');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });
});

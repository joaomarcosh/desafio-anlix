const request = require('supertest');
const app = require('../../src/app');
const { novosPacientes } = require('../../__mocks__/pacientes/pacientes.mock');
const { pacienteRetornado } = require('../../__mocks__/pacientes/pacienteRetornado.mock')

describe('Testes para as rotas de Pacientes:', () => {

    describe('GET /api/pacientes', () => {

        test('retorna array com todos os pacientes', async () => {

            let res = await request(app).get('/api/pacientes');

            expect(res.statusCode).toBe(200);

            res.body.forEach(paciente => {
                expect(paciente).toMatchObject(pacienteRetornado);
            });
        });

        test('retorna todos pacientes com nome indicado', async () => {

            let res = await request(app).get('/api/pacientes?nome=Caio');

            expect(res.statusCode).toBe(200);

            res.body.forEach(paciente => {
                expect(paciente).toMatchObject(pacienteRetornado);
            });
        });

        test('retorna erro se nome do paciente não encontrado', async () => {

            let res = await request(app).get('/api/pacientes?nome=Tuberaldo');

            expect(res.statusCode).toBe(500);
            expect(res.body).toMatchObject({
                erro: 'Registro não encontrado',
            });
        });
    });

    describe('GET /api/pacientes/:id', () => {

        test('retorna paciente com id indicado', async () => {

            const res = await request(app).get('/api/pacientes/2');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject(pacienteRetornado);
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).get('/api/pacientes/5');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('POST /api/pacientes', () => {

        test.each(novosPacientes)('cria um novo paciente', async (paciente) => {

            const res = await request(app).post('/api/pacientes').send(paciente);

            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject(pacienteRetornado);
        });

        test('retorna erro se campo vazio', async () => {

            const res = await request(app).post('/api/pacientes').send([
                { tipo_sanguineo: null }
            ]);

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'tipo_sanguineo não pode ser nulo'
            });
        });
    });

    describe('PUT /api/pacientes/:id', () => {

        test('retorna paciente com descricao atualizada', async () => {

            const res = await request(app).put('/api/pacientes/2').send({
                nome: 'José',
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                nome: 'José',
            });
        });

        test('retorna erro se campo vazio', async () => {

            const res = await request(app).put('/api/pacientes/2').send({
                nome: null,
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'nome não pode ser nulo'
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).put('/api/pacientes/9').send({
                nome: 'José',
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('DELETE /api/pacientes/:id', () => {

        test('retorna mensagem sobre registro apagado', async () => {

            const res = await request(app).delete('/api/pacientes/3');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                mensagem: 'Registro com id 3 deletado',
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).delete('/api/pacientes/9');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });
});

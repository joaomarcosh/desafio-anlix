const request = require('supertest');
const app = require('../../src/app');
const { novosUsuarios } = require('../../__mocks__/usuarios/usuarios.mock');
const { usuarioRetornado } = require('../../__mocks__/usuarios/usuarioRetornado.mock');

jest.unmock('redis');

describe('Testes para as rotas de Usuarios:', () => {

    describe('GET /api/usuarios', () => {

        test('retorna array com todos os usuarios', async () => {

            let res = await request(app).get('/api/usuarios');

            expect(res.statusCode).toBe(200);

            res.body.forEach(usuario => {
                expect(usuario).toMatchObject(usuarioRetornado);
            });
        });
    });

    describe('GET /api/usuarios/:id', () => {

        test('retorna usuario com id indicado', async () => {

            const res = await request(app).get('/api/usuarios/2');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject(usuarioRetornado);
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).get('/api/usuarios/5');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('POST /api/usuarios', () => {

        test.each(novosUsuarios)('cria um novo usuario', async (usuario) => {

            const res = await request(app).post('/api/usuarios').send(usuario);

            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject(usuarioRetornado);
        });

        test('retorna erro se campo vazio', async () => {

            const res = await request(app).post('/api/usuarios').send([
                { cargo: null }
            ]);

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'cargo não pode ser nulo'
            });
        });
    });

    describe('PUT /api/usuarios/:id', () => {

        test('retorna usuario com descricao atualizada', async () => {

            const res = await request(app).put('/api/usuarios/2').send({
                cargo: 'admin',
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject(usuarioRetornado);
        });

        test('retorna erro se campo vazio', async () => {

            const res = await request(app).put('/api/usuarios/2').send({
                cargo: null,
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'cargo não pode ser nulo'
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).put('/api/usuarios/5').send({
                cargo: 'dev',
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('DELETE /api/usuarios/:id', () => {

        test('retorna mensagem sobre registro apagado', async () => {

            const res = await request(app).delete('/api/usuarios/2');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                mensagem: 'Registro com id 2 deletado',
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).delete('/api/usuarios/5');

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Registro não encontrado",
            });
        });
    });

    describe('POST /login', () => {

        test('retorna accessToken no header e refreshToken no corpo', async () => {

            const res = await request(app).post('/login').send({
                usuario: 'usuario_1',
                senha: '123456',
            });

            expect(res.statusCode).toBe(200);
            expect(res.headers).toMatchObject({
                authorization: expect.any(String),
            });
            expect(res.body).toMatchObject({
                refreshToken: expect.any(String),
            });
        });

        test('retorna erro se registro nao existe', async () => {

            const res = await request(app).post('/login').send({
                usuario: 'usuario_5',
                senha: '123456',
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                erro: "Usuario ou senha invalidos",
            });
        });
    });

    describe('POST /refresh', () => {

        test('retorna novo accessToken e refreshToken', async () => {

            const resLogin = await request(app).post('/login').send({
                usuario: 'usuario_1',
                senha: '123456',
            });
            const { refreshToken } = resLogin.body;

            const res = await request(app).post('/refresh')
                .send({ refreshToken: refreshToken });

            expect(res.statusCode).toBe(200);
            expect(res.headers).toMatchObject({
                authorization: expect.any(String),
            });
            expect(res.body).toMatchObject({
                refreshToken: expect.any(String),
            });
        });

        test('retorna erro se refreshToken invalido', async () => {

            const res = await request(app).post('/refresh').send({
                refreshToken: 'invalido'
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                erro: 'Refresh token inválido!',
            });
        });
    });

    describe('POST /logout', () => {

        test('retorna mensagem de logout', async () => {

            const resLogin = await request(app).post('/login').send({
                usuario: 'usuario_1',
                senha: '123456',
            });
            const { refreshToken } = resLogin.body;
            const accessToken = resLogin.headers.authorization;

            const res = await request(app).post('/logout')
                .send({ refreshToken: refreshToken })
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                mensagem: "logout efetuado com succeso!",
            });
        });
    });
});

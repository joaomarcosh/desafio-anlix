const Estrategias = require('../../src/auth/Estrategias');
const bcrypt = require('bcryptjs');

jest.mock('bcryptjs', () => ({
    compareSync: jest.fn(),
}));

describe('Testes para a classe Estrategias:', () => {

    const fakeError = new Error('mock error');
    let estrategias;
    let done;

    beforeEach(() => {
        estrategias = new Estrategias({},{});
        done = jest.fn();
    });

    describe('localStrategyCallback()', () => {

        test('deve retornar done(null, usuario)', async () => {

            estrategias.usuarios.pegaUmRegistro = jest.fn().mockResolvedValue({
                senha: 'senha',
            });
            estrategias.senhaValida = jest.fn().mockReturnValue(true);

            await estrategias.localStrategyCallback('usuario', 'senha', done);

            expect(estrategias.usuarios.pegaUmRegistro).toHaveBeenCalledTimes(1);
            expect(estrategias.usuarios.pegaUmRegistro).toHaveBeenCalledWith({
                where: { usuario: 'usuario' }, raw: true, attributes: ['id', 'senha'],
            });
            expect(estrategias.senhaValida).toHaveBeenCalledTimes(1);
            expect(estrategias.senhaValida).toHaveBeenCalledWith('senha', 'senha');
            expect(done).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenCalledWith(null, { senha: 'senha' });
        });

        test('deve retornar done(null,false) se senha invalida', async () => {

            estrategias.usuarios.pegaUmRegistro = jest.fn().mockResolvedValue({
                senha: 'senha',
            });
            estrategias.senhaValida = jest.fn().mockReturnValue(false);

            await estrategias.localStrategyCallback('usuario', 'senha-invalida', done);

            expect(estrategias.usuarios.pegaUmRegistro).toHaveBeenCalledTimes(1);
            expect(estrategias.usuarios.pegaUmRegistro).toHaveBeenCalledWith({
                where: { usuario: 'usuario' }, raw: true, attributes: ['id', 'senha'],
            });
            expect(estrategias.senhaValida).toHaveBeenCalledTimes(1);
            expect(estrategias.senhaValida).toHaveBeenCalledWith('senha-invalida', 'senha');
            expect(done).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenCalledWith(null, false);
        });

        test('deve retornar done(erro, null)', async () => {

            estrategias.usuarios.pegaUmRegistro = jest.fn().mockRejectedValue(fakeError);

            await estrategias.localStrategyCallback('usuario', 'senha', done);

            expect(estrategias.usuarios.pegaUmRegistro).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenCalledWith(fakeError, null);
        });
    });

    describe('bearerStrategyCallback()', () => {

        test('deve retornar done(null, usuario, {token: token})', async () => {

            estrategias.accessToken.verifica = jest.fn().mockResolvedValue(10);
            estrategias.usuarios.pegaUmRegistroPorID = jest.fn().mockResolvedValue('usuario');

            await estrategias.bearerStrategyCallback('bearer-token', done);

            expect(estrategias.accessToken.verifica).toHaveBeenCalledTimes(1);
            expect(estrategias.accessToken.verifica).toHaveBeenCalledWith('bearer-token');
            expect(estrategias.usuarios.pegaUmRegistroPorID).toHaveBeenCalledTimes(1);
            expect(estrategias.usuarios.pegaUmRegistroPorID).toHaveBeenCalledWith(10, {raw:true});
            expect(done).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenCalledWith(null, 'usuario', { token: 'bearer-token' });
        });

        test('deve retornar done(erro, null)', async () => {

            estrategias.accessToken.verifica = jest.fn().mockRejectedValue(fakeError);

            await estrategias.bearerStrategyCallback('bearer-token', done);

            expect(estrategias.accessToken.verifica).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenCalledWith(fakeError, null);
        });
    });

    describe('senhaValida()', () => {

        test('deve chamar bcrypt.compare', () => {

            estrategias.senhaValida('senha', 'senha');

            expect(bcrypt.compareSync).toHaveBeenCalledTimes(1);
            expect(bcrypt.compareSync).toHaveBeenCalledWith('senha','senha');
        });

        test('deve lancar erro', () => {

            bcrypt.compareSync = jest.fn().mockImplementation(() => {throw fakeError});

            expect(() => estrategias.senhaValida()).toThrow('mock error');
        });
    });
});
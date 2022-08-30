const Middlewares = require('../../src/auth/Middlewares');
const passport = require('passport');

jest.mock('passport', () => ({}));

describe('Testes para a classe Middlewares', () => {

    let req;
    let res;
    let next;
    let middlewares;

    beforeEach(() => {

        req = {
            body: {},
        };

        res = {
            json: jest.fn(),
            status: jest.fn(() => res),
        };

        next = jest.fn();

        middlewares = new Middlewares({},{});
    });

    describe('local()', () => {

        function expectPassportCall() {
            expect(passport.authenticate).toHaveBeenCalledTimes(1);
            expect(passport.authenticate).toHaveBeenCalledWith(
                'local',
                {session: false},
                expect.any(Function)
            );
        }

        test('dever setar usuario e chamar next', () => {

            passport.authenticate = jest.fn()
                .mockImplementation((strategy,options,callback) => {
                    return jest.fn().mockImplementation(() => {
                        return callback(null,'usuario');
                    });
                })

            middlewares.local(req,res,next);

            expectPassportCall();
            expect(req.user).toBe('usuario');
            expect(next).toHaveBeenCalledTimes(1);
        });

        test('dever retonar codigo 500 e json com erro', () => {

            passport.authenticate = jest.fn()
                .mockImplementation((strategy,options,callback) => {
                    return jest.fn().mockImplementation(() => {
                        return callback({message: 'mock error'},'usuario');
                    });
                })

            middlewares.local(req,res,next);

            expectPassportCall();
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({erro: 'mock error'});
        });

        test('dever retonar codigo 401 se usuario falso', () => {

            passport.authenticate = jest.fn()
                .mockImplementation((strategy,options,callback) => {
                    return jest.fn().mockImplementation(() => {
                        return callback(null, false);
                    });
                })

            middlewares.local(req,res,next);

            expectPassportCall();
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith();
        });
    });

    describe('bearer()', () => {

        function expectPassportCall() {
            expect(passport.authenticate).toHaveBeenCalledTimes(1);
            expect(passport.authenticate).toHaveBeenCalledWith(
                'bearer',
                {session: false},
                expect.any(Function)
            );
        }

        test('dever setar usuario e token e chamar next', () => {

            passport.authenticate = jest.fn()
                .mockImplementation((strategy,options,callback) => {
                    return jest.fn().mockImplementation(() => {
                        return callback(null, 'usuario', {token: 'token'});
                    });
                })

            middlewares.bearer(req,res,next);

            expectPassportCall();
            expect(req.token).toBe('token');
            expect(req.user).toBe('usuario');
            expect(next).toHaveBeenCalledTimes(1);
        });

        test('dever retornar status 401 se erro no token jwt', () => {

            passport.authenticate = jest.fn()
                .mockImplementation((strategy,options,callback) => {
                    return jest.fn().mockImplementation(() => {
                        return callback({
                            name: 'JsonWebTokenError',
                            message: 'mock error',
                        }, null, null);
                    });
                })

            middlewares.bearer(req,res,next);

            expectPassportCall();
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({erro: 'mock error'});
        });

        test('dever retornar status 401 se token expirado', () => {

            passport.authenticate = jest.fn()
                .mockImplementation((strategy,options,callback) => {
                    return jest.fn().mockImplementation(() => {
                        return callback({
                            name: 'TokenExpiredError',
                            expiredAt: 'ontem',
                            message: 'mock error',
                        }, null, null);
                    });
                })

            middlewares.bearer(req,res,next);

            expectPassportCall();
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                erro: 'mock error',
                expiradoEm: 'ontem',
            });
        });

        test('dever retornar status 500 se erro', () => {

            passport.authenticate = jest.fn()
                .mockImplementation((strategy,options,callback) => {
                    return jest.fn().mockImplementation(() => {
                        return callback({message: 'mock error'}, null, null);
                    });
                })

            middlewares.bearer(req,res,next);

            expectPassportCall();
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({erro: 'mock error'});
        });

        test('dever retornar status 500 se erro', () => {

            passport.authenticate = jest.fn()
                .mockImplementation((strategy,options,callback) => {
                    return jest.fn().mockImplementation(() => {
                        return callback(null, null, null);
                    });
                })

            middlewares.bearer(req,res,next);

            expectPassportCall();
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith();
        });
    });

    describe('refresh()', () => {

        test('deve invalidar refresh token, setar usuario e chamar next', async () => {

            req.body.refreshToken = 'refresh-token';
            middlewares.refreshToken.verifica = jest.fn().mockResolvedValue(10);
            middlewares.refreshToken.invalida = jest.fn();
            middlewares.usuarios.pegaUmRegistroPorID = jest.fn().mockResolvedValue('usuario');

            await middlewares.refresh(req, res, next);

            expect(middlewares.refreshToken.verifica).toHaveBeenCalledTimes(1);
            expect(middlewares.refreshToken.verifica).toHaveBeenCalledWith('refresh-token');
            expect(middlewares.refreshToken.invalida).toHaveBeenCalledTimes(1);
            expect(middlewares.refreshToken.invalida).toHaveBeenCalledWith('refresh-token');
            expect(middlewares.usuarios.pegaUmRegistroPorID).toHaveBeenCalledTimes(1);
            expect(middlewares.usuarios.pegaUmRegistroPorID).toHaveBeenCalledWith(10);
            expect(req.user).toBe('usuario');
            expect(next).toHaveBeenCalledTimes(1);
        });

        test('deve retornar codigo 500 e json com erro', async () => {

            const fakeError = new Error('mock error');
            req.body.refreshToken = 'refresh-token';
            middlewares.refreshToken.verifica = jest.fn().mockRejectedValue(fakeError);

            await middlewares.refresh(req, res, next);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({erro: 'mock error'});
        });
    });
});
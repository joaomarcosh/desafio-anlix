const { Router } = require('express');
const { getUsuarioController, getUsuarioServices, getRefreshTokenController } = require('../factories');
const { Middlewares } = require('../auth');

const usuarioController = getUsuarioController();

const middlewares = new Middlewares(getRefreshTokenController(), getUsuarioServices());

const routes = Router();

routes
    .get('/api/usuarios', usuarioController.pegaTodos)
    .get('/api/usuarios/:id', usuarioController.pegaUm)
    .post('/api/usuarios', usuarioController.criaUm)
    .put('/api/usuarios/:id', usuarioController.atualizaUm)
    .delete('/api/usuarios/:id', usuarioController.apagaUm)
    .post('/login', middlewares.local, usuarioController.login)
    .post('/logout', [middlewares.refresh, middlewares.bearer], usuarioController.logout)
    .post('/refresh',middlewares.refresh, usuarioController.login);

module.exports = routes;

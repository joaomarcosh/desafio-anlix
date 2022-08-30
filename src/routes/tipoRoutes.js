const { Router } = require('express');
const { getTipoController } = require('../factories');

const tipoController = getTipoController();
const routes = Router();

routes
    .get('/api/tipos', tipoController.pegaTodos)
    .get('/api/tipos/:id', tipoController.pegaUm)
    .post('/api/tipos', tipoController.criaUm)
    .put('/api/tipos/:id', tipoController.atualizaUm)
    .delete('/api/tipos/:id', tipoController.apagaUm);

module.exports = routes;

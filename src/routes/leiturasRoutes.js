const { Router } = require('express');
const { getLeituraController } = require('../factories');

const leituraController = getLeituraController();
const routes = Router();

routes
    .get('/api/leituras', leituraController.pegaTodos)
    .get('/api/leituras/recentes/:paciente_id/:tipo_id',leituraController.pegaLeiturasRecentesParaUmPorTipo)
    .get('/api/leituras/recentes',leituraController.pegaLeiturasRecentes)
    .get('/api/leituras/recentes/:id',leituraController.pegaLeiturasRecentes)
    .get('/api/leituras/:paciente_id/:tipo_id',leituraController.pegaTodos)
    .get('/api/leituras/:id', leituraController.pegaUm)
    .post('/api/leituras', leituraController.criaUm)
    .put('/api/leituras/:id', leituraController.atualizaUm)
    .delete('/api/leituras/:id', leituraController.apagaUm);

module.exports = routes;

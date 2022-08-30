const { Router } = require('express');
const { getPacienteController } = require('../factories');

const pacienteController = getPacienteController();
const routes = Router();

routes
    .get('/api/pacientes', pacienteController.pegaTodos)
    .get('/api/pacientes/:id', pacienteController.pegaUm)
    .post('/api/pacientes', pacienteController.criaUm)
    .put('/api/pacientes/:id', pacienteController.atualizaUm)
    .delete('/api/pacientes/:id', pacienteController.apagaUm);

module.exports = routes;

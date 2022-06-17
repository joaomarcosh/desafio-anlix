const { Router } = require('express');

const routes = Router();

const PacienteController = require('../controllers/PacienteController')
const TipoController = require('../controllers/TipoController')
const LeituraController = require('../controllers/LeituraController')

routes.get("/",(req,res) => {
  res.status(200).json({ mensagem: "👍" });
})

routes
    .get('/pacientes', PacienteController.pegaPacientes)
    .get('/pacientes/:id', PacienteController.pegaPaciente)
    .post('/pacientes', PacienteController.criaPaciente)
    .put('/pacientes/:id', PacienteController.atualizaPaciente)
    .delete('/pacientes/:id', PacienteController.apagaPaciente)
    

routes
    .get('/tipos', TipoController.pegaTipos)
    .get('/tipos/:id', TipoController.pegaTipo)
    .post('/tipos', TipoController.criaTipo)
    .put('/tipos/:id', TipoController.atualizaTipo)
    .delete('/tipos/:id', TipoController.apagaTipo)

routes
    .get('/leituras', LeituraController.pegaLeituras)
    .get('/leituras/recentes/:paciente_id/:tipo_id',LeituraController.pegaLeiturasRecentesParaUmPorTipo)
    .get('/leituras/recentes',LeituraController.pegaLeiturasRecentesParaTodos)
    .get('/leituras/recentes/:id',LeituraController.pegaLeiturasRecentesParaUm)
    .get('/leituras/:paciente_id/:tipo_id',LeituraController.pegaLeiturasParaUmPorTipo)
    .get('/leituras/:id', LeituraController.pegaLeitura)
    .post('/leituras', LeituraController.criaLeitura)
    .put('/leituras/:id', LeituraController.atualizaLeitura)
    .delete('/leituras/:id', LeituraController.apagaLeitura)

module.exports = routes;
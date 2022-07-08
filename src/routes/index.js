const { Router } = require('express');
const path = require('path');

const routes = Router();

const PacienteController = require('../controllers/PacienteController');
const TipoController = require('../controllers/TipoController');
const LeituraController = require('../controllers/LeituraController');
const UsuarioController = require('../controllers/UsuarioController');

routes
    .get('/', (req,res) => {
      res.sendFile(path.join(__dirname,'../page/index.html'))
    });

routes
    .get('/api/pacientes', PacienteController.pegaPacientes)
    .get('/api/pacientes/:id', PacienteController.pegaPaciente)
    .post('/api/pacientes', PacienteController.criaPaciente)
    .put('/api/pacientes/:id', PacienteController.atualizaPaciente)
    .delete('/api/pacientes/:id', PacienteController.apagaPaciente);

routes
    .get('/api/tipos', TipoController.pegaTipos)
    .get('/api/tipos/:id', TipoController.pegaTipo)
    .post('/api/tipos', TipoController.criaTipo)
    .put('/api/tipos/:id', TipoController.atualizaTipo)
    .delete('/api/tipos/:id', TipoController.apagaTipo);

routes
    .get('/api/leituras', LeituraController.pegaLeituras)
    .get('/api/leituras/recentes/:paciente_id/:tipo_id',LeituraController.pegaLeiturasRecentesParaUmPorTipo)
    .get('/api/leituras/recentes',LeituraController.pegaLeiturasRecentesParaTodos)
    .get('/api/leituras/recentes/:id',LeituraController.pegaLeiturasRecentesParaUm)
    .get('/api/leituras/:paciente_id/:tipo_id',LeituraController.pegaLeiturasParaUmPorTipo)
    .get('/api/leituras/:id', LeituraController.pegaLeitura)
    .post('/api/leituras', LeituraController.criaLeitura)
    .put('/api/leituras/:id', LeituraController.atualizaLeitura)
    .delete('/api/leituras/:id', LeituraController.apagaLeitura);

routes
    .get('/api/usuarios', UsuarioController.pegaUsuarios)
    .get('/api/usuarios/:id', UsuarioController.pegaUsuario)
    .post('/api/usuarios', UsuarioController.criaUsuario)
    .put('/api/usuarios/:id', UsuarioController.atualizaUsuario)
    .delete('/api/usuarios/:id', UsuarioController.apagaUsuario);

module.exports = routes;
const express = require('express');
const pacientes = require('./pacienteRoutes');
const tipos = require('./tipoRoutes');
const leituras = require('./leiturasRoutes');
const usuarios = require('./usuarioRoutes');
const page = require('./pageRoutes');
const seed = require('./seedRoutes');
const path = require("path");

function routes(app) {
    app.use(
        express.json(),
        express.static('src/page/dashboard'),
        express.static('src/page/login'),
        pacientes,
        tipos,
        leituras,
        usuarios,
        page,
        seed
    );
}

module.exports = routes;

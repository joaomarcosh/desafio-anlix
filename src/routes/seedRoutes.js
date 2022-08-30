const { Router } = require('express');
const Seeder = require("../../seeders");

const routes = Router();

routes
    .get('/seed', Seeder.limpaCriaTudo);

module.exports = routes;

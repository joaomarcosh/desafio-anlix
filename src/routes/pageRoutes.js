const { Router } = require('express');
const { Middlewares } = require('../auth');
const path = require("path");
const { getUsuarioServices, getRefreshTokenController } = require('../factories');

const middlewares = new Middlewares(getRefreshTokenController(), getUsuarioServices());

const routes = Router();

routes
    .get('/', (req,res) => {
        res.sendFile(path.join(__dirname,'../page/login/login.html'))
    })
    .get('/dashboard', middlewares.bearer, (req,res) => {
        res.status(200).sendFile(path.join(__dirname,'../page/main/index.html'))
    });

module.exports = routes;

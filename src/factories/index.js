const {
    PacienteController,
    TipoController,
    LeituraController,
    UsuarioController,
    AccessTokenController,
    RefreshTokenController
} = require('../controllers');
const {
    PacienteServices,
    TipoServices,
    LeituraServices,
    UsuarioServices,
    AccessTokenServices,
    RefreshTokenServices,
} = require('../services');
const database = require('../models');

function getPacienteController(services = getPacienteServices()) {
    return new PacienteController(services);
}

function getPacienteServices(db = database) {
    return new PacienteServices(db);
}

function getTipoController(services = getTipoServices()) {
    return new TipoController(services);
}

function getTipoServices(db = database) {
    return new TipoServices(db);
}

function getLeituraController(services = getLeituraServices()) {
    return new LeituraController(services);
}

function getLeituraServices(db = database) {
    return new LeituraServices(db);
}

function getUsuarioController(
    services = getUsuarioServices(),
    accessToken = getAccessTokenController(),
    refreshToken = getRefreshTokenController()
) {
    return new UsuarioController(services, accessToken, refreshToken);
}

function getUsuarioServices(db = database) {
    return new UsuarioServices(db);
}

function getAccessTokenController(services = getAccessTokenServices()) {
    return new AccessTokenController(services);
}

function getAccessTokenServices() {
    return new AccessTokenServices();
}

function getRefreshTokenController(services = getRefreshTokenServices()) {
    return new RefreshTokenController(services);
}

function getRefreshTokenServices() {
    return new RefreshTokenServices();
}

module.exports = {
    getPacienteController,
    getTipoController,
    getLeituraController,
    getUsuarioController,
    getAccessTokenController,
    getRefreshTokenController,
    getUsuarioServices,
};
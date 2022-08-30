const Estrategias = require('./Estrategias');
const Middlewares = require('./Middlewares');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const { getAccessTokenController, getUsuarioServices } = require('../factories');

const estrategias = new Estrategias(getAccessTokenController(), getUsuarioServices());

passport.use(
    'local',
    new LocalStrategy(
        {
            usernameField: 'usuario',
            passwordField: 'senha',
            session: false
        },
        estrategias.localStrategyCallback
    )
);

passport.use(
    new BearerStrategy(
        'bearer',
        estrategias.bearerStrategyCallback
    ),
);

module.exports = { Estrategias, Middlewares };

const express = require('express');
const routes = require('./routes');
const path = require('path');
const { estrategiasAutenticacao } = require('./middlewares');

app = express();

app.use(express.json());
app.use(routes);
app.use(express.static(path.join(__dirname,'page')));

module.exports = app;
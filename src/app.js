const express = require('express');
const routes = require('./routes');
const path = require('path');
require('./middlewares');

app = express();

app.use(express.json());
app.use(routes);
app.use(express.static(path.join(__dirname,'page/login')));
app.use(express.static(path.join(__dirname,'page/main')));

module.exports = app;
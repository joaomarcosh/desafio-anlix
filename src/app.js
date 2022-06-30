const express = require('express');
const routes = require('./routes');
const path = require('path');

app = express();

app.use(express.json());
app.use(routes);
app.use(express.static(path.join(__dirname,'page')));

module.exports = app;
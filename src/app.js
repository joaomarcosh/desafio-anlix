const express = require('express');
const routes = require('./routes');
require('./auth');

app = express();
routes(app);

module.exports = app;

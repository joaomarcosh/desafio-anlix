const express = require('express');
const routes = require('./routes');

server = express();

server.use(express.json());
server.use(routes);

server.listen(3000, () => {
  console.log("Ouvindo porta 3000");
})
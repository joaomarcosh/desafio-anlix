const express = require('express');
const routes = require('./routes');
const Seeder = require('./seeders');
const path = require('path');

server = express();

server.use(express.json());
server.use(routes);
server.use(express.static(path.join(__dirname,'page')));

server.listen(3000, () => {
  console.log("Ouvindo porta 3000");
});

//Seeder.limpaCriaTudo();
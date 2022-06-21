const express = require('express');
const routes = require('./routes');
const Seeder = require('../seeders');
const path = require('path');

server = express();

server.use(express.json());
server.use(routes);
server.use(express.static(path.join(__dirname,'page')));

const port = process.env.PORT || 3000;

server.listen(port, async () => {
	const argumentos = process.argv;
    const seed = argumentos[2];
	if (seed === "-S") await Seeder.limpaCriaTudo();
	console.log(`Ouvindo porta ${port}`);
});


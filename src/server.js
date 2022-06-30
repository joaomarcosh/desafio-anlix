const app = require('./app')
const Seeder = require('../seeders');

const port = process.env.PORT || 3000;

app.listen(port, async () => {
	const argumentos = process.argv;
    const seed = argumentos[2];
	if (seed === "-S") await Seeder.limpaCriaTudo();
	console.log(`Ouvindo porta ${port}`);
});

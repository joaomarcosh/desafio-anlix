const app = require('./app')

const port = process.env.PORT || 3000;

app.listen(port, async () => {
	console.log(`Ouvindo porta ${port}`);
});

const db = require('./src/models');
const { usuarios } = require('./__mocks__/usuarios/usuarios.mock');
const { pacientes } = require('./__mocks__/pacientes/pacientes.mock');
const { tipos } = require('./__mocks__/tipos/tipos.mock');
const { leituras } = require('./__mocks__/leituras/leituras.mock');
const redisClientSingleton = require('./src/redis');

module.exports = async () => {
    await db.sequelize.sync({ force: true });
    await db['Usuarios'].bulkCreate(usuarios);
    await db['Pacientes'].bulkCreate(pacientes);
    await db['Tipos_Leituras'].bulkCreate(tipos);
    await db['Leituras'].bulkCreate(leituras);
    new redisClientSingleton();
};

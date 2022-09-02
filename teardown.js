const db = require('./src/models');
const redisClientSingleton = require('./src/redis');

module.exports = async () => {
    await db.sequelize.close();
    await redisClientSingleton._instance.disconnect();
    while (redisClientSingleton._instance.status === "connected") {
        await new Promise(r => setTimeout(r, 200));
    }
};

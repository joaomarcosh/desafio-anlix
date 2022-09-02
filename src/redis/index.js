const redis = require('redis');

class redisClientSingleton {
    constructor() {
        if (!redisClientSingleton._instance) {
            redisClientSingleton._instance = redis.createClient();
            (async () => {
                await redisClientSingleton._instance.connect();
            })();
        }
        return redisClientSingleton._instance;
    }

    static _instance;
}

module.exports = redisClientSingleton;

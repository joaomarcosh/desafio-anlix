const redis = jest.createMockFromModule('redis');

redis.createClient = jest.fn().mockReturnThis();
redis.connect = jest.fn();

module.exports = redis;
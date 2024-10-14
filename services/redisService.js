const redisClient = require('../config/redis');
const paramModel = require('../models/paramModel');

exports.registerParams = async () => {
    await redisClient.connect();
    const params = await paramModel.getAllParams();

    for (const param of params) {
        await redisClient.set(param.clave, param.valor);
    }

    await redisClient.quit();
};

exports.getParams = async () => {
    await redisClient.connect();
    const keys = await redisClient.keys('*');
    const params = {};

    for (const key of keys) {
        params[key] = await redisClient.get(key);
    }

    await redisClient.quit();
    return params;
};

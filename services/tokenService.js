const tokenModel = require('../models/tokenModel');
const tokenGenerator = require('../utils/tokenGenerator');

exports.generateToken = () => {

    // return tokenGenerator();
    const token = tokenGenerator(); // Aquí se llama el archivo que genera el token
    console.log('Token generado en service:', token); // Verifica si el token es válido
    return token;
};

exports.saveToken = async (token) => {
    await tokenModel.saveToken(token);
};

exports.validateToken = async (token) => {
    const result = await tokenModel.getToken(token);
    return result ? true : false;
};

exports.getAllTokens = async () => {
    return await tokenModel.getAllTokens();
};

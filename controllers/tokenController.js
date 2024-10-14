const tokenService = require('../services/tokenService');

exports.generateToken = async (req, res) => {
    try {
        const token = tokenService.generateToken();
        await tokenService.saveToken(token);
        res.status(201).json({ token });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: `Error al generar el token: ${error.message}`  });
    }
};

exports.validateToken = async (req, res) => {
    try {
        const { token } = req.body;
        const isValid = await tokenService.validateToken(token);
        res.status(200).json({ valid: isValid });
    } catch (error) {
        res.status(500).json({ error: 'Error al validar el token' });
    }
};

exports.getAllTokens = async (req, res) => {
    try {
        const tokens = await tokenService.getAllTokens();
        res.status(200).json({ tokens });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tokens' });
    }
};
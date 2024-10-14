const redisService = require('../services/redisService');

exports.registerParams = async (req, res) => {
    try {
        await redisService.registerParams();
        res.status(200).json({ message: 'Parámetros registrados en Redis' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar parámetros en Redis' });
    }
};

exports.getParams = async (req, res) => {
    try {
        const params = await redisService.getParams();
        res.status(200).json(params);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener parámetros' });
    }
};

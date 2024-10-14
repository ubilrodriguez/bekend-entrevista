const db = require('../config/database');

exports.getAllParams = async () => {
    const query = 'SELECT clave, valor FROM parametros_globales';
    const [rows] = await db.query(query);
    return rows;
};

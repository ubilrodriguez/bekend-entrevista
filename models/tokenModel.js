const db = require('../config/database');


exports.saveToken = async (token) => {
    console.log('Token:', token); // Verifica que el token 
    const tokenValue = token; // Cambia por el valor que quieras probar
    const query = `INSERT INTO tokens (token) VALUES ('${tokenValue}')`; // As
    

    await db.query(query, [token]);
};

exports.getToken = async (token) => {
    const query = 'SELECT * FROM tokens WHERE token = ?';
    const [rows] = await db.query(query, [token]);
    return rows[0];
};

exports.getAllTokens = async () => {
    const query = 'SELECT * FROM tokens';
    const [rows] = await db.query(query);
    return rows;
};

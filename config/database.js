// /config/database.js
require('dotenv').config(); // Cargar variables de entorno
const { Sequelize } = require('sequelize');

// Configuración de conexión a MySQL usando variables de entorno
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida con éxito.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

// Llamar a la función para probar la conexión
testConnection();

module.exports = sequelize;

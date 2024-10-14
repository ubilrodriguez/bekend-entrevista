// /config/redis.js
require('dotenv').config(); // Cargar variables de entorno
const Redis = require('ioredis');

// Configuración de conexión a Redis usando variables de entorno
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redis.on('connect', () => {
    console.log('Conexión a Redis establecida con éxito.');
});

redis.on('error', (err) => {
    console.error('Error de conexión a Redis:', err);
});

module.exports = redis;

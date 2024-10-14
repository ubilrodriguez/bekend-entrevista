require('dotenv').config(); // Para cargar las variables de entorno
const mysql = require('mysql2/promise');
const redis = require('redis');

// Configurar Redis
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Configuración de MySQL
const mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Función para registrar parámetros en Redis
async function registrarParametrosEnRedis() {
    try {
        // Conectar a Redis
        await redisClient.connect();
        console.log('Conectado a Redis correctamente');

        // Conectar a MySQL
        const connection = await mysqlConnection; // Se establece la conexión

        // Consultar todos los parámetros globales desde MySQL
        const [rows] = await connection.query('SELECT clave, valor FROM parametros_globales');

        // Guardar cada parámetro en Redis
        for (const row of rows) {
            await redisClient.set(row.clave, row.valor);
            console.log(`Parámetro registrado en Redis: ${row.clave} = ${row.valor}`);
        }

        console.log('Todos los parámetros han sido registrados en Redis');
    } catch (error) {
        console.error('Error al registrar parámetros en Redis:', error);
    } finally {
        // Cerrar la conexión a Redis
        await redisClient.quit();
    }
}

// Iniciar el microservicio y registrar parámetros
async function iniciarMicroservicio() {
    try {
        // Iniciar el servicio de MySQL
        console.log('Iniciando el microservicio de clientes...');
        await registrarParametrosEnRedis();
    } catch (error) {
        console.error('Error al iniciar el microservicio:', error);
    }
}

// Iniciar el servicio
iniciarMicroservicio();

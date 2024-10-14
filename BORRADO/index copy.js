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
        await redisClient.connect();
        console.log('Conectado a Redis correctamente');

        const connection = await mysqlConnection; // Se establece la conexión

        // Consultar todos los parámetros globales desde MySQL
        const [rows] = await connection.query('SELECT clave, valor FROM parametros_globales');

        for (const row of rows) {
            await redisClient.set(row.clave, row.valor);
            console.log(`Parámetro registrado en Redis: ${row.clave} = ${row.valor}`);
        }

        console.log('Todos los parámetros han sido registrados en Redis');
    } catch (error) {
        console.error('Error al registrar parámetros en Redis:', error);
    } finally {
        await redisClient.quit();
    }
}

// Función para consultar el parámetro de envío de correos
async function consultarParametroEnvioCorreos() {
    try {
        await redisClient.connect(); // Conectar a Redis

        // Consultar el parámetro de envío de correos
        const habilitarEnvioCorreos = await redisClient.get('habilitar_envio_correos');

        if (habilitarEnvioCorreos === 'true') {
            console.log('Se debe enviar el correo de bienvenida.');
            // Aquí puedes implementar la lógica para enviar el correo de bienvenida
        } else {
            console.log('No se enviará el correo de bienvenida.');
        }
    } catch (error) {
        console.error('Error al consultar el parámetro de envío de correos:', error);
    } finally {
        await redisClient.quit(); // Cerrar la conexión a Redis
    }
}

// Iniciar el microservicio y registrar parámetros
async function iniciarMicroservicio() {
    try {
        console.log('Iniciando el microservicio de clientes...');
        await registrarParametrosEnRedis();
        await consultarParametroEnvioCorreos(); // Llamar a la función para consultar el parámetro
    } catch (error) {
        console.error('Error al iniciar el microservicio:', error);
    }
}

// Iniciar el servicio
iniciarMicroservicio();

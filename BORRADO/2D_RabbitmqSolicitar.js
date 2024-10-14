require('dotenv').config(); // Cargar variables de entorno
const mysql = require('mysql2/promise');
const redis = require('redis');
const amqplib = require('amqplib');

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

// Función para enviar mensajes a RabbitMQ
async function enviarMensajeCorreo(correo) {
    try {
        const connection = await amqplib.connect('amqp://localhost'); // Conectar a RabbitMQ
        const channel = await connection.createChannel();
        const queue = 'cola_envio_correos'; // Nombre de la cola

        // Asegúrate de que la cola exista
        await channel.assertQueue(queue, { durable: true });

        // Crear el mensaje
        const mensaje = {
            tipo: 'bienvenida',
            correo: correo,
        };

        // Enviar el mensaje a la cola
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(mensaje)), {
            persistent: true,
        });

        console.log(`Mensaje enviado a la cola ${queue}:`, mensaje);
        
        // Cerrar el canal y la conexión
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error al enviar el mensaje a RabbitMQ:', error);
    }
}

// Función para registrar parámetros en Redis y enviar correo si corresponde
async function registrarParametrosEnRedisYEnviarCorreo() {
    try {
        await redisClient.connect();
        console.log('Conectado a Redis correctamente');

        const connection = await mysqlConnection;
        const [rows] = await connection.query('SELECT clave, valor FROM parametros_globales');

        for (const row of rows) {
            await redisClient.set(row.clave, row.valor);
            console.log(`Parámetro registrado en Redis: ${row.clave} = ${row.valor}`);
        }

        console.log('Todos los parámetros han sido registrados en Redis');

        // Consultar el parámetro de envío de correos
        const habilitarEnvioCorreos = await redisClient.get('habilitar_envio_correos');

        if (habilitarEnvioCorreos === 'true') {
            console.log('Se debe enviar el correo de bienvenida.');
            const correoDestino = 'ejemplo@correo.com'; // Reemplaza esto con el correo real
            await enviarMensajeCorreo(correoDestino); // Enviar mensaje a RabbitMQ
        } else {
            console.log('No se enviará el correo de bienvenida.');
        }
    } catch (error) {
        console.error('Error al registrar parámetros en Redis:', error);
    } finally {
        await redisClient.quit();
    }
}

// Iniciar el microservicio
async function iniciarMicroservicio() {
    try {
        console.log('Iniciando el microservicio de clientes...');
        await registrarParametrosEnRedisYEnviarCorreo();
    } catch (error) {
        console.error('Error al iniciar el microservicio:', error);
    }
}

// Ejecutar el microservicio
iniciarMicroservicio();

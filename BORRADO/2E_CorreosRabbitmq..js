const express = require('express');
const mysql = require('mysql2/promise');
const redis = require('redis');
const amqp = require('amqplib');
require('dotenv').config(); // Para cargar las variables de entorno

const app = express();
app.use(express.json()); // Para poder parsear JSON en las solicitudes

// Definir un token válido para la prueba
const VALID_TOKEN = 'mi_token_valido';

// Configuración de Redis
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Conectar a Redis
redisClient.connect().catch(console.error);

// Configuración de MySQL
const mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Función para enviar un mensaje a RabbitMQ
async function enviarMensajeRabbitMQ(mensaje) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'correo'; // Nombre de la cola

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(mensaje)), { persistent: true });

        console.log('Mensaje enviado a RabbitMQ:', mensaje);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error al enviar el mensaje a RabbitMQ:', error);
    }
}

// Endpoint para validar el token
app.post('/api/seguridad/validar-token', (req, res) => {
    const { token } = req.body;

    // Validar el token
    if (token === VALID_TOKEN) {
        return res.json({ valido: true });
    } else {
        return res.json({ valido: false });
    }
});

// Endpoint para registrar clientes
app.post('/api/clientes/registro', async (req, res) => {
    const { nombre, email, telefono, token } = req.body;

    try {
        // Validar el token en el mismo servicio
        if (token === VALID_TOKEN) {
            // Guardar en la base de datos
            const connection = await mysqlConnection;
            await connection.query('INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)', [nombre, email, telefono]);
            console.log('Cliente registrado en la base de datos.');

            // Consultar el parámetro de envío de correos en Redis
            const habilitarEnvioCorreos = await redisClient.get('habilitar_envio_correos');

            if (habilitarEnvioCorreos === 'true') {
                // Enviar mensaje a RabbitMQ para solicitar el envío de correo
                const mensaje = {
                    to: email,
                    subject: 'Bienvenido',
                    body: 'Gracias por registrarte.'
                };
                await enviarMensajeRabbitMQ(mensaje);
                console.log('Orden de envío de correo enviada a RabbitMQ.');
            }

            return res.status(201).json({ mensaje: 'Cliente registrado exitosamente.' });
        } else {
            return res.status(401).json({ mensaje: 'Token inválido.' });
        }
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        return res.status(500).json({ mensaje: 'Error en el registro del cliente.' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

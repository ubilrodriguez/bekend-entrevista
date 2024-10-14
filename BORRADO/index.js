const amqp = require('amqplib');
const mysql = require('mysql2/promise');
require('dotenv').config(); // Para cargar las variables de entorno

// Conexión a la base de datos MySQL
const mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Función para registrar los correos en la base de datos
async function registrarCorreoEnviado(destinatario, asunto, cuerpo) {
    try {
        const connection = await mysqlConnection;
        const query = 'INSERT INTO correos_enviados (destinatario, asunto, cuerpo) VALUES (?, ?, ?)';
        await connection.execute(query, [destinatario, asunto, cuerpo]);
        console.log('Correo registrado en la base de datos.');
    } catch (error) {
        console.error('Error al registrar el correo en la base de datos:', error);
    }
}

// Función para recibir mensajes de RabbitMQ
async function recibirMensajesRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'correo'; // Nombre de la cola donde se reciben los mensajes

        // Asegurar que la cola exista
        await channel.assertQueue(queue, { durable: true });

        console.log('Esperando mensajes de correo en RabbitMQ...');

        // Escuchar mensajes de la cola
        channel.consume(queue, async (mensaje) => {
            if (mensaje !== null) {
                const contenido = JSON.parse(mensaje.content.toString());

                const { to, subject, body } = contenido;
                console.log('Mensaje recibido:', contenido);

                // Registrar el correo en la base de datos
                await registrarCorreoEnviado(to, subject, body);

                // Confirmar que el mensaje ha sido procesado
                channel.ack(mensaje);
            }
        });
    } catch (error) {
        console.error('Error al recibir mensajes de RabbitMQ:', error);
    }
}

// Llamar a la función para comenzar a recibir mensajes
recibirMensajesRabbitMQ();

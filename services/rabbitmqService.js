const amqp = require('amqplib');

const rabbitmqURL = process.env.RABBITMQ_URL || 'amqp://localhost';

let connection;
let channel;

// Función para conectar a RabbitMQ
const connectRabbitMQ = async () => {
    if (!connection) {
        try {
            connection = await amqp.connect(rabbitmqURL);
            channel = await connection.createChannel();
            console.log('Conexión a RabbitMQ establecida con éxito.');
        } catch (error) {
            console.error('Error al conectar a RabbitMQ:', error);
            throw error;
        }
    }
};

// Función para enviar un mensaje
exports.sendMessage = async (message) => {
    try {
        await connectRabbitMQ(); // Asegúrate de que estamos conectados

        const queue = 'mi_cola'; // Cambia esto por el nombre de tu cola
        await channel.assertQueue(queue, { durable: false });

        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Mensaje enviado: ${message}`);
    } catch (error) {
        console.error('Error en sendMessage:', error);
        throw new Error('Error al enviar mensaje a RabbitMQ');
    }
};

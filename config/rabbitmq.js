const amqp = require('amqplib/callback_api');

// Asegúrate de definir la URL de RabbitMQ correctamente
const rabbitmqURL = process.env.RABBITMQ_URL || 'amqp://localhost';

const connectRabbitMQ = () => {
    amqp.connect(rabbitmqURL, function(error, connection) {
        if (error) {
            throw error;  // Esto lanza el error si la conexión falla
        }
        console.log('Conexión a RabbitMQ establecida con éxito.');
        // Aquí puedes continuar con el uso de la conexión
    });
};

module.exports = connectRabbitMQ;

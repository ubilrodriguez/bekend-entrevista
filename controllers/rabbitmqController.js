const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('myQueue', { durable: false });
}

connectRabbitMQ();

exports.sendMessage = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    channel.sendToQueue('myQueue', Buffer.from(message));
    return res.status(200).json({ status: 'Mensaje enviado', message });
};

exports.receiveMessages = async (req, res) => {
    const messages = [];
    
    channel.consume('myQueue', (msg) => {
        if (msg !== null) {
            messages.push(msg.content.toString());
            channel.ack(msg); // Acknowledge the message
        }
    });

    return res.status(200).json({ messages });
};

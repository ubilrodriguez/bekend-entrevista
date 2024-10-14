require('dotenv').config();
const express = require('express');
const tokenRoutes = require('./routes/tokenRoutes');
const bodyParser = require('body-parser'); // Asegúrate de importar body-parser

const redisRoutes = require('./routes/redisRoutes');
const rabbitmqRoutes = require('./routes/rabbitmqRoutes');

const app = express();
app.use(express.json());

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(bodyParser.json()); // Para analizar solicitudes JSON

// Registra las rutas
app.use('/', tokenRoutes);


app.use('/api/tokens', tokenRoutes);
app.use('/api/redis', redisRoutes);
app.use('/api/rabbitmq', rabbitmqRoutes);

// app.use('/api/tokens', tokenRoutes);
// app.use('/api/redis', redisRoutes);
// app.use('/api/rabbitmq', rabbitmqRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

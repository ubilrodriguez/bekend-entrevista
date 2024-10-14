const fastify = require('fastify')({ logger: true });
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:'); // Base de datos en memoria

// Crear tabla de tokens
db.serialize(() => {
  db.run("CREATE TABLE tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// Función para generar un token de 8 caracteres (alfanumérico)
function generarToken() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Letras y números
  let token = '';
  
  for (let i = 0; i < 8; i++) {
    const indice = Math.floor(Math.random() * caracteres.length); // Selecciona un índice aleatorio
    token += caracteres[indice]; // Añade el carácter correspondiente al token
  }
  
  return token; // Devuelve el token generado
}

// Endpoint para generar un token
fastify.post('/token', async (request, reply) => {
  const token = generarToken();

  // Insertar token en la base de datos
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO tokens (token) VALUES (?)", [token], function (err) {
      if (err) {
        return reject(reply.status(500).send({ error: 'Error al registrar el token' }));
      }
      fastify.log.info(`Token generado y registrado: ${token}`);
      resolve(reply.status(201).send({ token }));
    });
  });
});

// Endpoint para validar un token
fastify.post('/validate', async (request, reply) => {
  const { token } = request.body;

  // Verificar si el token está presente
  if (!token) {
    return reply.status(400).send({ error: 'Token no proporcionado' });
  }

  fastify.log.info(`Token recibido para validar: "${token.trim()}"`);

  return new Promise((resolve, reject) => {
    // Verificar si el token existe en la base de datos
    db.get("SELECT * FROM tokens WHERE token = ?", [token.trim()], (err, row) => {
      if (err) {
        fastify.log.error('Error al consultar la base de datos:', err);
        return reject(reply.status(500).send({ error: 'Error al validar el token' }));
      }

      fastify.log.info('Resultado de la consulta:', row);

      if (row) {
        resolve(reply.status(200).send({ valid: true, message: 'Token válido' }));
      } else {
        resolve(reply.status(401).send({ valid: false, message: 'Token no válido' }));
      }
    });
  });
});

// Endpoint para obtener todos los tokens registrados
fastify.get('/tokens', async (request, reply) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tokens", [], (err, rows) => {
      if (err) {
        return reject(reply.status(500).send({ error: 'Error al obtener los tokens' }));
      }
      resolve(reply.status(200).send({ tokens: rows }));
    });
  });
});

// Iniciar el servidor en el puerto 3000
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Microservicio de seguridad corriendo en http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

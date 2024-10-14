const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.json());

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
app.post('/token', (req, res) => {
  const token = generarToken();

  // Insertar token en la base de datos
  db.run("INSERT INTO tokens (token) VALUES (?)", [token], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar el token' });
    }

    console.log(`Token generado y registrado: ${token}`);
    res.status(201).json({ token });
  });
});
app.post('/validate', (req, res) => {
  console.log('Cuerpo de la solicitud:', req.body); // Para verificar qué está llegando en la solicitud

  const { token } = req.body; // Obtiene el token del cuerpo de la solicitud

  // Verificar si el token está presente
  if (!token) {
    return res.status(400).json({ error: 'Token no proporcionado' });
  }

  console.log(`Token recibido para validar: "${token.trim()}"`);

  // Verificar si el token existe en la base de datos
  db.get("SELECT * FROM tokens WHERE token = ?", [token.trim()], (err, row) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ error: 'Error al validar el token' });
    }

    console.log('Resultado de la consulta:', row);

    if (row) {
      return res.status(200).json({ valid: true, message: 'Token válido' });
    } else {
      return res.status(401).json({ valid: false, message: 'Token no válido' });
    }
  });
});

// Endpoint para obtener todos los tokens registrados
app.get('/tokens', (req, res) => {
  db.all("SELECT * FROM tokens", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los tokens' });
    }
    res.status(200).json({ tokens: rows });
  });
});

app.listen(port, () => {
  console.log(`Microservicio de seguridad corriendo en http://localhost:${port}`);
});

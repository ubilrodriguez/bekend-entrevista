-- 1. Definir la estructura de la tabla
-- Debes definir las columnas que tendrá la tabla para almacenar la información relevante de los envíos de correos. Aquí te dejo un ejemplo básico:

-- Posible Estructura de la Tabla:
-- id: Identificador único para cada envío.
-- to: Dirección de correo del destinatario.
-- subject: Asunto del correo.
-- body: Cuerpo o contenido del correo.
-- fecha_envio: Fecha y hora en que se registró el envío del correo.

-- 2. Crear la tabla en MySQL

CREATE TABLE correos_enviados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destinatario VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    cuerpo TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

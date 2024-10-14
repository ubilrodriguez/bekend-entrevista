-- 1. Crear la base de datos Infinity

CREATE DATABASE Infinity;


-- 2. Seleccionar la base de datos Infinity

USE Infinity;


-- 3. Crear la tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,    -- Identificador único del cliente
    nombre VARCHAR(255) NOT NULL,         -- Nombre del cliente
    email VARCHAR(255) UNIQUE NOT NULL,   -- Correo electrónico, debe ser único
    telefono VARCHAR(20),                 -- Número de teléfono (opcional)
    direccion TEXT,                       -- Dirección del cliente (opcional)
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de registro
);


-- 4. Crear la tabla de parametros_globales

CREATE TABLE parametros_globales (
    id INT AUTO_INCREMENT PRIMARY KEY,    -- Identificador único del parámetro
    clave VARCHAR(255) UNIQUE NOT NULL,   -- Clave del parámetro
    valor VARCHAR(255) NOT NULL,          -- Valor del parámetro
    descripcion TEXT,                     -- Descripción del parámetro
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de última actualización
);


-- 5. Insertar el parámetro para habilitar el envío de correos

INSERT INTO parametros_globales (clave, valor, descripcion) 
VALUES ('habilitar_envio_correos', 'true', 'Habilitar o deshabilitar el envío de correos de bienvenida a nuevos clientes.');






DROP DATABASE IF EXISTS GuramaOnline;
CREATE DATABASE GuramaOnline;
USE GuramaOnline;

CREATE TABLE rol_usuario (
  id_rol_usuario VARCHAR(20) PRIMARY KEY NOT NULL,
  nombre_rol VARCHAR(25) NOT NULL
);

CREATE TABLE tipo_documento (
  t_doc ENUM("CC", "CE", "TI") PRIMARY KEY NOT NULL,
  desc_doc ENUM("Cédula de ciudadanía", "Cédula de extranjería", "Tarjeta de identidad") NOT NULL
);

CREATE TABLE usuario (
  id_usuario VARCHAR(15) PRIMARY KEY NOT NULL,
  nom_1 VARCHAR(50) NOT NULL,
  nom_2 VARCHAR(50) NULL,
  ape_1 VARCHAR(50) NOT NULL,
  ape_2 VARCHAR(50) NULL,
  correo VARCHAR(40) NOT NULL,
  telefono BIGINT NOT NULL,
  contrasena VARCHAR(25) NOT NULL,
  codigo VARCHAR(10) unique,
  id_rol_usuario VARCHAR(20) NOT NULL,  
  t_doc ENUM("CC", "CE", "TI") NOT NULL, 

  FOREIGN KEY (id_rol_usuario) REFERENCES rol_usuario(id_rol_usuario),
  FOREIGN KEY (t_doc) REFERENCES tipo_documento(t_doc)
);

CREATE TABLE tipo_pedido (
  id_tipo ENUM("P-P", "P-E") PRIMARY KEY NOT NULL,
  tipo_pedido ENUM("Personalizado", "Estandar") NOT NULL
);

CREATE TABLE pedido (
  id_pedido INT(4) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  fecha DATETIME NOT NULL,
  estado VARCHAR(20) NOT NULL,
  id_usuario VARCHAR(15) NOT NULL, 
  id_tipo ENUM("P-P", "P-E") NOT NULL,

  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_tipo) REFERENCES tipo_pedido(id_tipo)
);

CREATE TABLE categoria (
  id_categoria INT(4) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nombre_c ENUM("Sabanas", "Cubrelechos", "Amigurumis", "Llaveros") NOT NULL,
  descripcion VARCHAR(60)
);

CREATE TABLE clasificacion (
  id_clasificacion INT(4) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nombre_clas ENUM("En oferta", "Mas vendidos", "Nuevos", "Ultimas unidades") NOT NULL
);

CREATE TABLE producto (
  id_producto INT(3) PRIMARY KEY NOT NULL AUTO_INCREMENT,  
  nom_producto VARCHAR(60) NOT NULL,
  precio_unitario INT(10) NOT NULL,
  stock_actual VARCHAR(45) NOT NULL,
  stock_minimo VARCHAR(45) NOT NULL,
  ultima_actualiz DATETIME NOT NULL,
  color VARCHAR(20) NULL,
  talla VARCHAR(20) NULL,
  tamaño VARCHAR(20) NULL,
  descripcion varchar(45) NOT NULL,
  id_categoria INT(4) NOT NULL,
  id_clasificacion int (4) NOT NULL,

  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
  FOREIGN KEY (id_clasificacion) REFERENCES clasificacion(id_clasificacion)
);

CREATE TABLE detalles_pedido (
  id_detalles INT(4) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  descrip_detalles VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL,
  id_pedido INT(4) NOT NULL, 
  id_producto INT(3) NOT NULL, 

  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE tipo_movimiento (
  id_m ENUM("M-E", "M-S") PRIMARY KEY NOT NULL,
  nom_movimiento ENUM("Entrada", "Salida") NOT NULL
);

CREATE TABLE movimiento (
  id_movimiento INT PRIMARY KEY NOT NULL AUTO_INCREMENT,  
  Cantidad_m INT(5) NOT NULL,
  fecha_m DATETIME,
  observaciones VARCHAR(80) NULL,
  id_m ENUM("M-E", "M-S") NOT NULL,
  id_producto INT(3) NOT NULL,
  id_usuario VARCHAR(15) NOT NULL,

  FOREIGN KEY (id_m) REFERENCES tipo_movimiento(id_m),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE metodo_pago (
  id_met_pago ENUM("Mtd-NQ", "Mtd-DP", "Mtd-TJ") PRIMARY KEY NOT NULL,
  nom_metodo ENUM("Nequi", "Daviplata", "Tarjeta") NOT NULL
);

CREATE TABLE estado_pago (
  id_estado ENUM("E-pt", "E-pd", "E-e") PRIMARY KEY NOT NULL,
  nom_metodo ENUM("Pendiente", "Pagado", "Enviado") NOT NULL
);

CREATE TABLE ticket_compra (
  id_ticket_c INT(6) PRIMARY KEY NOT NULL AUTO_INCREMENT, 
  num_ticket INT(6) UNIQUE NOT NULL,
  fecha_emision DATETIME NOT NULL,
  sub_total DECIMAL NOT NULL,
  total_ticket DECIMAL NOT NULL,
  id_pedido INT(4) NOT NULL,  
  id_estado ENUM("E-pt", "E-pd", "E-e") NOT NULL,
  id_met_pago ENUM("Mtd-NQ", "Mtd-DP", "Mtd-TJ") NOT NULL,

  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  FOREIGN KEY (id_estado) REFERENCES estado_pago(id_estado),
  FOREIGN KEY (id_met_pago) REFERENCES metodo_pago(id_met_pago)
);

-- ======================================
--                Inserts
-- ======================================

-- ROLES
INSERT INTO rol_usuario VALUES 
('admin', 'Administrador'),
('cliente', 'Cliente');

-- DOCUMENTO
INSERT INTO tipo_documento VALUES
('CC', 'Cédula de ciudadanía'),
('CE', 'Cédula de extranjería'),
('TI', 'Tarjeta de identidad');

-- USUARIOS
INSERT INTO usuario (id_usuario, nom_1, nom_2, ape_1, ape_2, correo, telefono, contrasena, id_rol_usuario, t_doc)
VALUES
('Us-01', 'Matthew', 'Sebestian', 'Mancera', 'Riaño', 'matteewma@gmail.com', 3103028623, 'd0K1isaToy', 'cliente', 'CC'),
('Us-02', 'David', 'Santiago', 'Gonzalez', '', 'sanun@gmail.com', 313456623, '123456', 'cliente', 'CE'),
('Us-03', 'Laura', 'Camila', 'Pérez', 'Gómez', 'laurap@gmail.com', 3101234567, 'laura123', 'cliente', 'CC'),
('Us-04', 'Andrés', 'Felipe', 'Martínez', 'Rojas', 'andresm@gmail.com', 3209876543, 'andres456', 'cliente', 'CC'),
('Us-05', 'Juliana', 'Paola', 'Rincón', 'Suárez', 'juli.rs@gmail.com', 3111112222, 'juli789', 'cliente', 'CE'),
('Us-06', 'Santiago', 'David', 'Moreno', 'Ortiz', 'santim@gmail.com', 3009988776, 'sanpass', 'cliente', 'TI'),
('Us-07', 'Valentina', '', 'Ruiz', 'Castro', 'valruiz@gmail.com', 3123456789, 'vale123', 'admin', 'CC'),
('Us-08', 'Carlos', 'Alberto', 'López', 'Jiménez', 'carloslj@gmail.com', 3152233445, 'carlpass', 'cliente', 'CE'),
('Us-09', 'Diana', 'Marcela', 'Torres', 'Beltrán', 'dianatb@gmail.com', 3133344556, 'diana22', 'cliente', 'CC'),
('Us-10', 'Fernando', 'José', 'Cano', 'Vargas', 'fercano@gmail.com', 3195566778, 'ferpass', 'cliente', 'CC'),
('Us-11', 'Tatiana', 'Lucía', 'Ramírez', '', 'tatilr@gmail.com', 3117788990, 'tati55', 'admin', 'CE'),
('Us-12', 'Esteban', 'Alexander', 'Mora', 'Pineda', 'estemora@gmail.com', 3108889997, 'esteban01', 'cliente', 'TI');

UPDATE usuario 
SET contrasena = 'hjasdygq23234'
WHERE id_usuario = 'Us-02';

SELECT * FROM usuario;

-- CATEGORIAS
INSERT INTO categoria (id_categoria, nombre_c, descripcion)
VALUES 
(1, 'Amigurumis', 'Muñecos tejidos'),
(2, 'Llaveros', 'Llaveros tejidos a mano'),
(3, 'Sabanas', 'Sabanas con encaje en todos los tamaños'),
(4, 'Cubrelechos', 'Cubrelechos con diseños');

-- CLASIFICACIONES
INSERT INTO clasificacion (id_clasificacion, nombre_clas)
VALUES 
(1, 'En oferta'),
(2, 'Mas vendidos'),
(3, 'Nuevos'),
(4, 'Ultimas unidades');

-- TIPO DE PEDIDO
INSERT INTO tipo_pedido (id_tipo, tipo_pedido)
VALUES 
(1, 'Estandar'),
(2, 'Personalizado');

-- PRODUCTOS
INSERT INTO producto (id_producto, nom_producto, precio_unitario, stock_actual, Stock_minimo, ultima_actualiz, color, talla, tamaño, descripcion, id_categoria, id_clasificacion)
VALUES
(1, 'Pikachu con iman', 15000, 25, 4, '2025-10-12 12:01:54', 'Azul', '', '30cm','', 2, 3),
(2, 'Gato en la luna', 35000, 15, 4, '2025-11-12 12:01:58', 'Blanco con negro', '', '15cm','', 1, 1),
(3, 'Blanco con detalles azules', 50000, 8, 4, '2025-11-12 12:01:58', '', 'Queen', '','',4, 2),
(4, 'Paw patrol', 28000, 20, 4, '2025-01-12 12:21:58', 'Cian', 'Individual', '', '',3, 1),
(5, 'Corazón', 12000, 40, 4, '2025-11-12 12:01:58', 'Rojo', '', '25cm','', 2, 3);

-- PEDIDOS
INSERT INTO pedido (id_pedido, fecha, estado, id_usuario, id_tipo)
VALUES
(1, '2025-10-10', 'Entregado', 'Us-04', 1),
(2, '2025-10-12', 'Pendiente', 'Us-03', 2),
(3, '2025-10-14', 'Entregado', 'Us-09', 1),
(4, '2025-10-15', 'Cancelado', 'Us-10', 2),
(5, '2025-09-30', 'Entregado', 'Us-01', 2);

-- DETALLES DE PEDIDO
INSERT INTO detalles_pedido (id_detalles, descrip_detalles, cantidad, id_pedido, id_producto)
VALUES
(1, '', 1, 1, 2),
(2, '', 1, 2, 1),
(3, '', 2, 3, 1),
(4, '', 3, 5, 3),
(5, '', 4, 4, 2),
(6, '', 5, 1, 4);

-- MOVIMIENTOS
INSERT INTO tipo_movimiento (id_m, nom_movimiento)
VALUES 
('M-E', 'Entrada'),
('M-S', 'Salida');

-- MÉTODOS DE PAGO
INSERT INTO metodo_pago (id_met_pago, nom_metodo)
VALUES
('Mtd-NQ', 'Nequi'),
('Mtd-DP', 'Daviplata'),
('Mtd-TJ', 'Tarjeta');

-- ESTADOS DE PAGO
INSERT INTO estado_pago (id_estado, nom_metodo)
VALUES
('E-pt', 'Pendiente'),
('E-pd', 'Pagado'),
('E-e', 'Enviado');

-- TICKETS DE COMPRA
INSERT INTO ticket_compra (id_ticket_c, num_ticket, fecha_emision, sub_total, total_ticket, id_pedido, id_estado, id_met_pago) 
VALUES
(1, 102030, '2025-10-12 12:01:54', 100000.00, 100000.00, 1, 'E-pd', 'Mtd-TJ'),
(2, 102031, '2025-10-13 19:08:24', 58.00, 58.00, 2, 'E-pt', 'Mtd-DP'),
(3, 102032, '2025-10-17 19:15:16', 225.00, 225.00, 3, 'E-e', 'Mtd-NQ'),
(4, 102033, '2025-10-17 19:20:38', 110.00, 110.00, 4, 'E-pd', 'Mtd-TJ'),
(5, 102034, '2025-10-17 19:27:08', 140.00, 140.00, 4, 'E-e', 'Mtd-NQ');

-- ==================================================
-- Propuesta final de las 10 consultas seleccionadas
-- ==================================================

-- 1. Total de productos vendidos por categoría

SELECT 
  c.nombre_c AS categoria,
  p.nom_producto AS producto,
  p.precio_unitario,
  COUNT(DISTINCT dp.id_pedido) AS pedidos_realizados,
  SUM(dp.cantidad) AS unidades_vendidas,
  SUM(dp.cantidad * p.precio_unitario) AS total_vendido
FROM detalles_pedido dp
JOIN producto p ON dp.id_producto = p.id_producto
JOIN categoria c ON p.id_categoria = c.id_categoria
GROUP BY c.nombre_c, p.nom_producto, p.precio_unitario
ORDER BY c.nombre_c, total_vendido DESC;

-- 2. Monto total vendido por cada método de pago

SELECT 
  u.id_usuario AS id_cliente,
  CONCAT(u.nom_1, ' ', u.ape_1) AS nombre_cliente,
  m.nom_metodo AS metodo_pago,
  SUM(t.total_ticket) AS monto_total
FROM ticket_compra t
INNER JOIN metodo_pago m ON t.id_met_pago = m.id_met_pago
INNER JOIN pedido p ON t.id_pedido = p.id_pedido
INNER JOIN usuario u ON p.id_usuario = u.id_usuario
GROUP BY u.id_usuario, u.nom_1, u.ape_1, m.nom_metodo
ORDER BY monto_total DESC;

-- 3. Usuarios que han realizado pedidos

SELECT 
  u.nom_1,
  u.ape_1,
  COUNT(p.id_pedido) AS cantidad_pedidos
FROM pedido p
INNER JOIN usuario u ON p.id_usuario = u.id_usuario
GROUP BY u.nom_1, u.ape_1
ORDER BY cantidad_pedidos DESC;

-- 4. Producto más y menos vendido

SELECT 
  p.nom_producto,
  SUM(d.cantidad) AS cantidad_vendida
FROM detalles_pedido d
INNER JOIN producto p ON d.id_producto = p.id_producto
GROUP BY p.nom_producto
ORDER BY cantidad_vendida DESC;

-- 5. Pedidos agrupados por estado de pago

SELECT 
  p.id_usuario AS id_cliente,
  CONCAT(u.nom_1, ' ', u.ape_1) AS nombre_cliente,
  p.fecha AS fecha_pedido,
  e.nom_metodo AS estado_pago,
  COUNT(t.id_ticket_c) AS cantidad_pedidos
FROM ticket_compra t
INNER JOIN estado_pago e ON t.id_estado = e.id_estado
INNER JOIN pedido p ON t.id_pedido = p.id_pedido
INNER JOIN usuario u ON p.id_usuario = u.id_usuario
GROUP BY p.id_usuario, u.nom_1, u.ape_1, p.fecha, e.nom_metodo
ORDER BY p.fecha DESC;


-- 6. Top 3 usuarios con mayor monto total

SELECT 
  u.id_usuario,
  u.nom_1,
  u.ape_1,
  SUM(t.total_ticket) AS total_monto
FROM ticket_compra t
INNER JOIN pedido p ON t.id_pedido = p.id_pedido
INNER JOIN usuario u ON p.id_usuario = u.id_usuario
GROUP BY u.id_usuario, u.nom_1, u.ape_1
ORDER BY total_monto DESC
LIMIT 3;

-- 7. Productos con bajo stock

UPDATE producto
SET stock_actual = 3
WHERE id_producto IN (2, 4);

SELECT 
  p.nom_producto,
  p.stock_actual as Stock_actual,
  c.nombre_c AS categoria,
  p.precio_unitario
FROM producto p
JOIN categoria c ON p.id_categoria = c.id_categoria
WHERE p.stock_actual < 5
ORDER BY p.stock_actual ASC;

-- 8. Total de ingresos por pedido

SELECT 
  p.id_pedido,
  CONCAT(u.nom_1, ' ', u.ape_1) AS nombre_cliente,
  p.fecha AS fecha_pedido,
  m.nom_metodo AS metodo_pago,
  e.nom_metodo AS estado_pago,
  COUNT(DISTINCT dp.id_producto) AS productos_diferentes,
  SUM(dp.cantidad * pr.precio_unitario) AS total_ingresos
FROM pedido p
JOIN usuario u ON p.id_usuario = u.id_usuario
JOIN detalles_pedido dp ON p.id_pedido = dp.id_pedido
JOIN producto pr ON dp.id_producto = pr.id_producto
JOIN ticket_compra t ON p.id_pedido = t.id_pedido
JOIN metodo_pago m ON t.id_met_pago = m.id_met_pago
JOIN estado_pago e ON t.id_estado = e.id_estado
GROUP BY p.id_pedido, u.nom_1, u.ape_1, p.fecha, m.nom_metodo, e.nom_metodo
ORDER BY p.fecha DESC;

-- 9. Movimientos de entradas y salidas

INSERT INTO movimiento (Cantidad_m, fecha_m, observaciones, id_m, id_producto, id_usuario)
VALUES
(10, '2025-10-20 08:30:00', 'Ingreso de stock inicial', 'M-E', 1, 'Us-01'),
(5, '2025-10-21 10:00:00', 'Venta registrada', 'M-S', 2, 'Us-02'),
(3, '2025-10-21 14:15:00', 'Pedido especial', 'M-S', 3, 'Us-03'),
(8, '2025-10-22 09:00:00', 'Reposición de inventario', 'M-E', 4, 'Us-07');

SELECT 
  m.id_movimiento,
  m.Cantidad_m,
  m.fecha_m,
  tm.nom_movimiento AS tipo_movimiento,
  p.nom_producto,
  r.nombre_rol AS rol_usuario
FROM movimiento m
JOIN producto p ON m.id_producto = p.id_producto
JOIN usuario u ON m.id_usuario = u.id_usuario
JOIN tipo_movimiento tm ON m.id_m = tm.id_m
JOIN rol_usuario r ON u.id_rol_usuario = r.id_rol_usuario
ORDER BY m.fecha_m DESC;


-- 10. Pedidos entre el 1 y 14 de octubre (detalle por producto)

SELECT 
  p.id_pedido,
  p.fecha,
  CONCAT(u.nom_1, ' ', u.ape_1) AS nombre_cliente,
  pr.nom_producto,
  dp.cantidad,
  (dp.cantidad * pr.precio_unitario) AS subtotal_producto
FROM detalles_pedido dp
JOIN pedido p ON dp.id_pedido = p.id_pedido
JOIN producto pr ON dp.id_producto = pr.id_producto
JOIN usuario u ON p.id_usuario = u.id_usuario
WHERE p.fecha BETWEEN '2025-10-01' AND '2025-10-14'
ORDER BY p.fecha DESC, p.id_pedido, pr.nom_producto;


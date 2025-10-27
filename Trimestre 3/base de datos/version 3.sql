CREATE DATABASE Gurama;
USE Gurama;

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
  nom_producto VARCHAR(20) NOT NULL,
  precio_unitario INT(10) NOT NULL,
  stock_actual VARCHAR(45) NOT NULL,
  stock_minimo VARCHAR(45) NOT NULL,
  ultima_actualiz DATETIME NOT NULL,
  color VARCHAR(20) NULL,
  talla VARCHAR(20) NULL,
  tamaño VARCHAR(20) NULL,
  id_categoria INT(4) NOT NULL,
  id_clasificacion int (4) NOT NULL,

  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
  FOREIGN KEY (id_clasificacion) REFERENCES clasificacion(id_clasificacion)
);

CREATE TABLE detalles_pedido (
  id_detalles INT(4) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  descrip_detalles VARCHAR(40) NOT NULL,
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

INSERT INTO rol_usuario (id_rol_usuario, nombre_rol) 
VALUES ('Admin', 'Administrador');

INSERT INTO rol_usuario (id_rol_usuario, nombre_rol) 
Values ('Cliente','Clientes');

INSERT INTO tipo_documento (t_doc, desc_doc) 
Values ('CC','Cédula de ciudadanía');

INSERT INTO tipo_documento (t_doc, desc_doc) 
Values ('CE','Cédula de extranjería');

INSERT INTO tipo_documento (t_doc, desc_doc) 
Values ('TI','Tarjeta de identidad');

INSERT INTO usuario (id_usuario, nom_1, nom_2, ape_1, ape_2, correo, telefono, contraseña, codigo, id_rol_usuario, t_doc) 
VALUES ('Us-01', 'Matthew', 'Sebestian', 'Mancera', 'Riaño', 'matteewma@gmail.com', 3103028623, 'd0K1isaToy', "C-136", 'Admin', 'CC');

INSERT INTO usuario (id_usuario, nom_1, nom_2, ape_1, correo, telefono, contraseña, id_rol_usuario, t_doc) 
VALUES ('Us-02', 'David', 'Santiago', 'Gonzalez', 'sanun@gmail.com', 313456623, '123456', 'Cliente', 'CE');

UPDATE usuario 
SET contraseña = 'hjasdygq23234'
WHERE id_usuario = 'Us-02';

SELECT * FROM usuario;

SELECT ape_2 FROM usuario;

INSERT INTO categoria (id_categoria, nombre_c) 
VALUES ('11', 'Amigurumis');

INSERT INTO categoria (id_categoria, nombre_c, descripcion) 
VALUES (2, 'Llaveros', 'Hermosos llavero tejidos a maño');

INSERT INTO clasificacion (id_clasificacion, nombre_clas) 
VALUES (1, 'En oferta');

SELECT 
    u.id_usuario,
    CONCAT(u.nom_1, ' ', u.ape_1) AS nombre_completo,
    u.correo,
    r.nombre_rol,
    t.desc_doc
FROM usuario u
JOIN rol_usuario r ON u.id_rol_usuario = r.id_rol_usuario
JOIN tipo_documento t ON u.t_doc = t.t_doc;

SELECT 
    p.id_pedido,
    p.fecha,
    p.estado,
    CONCAT(u.nom_1, ' ', u.ape_1) AS cliente,
    tp.tipo_pedido
FROM pedido p
JOIN usuario u ON p.id_usuario = u.id_usuario
JOIN tipo_pedido tp ON p.id_tipo = tp.id_tipo;

SELECT 
    m.id_movimiento,
    m.fecha_m,
    m.Cantidad_m,
    tm.nom_movimiento,
    p.nom_producto,
    CONCAT(u.nom_1, ' ', u.ape_1) AS responsable
FROM movimiento m
JOIN tipo_movimiento tm ON m.id_m = tm.id_m
JOIN producto p ON m.id_producto = p.id_producto
JOIN usuario u ON m.id_usuario = u.id_usuario;

SELECT id_usuario, nom_1, ape_1, correo
FROM usuario
WHERE nom_1 LIKE '%mat%' OR ape_1 LIKE '%gon%';

SELECT 
    r.nombre_rol,
    COUNT(u.id_usuario) AS cantidad_usuarios
FROM usuario u
JOIN rol_usuario r ON u.id_rol_usuario = r.id_rol_usuario
GROUP BY r.nombre_rol;

SELECT nom_1, ape_1, correo
FROM usuario
ORDER BY ape_1 ASC;




alter table producto add descripcion varchar(45) NOT NULL;

ALTER TABLE ticket_compra 
MODIFY COLUMN id_ticket_c INT(6) NOT NULL;

ALTER TABLE ticket_compra 
ADD COLUMN num_ticket INT(6) NOT NULL AUTO_INCREMENT AFTER id_ticket_c,
ADD UNIQUE (num_ticket);
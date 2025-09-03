CREATE DATABASE gurama;
USE gurama;
CREATE TABLE usuario (
id_usuario varchar (15) not null primary key,
nom_1 varchar (50) not null,
nom_2 varchar (50) null,
ape_1 varchar (50) not null,
ape_2 varchar (50) null,
correo Varchar (40) not null,
telefono bigint (10) not null
);

Create table tipo_documento (
t_doc varchar (10) not null primary key,
desc_doc Varchar (20) not null
);

create table pedido (
id_pedido int (4) primary key not null,
fecha datetime not null,
estado varchar (20) not null,
total int (5) not null
);

create table estado_pago(
id_estado varchar (3) primary key not null,
estado_pago boolean
);

create table comprobante(
id_comprobante int (6) primary key not null, 
comprobante_pago boolean,
img_comprobante LONGBLOB
);

create table producto (
id_producto varchar (3)primary key not null, 
producto varchar (20) not null,
precio_unitario int (10) not null);

create table datalle_pedido (
id_detalle varchar (4) primary key not null, 
descripcion varchar (30)
);
create table tipo_pedido (
id_tipo varchar (4) primary key not null, 
tipo_pedido varchar (10));

create table movimiento (
id_movimiento varchar (3) primary key not null,
cantidad_m int (5) not null,
fecha_m datetime not null,
observacion varchar (80) null);

create table mov_inventario (
id_m varchar (5),
nom_movimiento varchar (11));




-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-10-2025 a las 03:11:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gurama_online`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Tejidos', 'Productos tejidos hechos a mano con hilo/lana '),
(2, 'Ropa de cama', 'Hermosaropa de cama (sabanas, cubrelechos, fundas de almohadas, entre otros) con diferentes diseños');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clasificacion`
--

CREATE TABLE `clasificacion` (
  `id_clasificacion` int(11) NOT NULL,
  `nombre` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `id_detalle` int(11) NOT NULL,
  `producto` varchar(80) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `descripcion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`id_detalle`, `producto`, `cantidad`, `descripcion`) VALUES
(1, '3 Tulipanes tejidos de color rosa, fucsia y amarillo (en ramo)', 2, NULL),
(2, '1 virgencita con corona \r\n', 1, 'virgencita tejida hecha a mano donde la virgencita tiene corona y vestido blanco '),
(3, 'Sabanas florales ', 3, 'Sabanas florales para cama doble '),
(4, 'Ramo de 3 tulipanes', 2, 'Ramo de tres tulipanes los dos seran iguales '),
(5, 'Sabana cama Semi-doble ', 2, 'Sabanas de cama semi-doble de color azul ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_pago`
--

CREATE TABLE `estado_pago` (
  `id_estado` int(11) NOT NULL,
  `estado_pago` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_pago`
--

INSERT INTO `estado_pago` (`id_estado`, `estado_pago`) VALUES
(1, 'Pendiente'),
(2, 'En proceso'),
(3, 'Pagado'),
(4, 'Rechazado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id_metodopago` int(11) NOT NULL,
  `nombre_metodo` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id_metodopago`, `nombre_metodo`) VALUES
(1, 'Nequi'),
(2, 'Daviplata'),
(3, 'Tarjeta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento`
--

CREATE TABLE `movimiento` (
  `id_movimiento` int(11) NOT NULL,
  `cantidad_movimiento` int(11) DEFAULT NULL,
  `fecha_movimiento` datetime DEFAULT NULL,
  `observaciones` varchar(1000) DEFAULT NULL,
  `id_tipomovimiento` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimiento`
--

INSERT INTO `movimiento` (`id_movimiento`, `cantidad_movimiento`, `fecha_movimiento`, `observaciones`, `id_tipomovimiento`, `id_producto`, `id_usuario`) VALUES
(1, 1, '2025-10-15 12:04:21', 'Sale de el inventario de los producto 2 tulipanes (ramo de tulipanes de 3)', 2, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `estado` varchar(80) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_tipopedido` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `fecha`, `estado`, `id_usuario`, `id_tipopedido`) VALUES
(1, '2025-10-12 22:09:36', 'En producción', 2, 1),
(2, '2025-10-01 18:49:37', 'Terminado por entregar ', 3, 2),
(3, '2025-10-16 19:13:11', 'en proceso', 4, 1),
(4, '2025-10-17 19:17:16', 'Terminado', 4, 3),
(5, '2025-10-15 19:23:54', NULL, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `nom_producto` varchar(80) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `stock_actual` int(11) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT NULL,
  `ultima_actualizacion` datetime DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `talla` varchar(100) DEFAULT NULL,
  `tamaño` varchar(100) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nom_producto`, `precio_unitario`, `descripcion`, `stock_actual`, `stock_minimo`, `ultima_actualizacion`, `color`, `talla`, `tamaño`, `id_categoria`) VALUES
(1, '3 Tulipanes', 55.00, 'Hermosos tulipanes de hilo/lana, flores eternas que no se marchitan, unicas y hechas con amor', 8, 1, '2025-10-04 15:30:45', 'Rosa, fucsia y amarilo', '', '35 cm', 1),
(2, 'Virgencita ', 58.00, 'Virgencita de lana de medida de 13cm, incluye cajita y tarjeta de oracion', 5, 1, '2025-10-18 18:57:14', NULL, NULL, 'Medida de 13cm', 1),
(3, 'Sabanas florales', 75.00, 'Sabanas florales para cama doble con composicion 90% algodon - 140 hilos', 3, 1, '2025-10-19 19:00:26', 'sabanas color pastel con flores de colores ', 'Cama doble ', NULL, 2),
(4, 'Sabanas de cama semi-doble', 70.00, 'sabanas composicion: 90% algodon - 140 hilos', 10, 1, '2025-10-16 19:04:19', 'Azul con diseño de anclas ', 'Cama semi-doble', NULL, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_usuario`
--

CREATE TABLE `rol_usuario` (
  `id_rolusuario` int(11) NOT NULL,
  `nombre_rol` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_usuario`
--

INSERT INTO `rol_usuario` (`id_rolusuario`, `nombre_rol`) VALUES
(1, 'Administrador'),
(2, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket_compra`
--

CREATE TABLE `ticket_compra` (
  `id_ticketcompra` int(11) NOT NULL,
  `num_ticket` int(11) DEFAULT NULL,
  `fecha_emision` datetime DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `total_ticket` decimal(10,2) DEFAULT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  `id_estado` int(11) DEFAULT NULL,
  `id_metodopago` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ticket_compra`
--

INSERT INTO `ticket_compra` (`id_ticketcompra`, `num_ticket`, `fecha_emision`, `subtotal`, `total_ticket`, `id_pedido`, `id_estado`, `id_metodopago`) VALUES
(1, 102030, '2025-10-12 12:01:54', 100000.00, 100000.00, 1, 2, 1),
(2, 102031, '2025-10-13 19:08:24', 58.00, 58.00, 2, 3, 2),
(3, 102032, '2025-10-17 19:15:16', 225.00, 225.00, 3, 3, 3),
(4, 102033, '2025-10-17 19:20:38', 110.00, 110.00, 4, 3, 3),
(5, 102034, '2025-10-17 19:27:08', 140.00, 140.00, 4, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documento`
--

CREATE TABLE `tipo_documento` (
  `id_tipodocumento` int(11) NOT NULL,
  `tipo_documento` varchar(80) DEFAULT NULL,
  `descripcion_documento` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_documento`
--

INSERT INTO `tipo_documento` (`id_tipodocumento`, `tipo_documento`, `descripcion_documento`) VALUES
(1, 'Cedula de ciudadania', 'Numero de identificacion dada a los colombianos al cumplir los 18 años'),
(2, 'Tarjeta de identidad', 'Numero de identificacion dada a los niños colombianos al cumpplir los 8 años.'),
(3, 'Cedula de extranjeria', 'Numero de identificacion de las personas de otros países diferentes a Colombia.'),
(4, 'PPT (Permiso de Protección Temporal)', 'Número dado a los extranjeros en colombia que deciden vivir en Colombia.'),
(5, 'PEP (Permiso Especial de Permanencia)', 'Es el permiso especial que se da a los extranjeros que desean permanecer en Colombia, es una regulación migratoria.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_movimiento`
--

CREATE TABLE `tipo_movimiento` (
  `id_tipomovimiento` int(11) NOT NULL,
  `nom_tipomovimiento` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_movimiento`
--

INSERT INTO `tipo_movimiento` (`id_tipomovimiento`, `nom_tipomovimiento`) VALUES
(1, 'Entrada de productos'),
(2, 'Salida de productos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pedido`
--

CREATE TABLE `tipo_pedido` (
  `id_tipopedido` int(11) NOT NULL,
  `nom_tipopedido` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_pedido`
--

INSERT INTO `tipo_pedido` (`id_tipopedido`, `nom_tipopedido`) VALUES
(1, 'Estándar ropa de cama '),
(2, 'Personalizado tejido'),
(3, 'Estándar tejidos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre_1` varchar(80) NOT NULL,
  `nombre_2` varchar(80) DEFAULT NULL,
  `apellido_1` varchar(80) NOT NULL,
  `apellido_2` varchar(80) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` bigint(11) DEFAULT NULL,
  `contraseña` varchar(15) NOT NULL,
  `codigo` int(11) DEFAULT NULL,
  `numero_documento` varchar(40) NOT NULL,
  `id_tipodocumento` int(11) DEFAULT NULL,
  `id_rolusuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre_1`, `nombre_2`, `apellido_1`, `apellido_2`, `correo`, `telefono`, `contraseña`, `codigo`, `numero_documento`, `id_tipodocumento`, `id_rolusuario`) VALUES
(1, 'Evelyn', 'Zahory', 'Cardenas', 'Vega', 'zahorycardenas9@gmail.com', 3223624402, 'Zaho_2008', 884422, '1023898051', 2, 1),
(2, 'Martha', 'Liliana', 'Vega', 'Cantor', '', 3132171185, 'Lili8721', NULL, '1022331712', 1, 2),
(3, 'Laura', NULL, 'Ospina', NULL, 'laura123@gmail.com', NULL, 'lau_000', NULL, '1234567890', 1, 2),
(4, 'Pedro', 'Julio', 'Cardenas', NULL, 'julio_07@gmail.com', 3224007633, '01020304', NULL, '80746875', 1, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `clasificacion`
--
ALTER TABLE `clasificacion`
  ADD PRIMARY KEY (`id_clasificacion`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id_detalle`);

--
-- Indices de la tabla `estado_pago`
--
ALTER TABLE `estado_pago`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id_metodopago`);

--
-- Indices de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `id_tipomovimiento` (`id_tipomovimiento`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_tipopedido` (`id_tipopedido`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD PRIMARY KEY (`id_rolusuario`);

--
-- Indices de la tabla `ticket_compra`
--
ALTER TABLE `ticket_compra`
  ADD PRIMARY KEY (`id_ticketcompra`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `id_metodopago` (`id_metodopago`);

--
-- Indices de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  ADD PRIMARY KEY (`id_tipodocumento`);

--
-- Indices de la tabla `tipo_movimiento`
--
ALTER TABLE `tipo_movimiento`
  ADD PRIMARY KEY (`id_tipomovimiento`);

--
-- Indices de la tabla `tipo_pedido`
--
ALTER TABLE `tipo_pedido`
  ADD PRIMARY KEY (`id_tipopedido`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `id_tipodocumento` (`id_tipodocumento`),
  ADD KEY `id_rolusuario` (`id_rolusuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `clasificacion`
--
ALTER TABLE `clasificacion`
  MODIFY `id_clasificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estado_pago`
--
ALTER TABLE `estado_pago`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id_metodopago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD CONSTRAINT `movimiento_ibfk_1` FOREIGN KEY (`id_tipomovimiento`) REFERENCES `tipo_movimiento` (`id_tipomovimiento`),
  ADD CONSTRAINT `movimiento_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `movimiento_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`id_tipopedido`) REFERENCES `tipo_pedido` (`id_tipopedido`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Filtros para la tabla `ticket_compra`
--
ALTER TABLE `ticket_compra`
  ADD CONSTRAINT `ticket_compra_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`),
  ADD CONSTRAINT `ticket_compra_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estado_pago` (`id_estado`),
  ADD CONSTRAINT `ticket_compra_ibfk_3` FOREIGN KEY (`id_metodopago`) REFERENCES `metodo_pago` (`id_metodopago`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_tipodocumento`) REFERENCES `tipo_documento` (`id_tipodocumento`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_rolusuario`) REFERENCES `rol_usuario` (`id_rolusuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

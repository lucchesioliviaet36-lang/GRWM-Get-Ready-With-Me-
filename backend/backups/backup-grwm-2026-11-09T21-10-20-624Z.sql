-- BACKUP GRWM
-- Fecha: 2026-11-09T21:10:20.633Z

SET FOREIGN_KEY_CHECKS = 0;

-- =============================
-- TABLA: bitacora
-- =============================

DROP TABLE IF EXISTS `bitacora`;
CREATE TABLE `bitacora` (
  `id_bitacora` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) NOT NULL,
  `accion` varchar(50) NOT NULL,
  `tabla_afectada` varchar(50) NOT NULL,
  `usuario_afectado` varchar(50) NOT NULL,
  `fecha` date DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_bitacora`),
  KEY `fk_bitacora_usuario` (`id_usuario`),
  CONSTRAINT `fk_bitacora_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (1, 'Registro de usuario', 'INSERT', 'Usuario', '1', '2026-11-07', 857996796, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (2, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '1', '2026-11-08', 970566012, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (3, 'Registro de usuario', 'INSERT', 'Usuario', '2', '2026-11-08', 1107624048, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (4, 'Publicación creada', 'INSERT', 'Publicacion', '2', '2026-11-08', 657814090, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (5, 'Publicación creada', 'INSERT', 'Publicacion', '2', '2026-11-08', 636784768, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (6, 'Publicación creada', 'INSERT', 'Publicacion', '2', '2026-11-08', 2120748387, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (7, 'Publicación creada', 'INSERT', 'Publicacion', '2', '2026-11-08', 1120819977, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (8, 'Perfil actualizado', 'UPDATE', 'Usuario', '2', '2026-11-08', 1791634093, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (9, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '1', '2026-11-08', 1704529202, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (10, 'Perfil actualizado', 'UPDATE', 'Usuario', '1', '2026-11-08', 1320984514, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (11, 'Publicación creada', 'INSERT', 'Publicacion', '1', '2026-11-08', 1378441027, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (12, 'Publicación creada', 'INSERT', 'Publicacion', '1', '2026-11-08', 308175989, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (13, 'Publicación creada', 'INSERT', 'Publicacion', '1', '2026-11-08', 1650487578, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (14, 'Publicación creada', 'INSERT', 'Publicacion', '1', '2026-11-08', 75127710, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (15, 'Usuario seguido', 'FOLLOW', 'Seguimiento', '2', '2026-11-08', 118805021, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (16, 'Producto agregado', 'INSERT', 'Producto', '1', '2026-11-08', 675421385, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (17, 'Prenda agregada', 'INSERT', 'Prenda', '1', '2026-11-08', 157797812, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (18, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '2', '2026-11-08', 951440323, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (19, 'Like agregado', 'INSERT', 'Like', '2', '2026-11-08', 1417700995, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (20, 'Favorito agregado', 'INSERT', 'Favorito', '2', '2026-11-08', 1961444377, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (21, 'Like agregado', 'INSERT', 'Like', '2', '2026-11-08', 383700273, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (22, 'Favorito agregado', 'INSERT', 'Favorito', '2', '2026-11-08', 1917909196, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (23, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '1', '2026-11-08', 916272148, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (24, 'Like agregado', 'INSERT', 'Like', '1', '2026-11-08', 320661416, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (25, 'Like eliminado', 'DELETE', 'Like', '1', '2026-11-08', 191042787, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (26, 'Like agregado', 'INSERT', 'Like', '1', '2026-11-08', 1623157825, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (27, 'Like eliminado', 'DELETE', 'Like', '1', '2026-11-08', 1550139138, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (28, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '2', '2026-11-08', 1961418252, 2);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (29, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '1', '2026-11-08', 1737483510, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (30, 'Like agregado', 'INSERT', 'Like', '1', '2026-11-08', 260495621, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (31, 'Like eliminado', 'DELETE', 'Like', '1', '2026-11-08', 1293253224, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (32, 'Publicación creada', 'INSERT', 'Publicacion', '1', '2026-11-09', 842118422, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (33, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '1', '2026-11-09', 1593145640, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (34, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '1', '2026-11-09', 1800904609, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (35, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '1', '2026-11-09', 443014606, 1);
INSERT INTO `bitacora` (`id_bitacora`, `descripcion`, `accion`, `tabla_afectada`, `usuario_afectado`, `fecha`, `DVH`, `id_usuario`) VALUES (36, 'Inicio de sesión exitoso', 'LOGIN', 'Usuario', '1', '2026-11-09', 316091078, 1);

-- =============================
-- TABLA: calificacion
-- =============================

DROP TABLE IF EXISTS `calificacion`;
CREATE TABLE `calificacion` (
  `id_calificacion` int(11) NOT NULL AUTO_INCREMENT,
  `comentario` varchar(50) NOT NULL,
  `puntuacion` decimal(10,2) NOT NULL,
  `fecha` date DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_calificacion`),
  KEY `fk_calificacion_usuario` (`id_usuario`),
  KEY `fk_calificacion_producto` (`id_producto`),
  CONSTRAINT `fk_calificacion_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `fk_calificacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: detalle_pedido
-- =============================

DROP TABLE IF EXISTS `detalle_pedido`;
CREATE TABLE `detalle_pedido` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `cantidad` int(11) DEFAULT NULL,
  `sub_total` decimal(10,2) NOT NULL,
  `codigo_seguimiento` int(11) DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `fk_detalle_pedido` (`id_pedido`),
  KEY `fk_detalle_producto` (`id_producto`),
  CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`),
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: devolucion
-- =============================

DROP TABLE IF EXISTS `devolucion`;
CREATE TABLE `devolucion` (
  `id_devolucion` int(11) NOT NULL AUTO_INCREMENT,
  `motivo` varchar(50) NOT NULL,
  `fecha_devolucion` date DEFAULT NULL,
  `estado_devolucion` tinyint(4) DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_devolucion`),
  KEY `fk_devolucion_pedido` (`id_pedido`),
  CONSTRAINT `fk_devolucion_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: dvv
-- =============================

DROP TABLE IF EXISTS `dvv`;
CREATE TABLE `dvv` (
  `id_dvv` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_tabla` varchar(50) NOT NULL,
  `DVH` int(11) DEFAULT NULL,
  `fecha_actualizacion` date DEFAULT NULL,
  PRIMARY KEY (`id_dvv`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `dvv` (`id_dvv`, `nombre_tabla`, `DVH`, `fecha_actualizacion`) VALUES (1, 'Usuario', 1974611280, '2026-11-09');
INSERT INTO `dvv` (`id_dvv`, `nombre_tabla`, `DVH`, `fecha_actualizacion`) VALUES (2, 'Bitacora', 2120735441, '2026-11-09');
INSERT INTO `dvv` (`id_dvv`, `nombre_tabla`, `DVH`, `fecha_actualizacion`) VALUES (3, 'Publicacion', 290820361, '2026-11-09');
INSERT INTO `dvv` (`id_dvv`, `nombre_tabla`, `DVH`, `fecha_actualizacion`) VALUES (4, 'Producto', 468787543, '2026-11-08');
INSERT INTO `dvv` (`id_dvv`, `nombre_tabla`, `DVH`, `fecha_actualizacion`) VALUES (5, 'Prenda', 1609362278, '2026-11-08');
INSERT INTO `dvv` (`id_dvv`, `nombre_tabla`, `DVH`, `fecha_actualizacion`) VALUES (6, 'Like', 105039082, '2026-11-08');
INSERT INTO `dvv` (`id_dvv`, `nombre_tabla`, `DVH`, `fecha_actualizacion`) VALUES (7, 'Favorito', 596468065, '2026-11-08');

-- =============================
-- TABLA: historia_comentarios
-- =============================

DROP TABLE IF EXISTS `historia_comentarios`;
CREATE TABLE `historia_comentarios` (
  `id_comentario` int(11) NOT NULL AUTO_INCREMENT,
  `id_historia` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `fecha_comentario` datetime DEFAULT NULL,
  PRIMARY KEY (`id_comentario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: historia_likes
-- =============================

DROP TABLE IF EXISTS `historia_likes`;
CREATE TABLE `historia_likes` (
  `id_like` int(11) NOT NULL AUTO_INCREMENT,
  `id_historia` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_like` datetime DEFAULT NULL,
  PRIMARY KEY (`id_like`),
  UNIQUE KEY `historia_likes_id_historia_id_usuario` (`id_historia`,`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: historias
-- =============================

DROP TABLE IF EXISTS `historias`;
CREATE TABLE `historias` (
  `id_historia` int(11) NOT NULL AUTO_INCREMENT,
  `imagen_url` varchar(500) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `like_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id_historia`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `historias_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `historias` (`id_historia`, `imagen_url`, `id_usuario`, `fecha_creacion`, `like_count`) VALUES (1, '/uploads/historias/historia-1794185269624-315488.jpg', 2, '2026-11-08 21:47:49.000', 0);

-- =============================
-- TABLA: mensajes
-- =============================

DROP TABLE IF EXISTS `mensajes`;
CREATE TABLE `mensajes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `remitenteId` int(11) NOT NULL,
  `destinatarioId` int(11) NOT NULL,
  `contenido` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `mensajes` (`id`, `remitenteId`, `destinatarioId`, `contenido`, `createdAt`, `updatedAt`) VALUES (1, 1, 2, 'hola linda como estas?', '2026-11-08 21:45:47.000', '2026-11-08 21:45:47.000');
INSERT INTO `mensajes` (`id`, `remitenteId`, `destinatarioId`, `contenido`, `createdAt`, `updatedAt`) VALUES (2, 2, 1, 'bien y vos?', '2026-11-08 21:46:44.000', '2026-11-08 21:46:44.000');

-- =============================
-- TABLA: pago
-- =============================

DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `metodo` varchar(50) NOT NULL,
  `codigo_transaccion` int(11) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `estado_pago` tinyint(4) DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `fk_pago_pedido` (`id_pedido`),
  CONSTRAINT `fk_pago_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: patente
-- =============================

DROP TABLE IF EXISTS `patente`;
CREATE TABLE `patente` (
  `id_patente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_patente` varchar(50) NOT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_patente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: pedido
-- =============================

DROP TABLE IF EXISTS `pedido`;
CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_pedido` date DEFAULT NULL,
  `estado_pedido` tinyint(4) DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_pedido_usuario` (`id_usuario`),
  CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: prenda
-- =============================

DROP TABLE IF EXISTS `prenda`;
CREATE TABLE `prenda` (
  `id_prenda` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `origen` varchar(50) DEFAULT NULL,
  `id_externo` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_prenda`),
  KEY `fk_prenda_usuario` (`id_usuario`),
  CONSTRAINT `fk_prenda_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `prenda` (`id_prenda`, `nombre`, `categoria`, `color`, `descripcion`, `imagen_url`, `origen`, `id_externo`, `id_usuario`) VALUES (1, 'short marron', 'partes_abajo', 'Marron', 'lindo', '/uploads/prendas/prenda-1794184965665-503954.jpg', 'manual', NULL, 1);

-- =============================
-- TABLA: producto
-- =============================

DROP TABLE IF EXISTS `producto`;
CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` varchar(20) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `estado_producto` tinyint(4) NOT NULL DEFAULT 1,
  `DVH` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `idx_nombre_producto` (`nombre`),
  KEY `idx_categoria` (`categoria`),
  KEY `fk_producto_usuario` (`id_usuario`),
  CONSTRAINT `fk_producto_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `producto` (`id_producto`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `imagen`, `fecha`, `estado_producto`, `DVH`, `id_usuario`) VALUES (1, 'Remera', 'remera linda', '99999999.99', '1', 'Remeras', '/uploads/productos/1794184611303-380491622.jpg', '2026-11-08', 1, 1020766029, 1);

-- =============================
-- TABLA: publicacion
-- =============================

DROP TABLE IF EXISTS `publicacion`;
CREATE TABLE `publicacion` (
  `id_publicacion` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) DEFAULT NULL,
  `fecha_publicacion` date DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `musica_url` varchar(500) DEFAULT NULL,
  `musica_titulo` varchar(150) DEFAULT NULL,
  `musica_artista` varchar(150) DEFAULT NULL,
  `musica_imagen` varchar(500) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_publicacion`),
  KEY `fk_publicacion_usuario` (`id_usuario`),
  KEY `fk_publicacion_producto` (`id_producto`),
  CONSTRAINT `fk_publicacion_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `fk_publicacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (1, 'las amo', '2026-11-08', 2126774854, '/uploads/publicaciones/1794183610289-777008068.jpg', NULL, NULL, NULL, NULL, 2, NULL);
INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (2, 'saliendo a merendar', '2026-11-08', 1479860607, '/uploads/publicaciones/1794183648506-580795197.jpg', 'https://www.youtube.com/watch?v=Rt9tW3cMLhI', 'Olivia Rodrigo - stupid song (Official Music Video)', 'OliviaRodrigoVEVO', 'https://i.ytimg.com/vi/Rt9tW3cMLhI/mqdefault.jpg', 2, NULL);
INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (3, '<3', '2026-11-08', 669746636, '/uploads/publicaciones/1794183729364-674295425.jpg', 'https://www.youtube.com/watch?v=K0CLc_zOWYc', 'Ain&#39;t In LA', 'ADÉLA - Topic', 'https://i.ytimg.com/vi/K0CLc_zOWYc/mqdefault.jpg', 2, NULL);
INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (4, 'tomando un cafecito riquito riquito', '2026-11-08', 927081290, '/uploads/publicaciones/1794183756994-93787327.jpg', NULL, NULL, NULL, NULL, 2, NULL);
INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (5, 'ultra dabbb', '2026-11-08', 1861381804, '/uploads/publicaciones/1794183948098-472660280.jpg', NULL, NULL, NULL, NULL, 1, NULL);
INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (6, 'yellow', '2026-11-08', 1759058722, '/uploads/publicaciones/1794183965137-703565816.jpg', NULL, NULL, NULL, NULL, 1, NULL);
INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (7, 'en bahamas', '2026-11-08', 682512946, '/uploads/publicaciones/1794183980811-698454440.jpg', NULL, NULL, NULL, NULL, 1, NULL);
INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (8, 'cute', '2026-11-08', 588608944, '/uploads/publicaciones/1794183994904-957328671.jpg', NULL, NULL, NULL, NULL, 1, NULL);
INSERT INTO `publicacion` (`id_publicacion`, `descripcion`, `fecha_publicacion`, `DVH`, `imagen_url`, `musica_url`, `musica_titulo`, `musica_artista`, `musica_imagen`, `id_usuario`, `id_producto`) VALUES (9, '#rojo #cute #encaje', '2026-11-09', 205192508, '/uploads/publicaciones/1794235608071-874835032.jpg', NULL, NULL, NULL, NULL, 1, NULL);

-- =============================
-- TABLA: publicacion_comentario
-- =============================

DROP TABLE IF EXISTS `publicacion_comentario`;
CREATE TABLE `publicacion_comentario` (
  `id_comentario` int(11) NOT NULL AUTO_INCREMENT,
  `comentario` text NOT NULL,
  `fecha_comentario` datetime DEFAULT current_timestamp(),
  `DVH` int(11) DEFAULT 0,
  `id_usuario` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL,
  PRIMARY KEY (`id_comentario`),
  KEY `fk_comentario_usuario` (`id_usuario`),
  KEY `fk_comentario_publicacion` (`id_publicacion`),
  CONSTRAINT `fk_comentario_publicacion` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id_publicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_comentario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: publicacion_etiquetado
-- =============================

DROP TABLE IF EXISTS `publicacion_etiquetado`;
CREATE TABLE `publicacion_etiquetado` (
  `id_etiquetado` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_etiquetado` datetime DEFAULT current_timestamp(),
  `DVH` int(11) DEFAULT 0,
  `id_usuario` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL,
  PRIMARY KEY (`id_etiquetado`),
  UNIQUE KEY `uq_usuario_publicacion_etiquetado` (`id_usuario`,`id_publicacion`),
  KEY `fk_etiquetado_publicacion` (`id_publicacion`),
  CONSTRAINT `fk_etiquetado_publicacion` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id_publicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_etiquetado_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `publicacion_etiquetado` (`id_etiquetado`, `fecha_etiquetado`, `DVH`, `id_usuario`, `id_publicacion`) VALUES (1, '2026-11-08 21:20:10.000', 0, 1, 1);

-- =============================
-- TABLA: publicacion_favorito
-- =============================

DROP TABLE IF EXISTS `publicacion_favorito`;
CREATE TABLE `publicacion_favorito` (
  `id_favorito` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_guardado` datetime DEFAULT current_timestamp(),
  `DVH` int(11) DEFAULT 0,
  `id_usuario` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL,
  PRIMARY KEY (`id_favorito`),
  UNIQUE KEY `uq_usuario_publicacion_favorito` (`id_usuario`,`id_publicacion`),
  KEY `fk_favorito_publicacion` (`id_publicacion`),
  CONSTRAINT `fk_favorito_publicacion` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id_publicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorito_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `publicacion_favorito` (`id_favorito`, `fecha_guardado`, `DVH`, `id_usuario`, `id_publicacion`) VALUES (1, '2026-11-08 21:47:08.000', 1270278787, 2, 8);
INSERT INTO `publicacion_favorito` (`id_favorito`, `fecha_guardado`, `DVH`, `id_usuario`, `id_publicacion`) VALUES (2, '2026-11-08 21:47:16.000', 347212293, 2, 5);

-- =============================
-- TABLA: publicacion_like
-- =============================

DROP TABLE IF EXISTS `publicacion_like`;
CREATE TABLE `publicacion_like` (
  `id_like` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_like` datetime DEFAULT current_timestamp(),
  `DVH` int(11) DEFAULT 0,
  `id_usuario` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL,
  PRIMARY KEY (`id_like`),
  UNIQUE KEY `uq_usuario_publicacion_like` (`id_usuario`,`id_publicacion`),
  KEY `fk_like_publicacion` (`id_publicacion`),
  CONSTRAINT `fk_like_publicacion` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id_publicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_like_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `publicacion_like` (`id_like`, `fecha_like`, `DVH`, `id_usuario`, `id_publicacion`) VALUES (1, '2026-11-08 21:47:07.000', 0, 2, 8);
INSERT INTO `publicacion_like` (`id_like`, `fecha_like`, `DVH`, `id_usuario`, `id_publicacion`) VALUES (2, '2026-11-08 21:47:15.000', 0, 2, 5);

-- =============================
-- TABLA: rol
-- =============================

DROP TABLE IF EXISTS `rol`;
CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: rol_patente
-- =============================

DROP TABLE IF EXISTS `rol_patente`;
CREATE TABLE `rol_patente` (
  `id_rol_patente` int(11) NOT NULL AUTO_INCREMENT,
  `DVH` int(11) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `id_patente` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_rol_patente`),
  KEY `fk_rol_patente_rol` (`id_rol`),
  KEY `fk_rol_patente_patente` (`id_patente`),
  CONSTRAINT `fk_rol_patente_patente` FOREIGN KEY (`id_patente`) REFERENCES `patente` (`id_patente`),
  CONSTRAINT `fk_rol_patente_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: seguidores
-- =============================

DROP TABLE IF EXISTS `seguidores`;
CREATE TABLE `seguidores` (
  `id_seguidor` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT current_timestamp(),
  `DVH` int(11) DEFAULT 0,
  `id_usuario_seguidor` int(11) NOT NULL,
  `id_usuario_seguido` int(11) NOT NULL,
  PRIMARY KEY (`id_seguidor`),
  UNIQUE KEY `uq_seguimiento` (`id_usuario_seguidor`,`id_usuario_seguido`),
  KEY `fk_seguido_usuario` (`id_usuario_seguido`),
  CONSTRAINT `fk_seguido_usuario` FOREIGN KEY (`id_usuario_seguido`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `fk_seguidor_usuario` FOREIGN KEY (`id_usuario_seguidor`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `chk_no_seguirse` CHECK (`id_usuario_seguidor` <> `id_usuario_seguido`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `seguidores` (`id_seguidor`, `fecha`, `DVH`, `id_usuario_seguidor`, `id_usuario_seguido`) VALUES (1, '2026-11-08 21:27:05.000', 0, 1, 2);

-- =============================
-- TABLA: seguridad
-- =============================

DROP TABLE IF EXISTS `seguridad`;
CREATE TABLE `seguridad` (
  `id_seguridad` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_expiracion_token` datetime DEFAULT NULL,
  `fecha_bloqueo` datetime DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  `token_recuperacion` int(11) DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT NULL,
  `verificacion` tinyint(1) DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_seguridad`),
  KEY `fk_seguridad_usuario` (`id_usuario`),
  CONSTRAINT `fk_seguridad_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: soporte
-- =============================

DROP TABLE IF EXISTS `soporte`;
CREATE TABLE `soporte` (
  `id_soporte` int(11) NOT NULL AUTO_INCREMENT,
  `mensaje` varchar(50) NOT NULL,
  `estado_soporte` tinyint(4) DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_soporte`),
  KEY `fk_soporte_usuario` (`id_usuario`),
  CONSTRAINT `fk_soporte_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: usuario
-- =============================

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` varchar(50) DEFAULT 'usuario',
  `mail` varchar(50) NOT NULL,
  `foto_perfil` varchar(500) DEFAULT NULL,
  `banner` varchar(500) DEFAULT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `fecha_registro` date NOT NULL,
  `intentos_fallidos` int(11) NOT NULL DEFAULT 0,
  `bloqueado_hasta` datetime DEFAULT NULL,
  `reset_password` varchar(255) DEFAULT NULL,
  `reset_password_expira` datetime DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `idx_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `username`, `contraseña`, `rol`, `mail`, `foto_perfil`, `banner`, `descripcion`, `fecha_registro`, `intentos_fallidos`, `bloqueado_hasta`, `reset_password`, `reset_password_expira`, `DVH`) VALUES (1, 'Mandy', 'Flores', 'mandyfloress', '$2b$10$pMl3KKDJ.4NwbvRad.24QOni7Ctp38Og5anJOtLKF1O0KQfaj1GYS', 'administrador', 'mandy@gmail.com', '/uploads/perfiles/foto_perfil-1-1794183923349.PNG', '/uploads/perfiles/banner-1-1794183923377.jpg', '', '2026-11-07', 0, NULL, NULL, NULL, 1093177026);
INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `username`, `contraseña`, `rol`, `mail`, `foto_perfil`, `banner`, `descripcion`, `fecha_registro`, `intentos_fallidos`, `bloqueado_hasta`, `reset_password`, `reset_password_expira`, `DVH`) VALUES (2, 'Mia', 'Flores', 'miafloress', '$2b$10$8c68szqMkHfRm1S86r9U7.Mbqd/UeMsPFriS5k328Eo.53jmP62Ia', 'usuario', 'miaflores@gmail.com', '/uploads/perfiles/foto_perfil-2-1794183837129.jpeg', '/uploads/perfiles/banner-2-1794183837144.jpg', '', '2026-11-08', 0, NULL, NULL, NULL, 89987814);

-- =============================
-- TABLA: usuario_patente
-- =============================

DROP TABLE IF EXISTS `usuario_patente`;
CREATE TABLE `usuario_patente` (
  `id_usuario_patente` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_asignacion` date DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_patente` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario_patente`),
  KEY `fk_usuario_patente_usuario` (`id_usuario`),
  KEY `fk_usuario_patente_patente` (`id_patente`),
  CONSTRAINT `fk_usuario_patente_patente` FOREIGN KEY (`id_patente`) REFERENCES `patente` (`id_patente`),
  CONSTRAINT `fk_usuario_patente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================
-- TABLA: usuario_rol
-- =============================

DROP TABLE IF EXISTS `usuario_rol`;
CREATE TABLE `usuario_rol` (
  `id_usuario_rol` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_asignacion` date DEFAULT NULL,
  `DVH` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario_rol`),
  KEY `fk_usuario_rol_usuario` (`id_usuario`),
  KEY `fk_usuario_rol_rol` (`id_rol`),
  CONSTRAINT `fk_usuario_rol_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`),
  CONSTRAINT `fk_usuario_rol_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


SET FOREIGN_KEY_CHECKS = 1;

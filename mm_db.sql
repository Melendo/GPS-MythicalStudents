-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-03-2024 a las 11:37:27
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
-- Base de datos: `mm_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `album`
--

CREATE TABLE `album` (
  `ID` int(11) NOT NULL,
  `COLECCION` int(11) DEFAULT NULL,
  `NOMBRE` varchar(255) DEFAULT NULL,
  `DESCRIPCION` text DEFAULT NULL,
  `IMAGEN` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `album_personal`
--

CREATE TABLE `album_personal` (
  `ID_USU` int(11) NOT NULL,
  `ID_ALBUM` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `ID` int(11) NOT NULL,
  `NOMBRE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`ID`, `NOMBRE`) VALUES
(1, 'DEPORTES'),
(2, 'FUTBOL'),
(3, 'PERSONAS'),
(4, 'MATEMATICAS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_coleccion`
--

CREATE TABLE `categorias_coleccion` (
  `ID_COLECCIÓN` int(11) NOT NULL,
  `ID_CATEGORIAS` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colecciones`
--

CREATE TABLE `colecciones` (
  `ID` int(11) NOT NULL,
  `NOMBRE` varchar(255) DEFAULT NULL,
  `DESCRIPCION` text DEFAULT NULL,
  `IMAGEN` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cromos`
--

CREATE TABLE `cromos` (
  `ID` int(11) NOT NULL,
  `ALBUM` int(11) DEFAULT NULL,
  `NUM_CROMO` int(11) DEFAULT NULL,
  `NOMBRE` varchar(255) DEFAULT NULL,
  `IMAGEN` longblob DEFAULT NULL,
  `DESCRIPCION` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cromos_personal`
--

CREATE TABLE `cromos_personal` (
  `ID_USU` int(11) NOT NULL,
  `ID_CROMO` int(11) NOT NULL,
  `CANTIDAD` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `ID` int(11) NOT NULL,
  `ALBUM` int(11) DEFAULT NULL,
  `PREGUNTA` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `ID` int(11) NOT NULL,
  `PREGUNTA` int(11) DEFAULT NULL,
  `SOLUCION` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sobre`
--

CREATE TABLE `sobre` (
  `ID` int(11) NOT NULL,
  `ALBUM` int(11) DEFAULT NULL,
  `NOMBRE` varchar(255) DEFAULT NULL,
  `IMAGEN` longblob DEFAULT NULL,
  `DESCRIPCION` text DEFAULT NULL,
  `NUM_CROMOS` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID` int(11) NOT NULL,
  `NOMBRE` varchar(255) DEFAULT NULL,
  `APELLIDO1` varchar(255) DEFAULT NULL,
  `APELLIDO2` varchar(255) DEFAULT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `NOMBRE_USUARIO` varchar(255) DEFAULT NULL,
  `CONTRASEÑA` varchar(255) DEFAULT NULL,
  `IMAGEN` longblob DEFAULT NULL,
  `MONEDAS` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `COLECCION` (`COLECCION`);

--
-- Indices de la tabla `album_personal`
--
ALTER TABLE `album_personal`
  ADD PRIMARY KEY (`ID_USU`,`ID_ALBUM`),
  ADD KEY `ID_ALBUM` (`ID_ALBUM`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `categorias_coleccion`
--
ALTER TABLE `categorias_coleccion`
  ADD PRIMARY KEY (`ID_COLECCIÓN`,`ID_CATEGORIAS`),
  ADD KEY `ID_CATEGORIAS` (`ID_CATEGORIAS`);

--
-- Indices de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `cromos`
--
ALTER TABLE `cromos`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ALBUM` (`ALBUM`);

--
-- Indices de la tabla `cromos_personal`
--
ALTER TABLE `cromos_personal`
  ADD PRIMARY KEY (`ID_USU`,`ID_CROMO`),
  ADD KEY `ID_CROMO` (`ID_CROMO`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ALBUM` (`ALBUM`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PREGUNTA` (`PREGUNTA`);

--
-- Indices de la tabla `sobre`
--
ALTER TABLE `sobre`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ALBUM` (`ALBUM`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `album`
--
ALTER TABLE `album`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cromos`
--
ALTER TABLE `cromos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sobre`
--
ALTER TABLE `sobre`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `album`
--
ALTER TABLE `album`
  ADD CONSTRAINT `album_ibfk_1` FOREIGN KEY (`COLECCION`) REFERENCES `colecciones` (`ID`);

--
-- Filtros para la tabla `album_personal`
--
ALTER TABLE `album_personal`
  ADD CONSTRAINT `album_personal_ibfk_1` FOREIGN KEY (`ID_USU`) REFERENCES `usuario` (`ID`),
  ADD CONSTRAINT `album_personal_ibfk_2` FOREIGN KEY (`ID_ALBUM`) REFERENCES `album` (`ID`);

--
-- Filtros para la tabla `categorias_coleccion`
--
ALTER TABLE `categorias_coleccion`
  ADD CONSTRAINT `categorias_coleccion_ibfk_1` FOREIGN KEY (`ID_COLECCIÓN`) REFERENCES `colecciones` (`ID`),
  ADD CONSTRAINT `categorias_coleccion_ibfk_2` FOREIGN KEY (`ID_CATEGORIAS`) REFERENCES `categorias` (`ID`);

--
-- Filtros para la tabla `cromos`
--
ALTER TABLE `cromos`
  ADD CONSTRAINT `cromos_ibfk_1` FOREIGN KEY (`ALBUM`) REFERENCES `album` (`ID`);

--
-- Filtros para la tabla `cromos_personal`
--
ALTER TABLE `cromos_personal`
  ADD CONSTRAINT `cromos_personal_ibfk_1` FOREIGN KEY (`ID_USU`) REFERENCES `usuario` (`ID`),
  ADD CONSTRAINT `cromos_personal_ibfk_2` FOREIGN KEY (`ID_CROMO`) REFERENCES `cromos` (`ID`);

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `preguntas_ibfk_1` FOREIGN KEY (`ALBUM`) REFERENCES `album` (`ID`);

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`PREGUNTA`) REFERENCES `preguntas` (`ID`);

--
-- Filtros para la tabla `sobre`
--
ALTER TABLE `sobre`
  ADD CONSTRAINT `sobre_ibfk_1` FOREIGN KEY (`ALBUM`) REFERENCES `album` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

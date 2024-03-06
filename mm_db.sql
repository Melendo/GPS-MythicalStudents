-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-03-2024 a las 18:03:26
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
-- Estructura de tabla para la tabla `mm_categorias`
--

CREATE TABLE `mm_categorias` (
  `id` int(11) NOT NULL,
  `categoria` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `mm_categorias`
--

INSERT INTO `mm_categorias` (`id`, `categoria`) VALUES
(1, 'DEPORTES'),
(2, 'FUTBOL'),
(4, 'MATEMATICAS'),
(3, 'PERSONAS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mm_categorias_coleccion`
--

CREATE TABLE `mm_categorias_coleccion` (
  `id_coleccion` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mm_coleccion`
--

CREATE TABLE `mm_coleccion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `imagen` blob NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `mm_categorias`
--
ALTER TABLE `mm_categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categoria` (`categoria`);

--
-- Indices de la tabla `mm_categorias_coleccion`
--
ALTER TABLE `mm_categorias_coleccion`
  ADD PRIMARY KEY (`id_coleccion`,`id_categoria`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `mm_coleccion`
--
ALTER TABLE `mm_coleccion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `mm_categorias`
--
ALTER TABLE `mm_categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `mm_coleccion`
--
ALTER TABLE `mm_coleccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mm_categorias_coleccion`
--
ALTER TABLE `mm_categorias_coleccion`
  ADD CONSTRAINT `mm_categorias_coleccion_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `mm_categorias` (`id`);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

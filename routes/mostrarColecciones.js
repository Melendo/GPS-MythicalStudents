var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = require('../connection/connection.js');

//Obtenemos las colecciones
function getColecciones(con, callback) {
    const query = "SELECT * FROM colecciones;";
    con.query(query, (error, colecciones) => {
        callback(error, colecciones);
    });
}

//Obtenemos la imagen de una coleccion con su id 
function getColeccionImagen(con, id, callback) {
    const sqlColecciones = "SELECT IMAGEN FROM colecciones WHERE ID = ?;";
    con.query(sqlColecciones, [id], (error, result) => {
        callback(error, result);
    });
}

router.get('/', function (req, res, next) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }
        getColecciones(con, (error, colecciones) => {
            if (error) {
                con.release();
                return res.status(500).json({ error: "Error al obtener las colecciones de la base de datos" });
            }
            con.release();
            res.render('mostrarColecciones', { colecciones: colecciones });
        });
    });
});

router.get('/imagen/:id', function (req, res, next) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }
        getColeccionImagen(con, req.params.id, (error, result) => {
            con.release();
            if (error) {
                return res.status(500).json({ error: "Error al obtener la imagen de la colección de la base de datos" });
            }
            if (result.length === 0 || !result[0].IMAGEN) {
                return res.status(404).json({ error: "Imagen no encontrada" });
            }
            res.contentType('image/png'); 
            res.send(result[0].IMAGEN);
        });
    });
});


module.exports = router;
module.exports.getColecciones = getColecciones;
module.exports.getColeccionImagen = getColeccionImagen;
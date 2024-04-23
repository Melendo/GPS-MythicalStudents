var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = require('../connection/connection.js');

function getColecciones(con, callback) {
    const query = "SELECT * FROM colecciones;";
    con.query(query, (error, colecciones) => {
        if (error) {
            // Si hay un error durante la consulta, pasar el error al callback
            callback(error, null);
        } else {
            // Si no hay errores, pasar las colecciones al callback
            callback(null, colecciones);
        }
    });
}


function getColeccionImagen(con, id, callback) {
    const sqlColecciones = "SELECT IMAGEN FROM colecciones WHERE ID = ?;";
    con.query(sqlColecciones, [id], (error, result) => {
        if (error) {
            callback(error, null); // Pasar el error al callback
        } else {
            callback(null, result); // Pasar el resultado al callback
        }
    });
}


router.get('/', function (req, res, next) {
    var user = req.session.user;
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
            res.render('mostrarColecciones', { user: user, title: 'LISTA DE COLECCIONES', colecciones: colecciones });
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
var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = require('../connection/connection.js');

function getColecciones(con, callback) {
    const query = "SELECT * FROM colecciones;";
    con.query(query, (error, colecciones) => {
        callback(error, colecciones);
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

module.exports = router;
module.exports.getColecciones = getColecciones;
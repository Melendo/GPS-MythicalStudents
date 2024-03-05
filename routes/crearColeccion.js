var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');
const multer = require("multer");
const multerFactory = multer({storage: multer.memoryStorage()});

/* GET home page. */
router.get('/consultarNombre', function(req, res) {    
    db.getConnection(function (error, con) {
        const querySql = 'SELECT * FROM mm_coleccion WHERE nombre = ?';
        var nombre = req.query.nombre;
        con.query(querySql, [nombre], (error, result) => {
            if (error) {
                throw error;
            }

            con.release();
            if (result.length > 0) {
                // si existe en la base de datos devuelve true
                res.send(true);
            }
            else {
                res.send(false);
            }
        });
    });
});



router.post('/insertarColeccion', multerFactory.single('foto'), (req, res) => {
    
    db.getConnection(function (error, con) {
        const querySql = 'INSERT INTO mm_coleccion (nombre, imagen, descripcion) VALUES (?, ?, ?)';

        let { nombre, descripcion, categorias } = req.body;
        // Verificar si req.file está definido antes de acceder a req.file.buffer
        let foto = req.file ? req.file.buffer : null;

        con.query(querySql, [nombre, "foto", descripcion], (error, result) => {
            if (error) {
                throw error;
            }

            con.release();

            res.json({ insertado: true });
        });
    });
    
  });

module.exports = router;
var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

/* GET home page. */
router.get('/consultarNombre', function (req, res) {
    db.connect(function (error) {
        if (error) {
            throw error;
        }
        const querySql = 'SELECT * FROM mm_coleccion WHERE nombre = ?';
        var nombre = req.query.nombre;
        db.query(querySql, [nombre], (error, result) => {
            if (error) {
                throw error;
            }
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



router.post('/insertarColeccion', multerFactory.single('imagen'), (req, res) => {

    db.connect(function (error) {
        const querySqlInsertColeccion = 'INSERT INTO mm_coleccion (nombre, imagen, descripcion) VALUES (?, ?, ?)';
        const querySqlSelectUltimaColeccion = 'SELECT MAX(id) AS id FROM mm_coleccion'; // Obtener el último ID insertado
        const querySqlSelectIdsCategorias = 'SELECT id FROM mm_categorias WHERE categoria IN (?)'; // Obtener IDs de categorías
        const querySqlInsertCategoriasColeccion = 'INSERT INTO mm_categorias_coleccion (id_coleccion, id_categoria) VALUES (?, ?)'; // Insertar en la tabla categorias_coleccion

        let { nombre, descripcion } = req.body;
        let categorias = req.body.categorias.split(',');

        // Verificar si req.file está definido antes de acceder a req.file.buffer
        let foto = req.file ? req.file.buffer : null;

        db.query(querySqlInsertColeccion, [nombre, foto, descripcion], (error, result) => {
            if (error) {
                throw error;
            }

            // Obtener el ID de la última colección insertada
            db.query(querySqlSelectUltimaColeccion, (error, rows) => {
                if (error) {
                    throw error;
                }

                const idColeccion = rows[0].id;

                // Obtener los IDs de las categorías
                db.query(querySqlSelectIdsCategorias, [categorias], (error, rows) => {
                    if (error) {
                        throw error;
                    }

                    const idsCategorias = rows.map(row => row.id);

                    // Insertar en la tabla categorias_coleccion
                    idsCategorias.forEach(idCategoria => {
                        db.query(querySqlInsertCategoriasColeccion, [idColeccion, idCategoria], (error, result) => {
                            if (error) {
                                throw error;
                            }
                        });
                    });
                    res.json({ insertado: true });
                });
            });
        });
    });

});

module.exports = router;
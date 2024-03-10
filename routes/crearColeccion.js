var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

/* GET home page. */
router.get('/consultarNombre', function (req, res) {
    db.getConnection(function (error, con) {
        const querySql = 'SELECT * FROM mm_coleccion WHERE nombre = ?';
        var nombre = req.query.nombre;
        con.query(querySql, [nombre], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();
            res.send(result.length > 0);
        });
    });
});



router.post('/insertarColeccion', multerFactory.single('imagen'), (req, res) => {

    db.getConnection(function (error, con) {
        const querySqlInsertColeccion = 'INSERT INTO mm_coleccion (nombre, imagen, descripcion) VALUES (?, ?, ?)';
        const querySqlSelectUltimaColeccion = 'SELECT MAX(id) AS id FROM mm_coleccion'; // Obtener el último ID insertado
        const querySqlSelectIdsCategorias = 'SELECT id FROM mm_categorias WHERE categoria IN (?)'; // Obtener IDs de categorías
        const querySqlInsertCategoriasColeccion = 'INSERT INTO mm_categorias_coleccion (id_coleccion, id_categoria) VALUES (?, ?)'; // Insertar en la tabla categorias_coleccion

        let { nombre, descripcion } = req.body;
        let categorias = req.body.categorias.split(',');

        // Verificar si req.file está definido antes de acceder a req.file.buffer
        let foto = req.file ? req.file.buffer : null;

        con.query(querySqlInsertColeccion, [nombre, foto, descripcion], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }

            // Obtener el ID de la última colección insertada
            con.query(querySqlSelectUltimaColeccion, (error, rows) => {
                if (error) {
                    con.release();
                    throw error;
                }

                const idColeccion = rows[0].id;

                // Obtener los IDs de las categorías
                con.query(querySqlSelectIdsCategorias, [categorias], (error, rows) => {
                    if (error) {
                        con.release();
                        throw error;
                    }

                    const idsCategorias = rows.map(row => row.id);

                    // Insertar en la tabla categorias_coleccion
                    idsCategorias.forEach(idCategoria => {
                        con.query(querySqlInsertCategoriasColeccion, [idColeccion, idCategoria], (error, result) => {
                            if (error) {
                                con.release();
                                throw error;
                            }
                        });
                    });

                    con.release();
                    res.json({ insertado: true });
                });
            });
        });
    });
});

module.exports = router;
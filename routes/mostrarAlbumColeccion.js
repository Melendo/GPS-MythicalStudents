var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = require('../connection/connection.js');


// Función para obtener los cromos totales
function getAlbumesTotales(coleccion, con, callback) {
    const albumesTotalesQuery = "SELECT * FROM album WHERE coleccion = ?;";
    con.query(albumesTotalesQuery, [coleccion], (error, albumesTotales) => {
        callback(error, albumesTotales);
    });
}

// Función para obtener los cromos personales
function getAlbumesPersonales(coleccion, usuario, con, callback) {
    const albumesPersonalesQuery = "SELECT * FROM album_personal, album WHERE ID_ALBUM = ID AND coleccion = ? AND ID_USU = ?;";
    con.query(albumesPersonalesQuery, [coleccion, usuario], (error, albumesPersonales) => {
        callback(error, albumesPersonales);
    });
}

// Función para obtener la información del álbum
function getInfoColeccion(coleccion, con, callback) {
    const infoColeccionQuery = "SELECT * FROM coleccion WHERE ID = ?;";
    con.query(infoColeccionQuery, [coleccion], (error, infoColeccion) => {
        callback(error, infoColeccion);
    });
}

// Controlador original
router.get('/:coleccion', function (req, res, next) {
    const coleccion = req.params.coleccion;
    var user = req.session.user;
    db.getConnection(function (error, con) {
        if (error) {
            throw error;
        }
        getAlbumesTotales(coleccion, con, (error, albumesTotales) => {
            if (error) {
                con.release();
                throw error;
            }
            getAlbumesPersonales(coleccion,user, con, (error, albumesPersonales) => {
                if (error) {
                    con.release();
                    throw error;
                }
                getInfoColeccion(coleccion, con, (error, infoColeccion) => {
                    if (error) {
                        con.release();
                        throw error;
                    }
                    con.release();
                    res.render('informacionColeccion', {
                        user: user,
                        title: 'Estanteria Virtual',
                        album: infoColeccion,
                        monedas: req.session.user.MONEDAS,
                        cromosPersonales: albumesPersonales,
                        cromosTotales: albumesTotales
                    });
                });
            });
        });
    });
});


router.get('/imagen/:id', function (req, res, next) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlAlbumes = "SELECT IMAGEN FROM album WHERE ID = ?";
        con.query(sqlAlbumes, [req.params.id], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();

            // Envía la imagen como respuesta al cliente
            res.send(result[0].IMAGEN);
        });
    });

});

module.exports = router;

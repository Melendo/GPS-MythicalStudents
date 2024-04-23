var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');


// Función para obtener los cromos totales
function getCromosTotales(album, con, callback) {
    const cromosTotalesQuery = "SELECT * FROM cromos WHERE album = ?;";
    con.query(cromosTotalesQuery, [album], (error, cromosTotales) => {
        if (error) {
            con.release();
            throw error;
        }
        callback(error, cromosTotales);
    });
}

// Función para obtener los cromos personales
function getCromosPersonales(id, album, con, callback) {
    const cromosPersonalesQuery = "SELECT c.*, cp.* FROM cromos c JOIN cromos_personal cp ON c.ID = cp.ID_CROMO WHERE cp.ID_USU = ? AND c.ALBUM = ?;";
    con.query(cromosPersonalesQuery, [id, album], (error, cromosPersonales) => {
        if (error) {
            con.release();
            throw error;
        }
        callback(error, cromosPersonales);
    });
}

// Función para obtener la información del álbum
function getInfoAlbum(album, con, callback) {
    const infoAlbumQuery = "SELECT * FROM album WHERE ID = ?;";
    con.query(infoAlbumQuery, [album], (error, infoAlbum) => {
        if (error) {
            con.release();
            throw error;
        }
        callback(error, infoAlbum);
    });
}

// Controlador original
router.get('/:album', function (req, res, next) {
    const album = req.params.album;
    var user = req.session.user;

    if (typeof user !== 'undefined') {
        db.getConnection(function (error, con) {
            if (error) {
                con.release();
                throw error;
            }
            getCromosTotales(album, con, (error, cromosTotales) => {
                getCromosPersonales(user.ID, album, con, (error, cromosPersonales) => {
                    getInfoAlbum(album, con, (error, infoAlbum) => {
                        con.release();
                        res.render('album', {
                            user: user,
                            title: 'Estanteria Virtual',
                            album: infoAlbum,
                            cromosPersonales: cromosPersonales,
                            cromosTotales: cromosTotales
                        });
                    });
                });
            });
        });
    }
    else {
        res.redirect('/inicioSesion');
    }
    
});


router.get('/imagen/:id', function (req, res, next) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlAlbumes = "SELECT IMAGEN FROM cromos WHERE ID = ?";
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
module.exports.getCromosTotales = getCromosTotales;
module.exports.getCromosPersonales = getCromosPersonales;
module.exports.getInfoAlbum = getInfoAlbum;
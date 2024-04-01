var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = require('../connection/connection.js');


router.get('/:album', function (req, res, next) {

    const album = req.params.album;
    
    db.getConnection(function (error, con) {
        const cromosTotalesQuey = "SELECT * FROM cromos WHERE album = ?;";
        var a = cromosTotalesQuey;

        con.query(cromosTotalesQuey,[album] ,(error, cromosTotales) => {
            if (error) {
                con.release();
                throw error;
            }
            const cromosPersonalesQuery = "SELECT * FROM cromos_personal, cromos WHERE ID_CROMO = ID AND album = ?;";

            con.query(cromosPersonalesQuery,[album] ,(error, cromosPersonales) => {
                if (error) {
                    con.release();
                    throw error;
                }
                
                const infoAlbumQuery = "SELECT * FROM album WHERE ID = ?;";
                con.query(infoAlbumQuery,[album] ,(error, infoAlbum) => {
                    if (error) {
                        con.release();
                        throw error;
                    }
                    con.release();
                    
                    res.render('album', {title: 'Estanteria Virtual', album: infoAlbum, monedas: req.session.user.MONEDAS, cromosPersonales:cromosPersonales,cromosTotales:cromosTotales });

                });
            });
        });
    });
});

router.get('/imagen:id', function (req, res, next) {
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
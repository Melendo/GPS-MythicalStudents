var express = require('express');
var router = express.Router();


const db = require('../connection/connection.js');


// Función principal para manejar la ruta POST
router.post('/:id', (req, res) => {
    var user = req.session.user;
    const idAlbum = req.params.id;

    db.getConnection((error, con) => {
        if (error) {
            con.release();
            throw error;
        }

        comprobarAlbum(con, user.ID, idAlbum, (albumesResult) => {
            if (albumesResult.length > 0) {
                res.json({ success: false, mensajeError: "Ya tienes agregado ese album" });
            } 
            else {
                agregarAlbum(con, user.ID, idAlbum, (insertarAlbumResult) => {
                    con.release();
                    res.json({ success: true, mensaje: "El álbum ha sido agregado a tu estantería virtual satisfactoriamente." });
                });
            }
        });
    });
});


// Función para comprobar si el usuario tiene el álbum al que pertenece el sobre
function comprobarAlbum(con, idUsuario, idAlbum, callback) {
    const querySqlComprobarAlbum = 'SELECT * FROM album_personal WHERE ID_USU = ? AND ID_ALBUM = ?';
    con.query(querySqlComprobarAlbum, [idUsuario, idAlbum], (error, albumesResult) => {
        if (error) {
            con.release();
            throw error;
        }
        callback(albumesResult);
    });
}


function agregarAlbum(con, idUsuario, idAlbum, callback) {
    const querySqlInsertarAlbum = 'INSERT INTO album_personal (ID_USU, ID_ALBUM) VALUES (?, ?) ';
    con.query(querySqlInsertarAlbum, [idUsuario, idAlbum], (error, insertarAlbumResult) => {
        if (error) {
            con.release();
            throw error;
        }
        callback(insertarAlbumResult);
    });
}


// ROUTER
module.exports = router;


// FUNCIONES
module.exports.comprobarAlbum = comprobarAlbum;
module.exports.agregarAlbum = agregarAlbum;

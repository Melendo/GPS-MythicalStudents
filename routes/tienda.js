var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');


router.get('/', function (req, res, next) {
    var user = req.session.user;

    if (typeof user !== 'undefined') {
        db.getConnection(function (error, con) {
            if (error) {
                con.release();
                throw error;
            }
            const sqlAlbumes = "SELECT sobre.* FROM sobre, album_personal WHERE sobre.ALBUM = album_personal.ID_ALBUM AND album_personal.ID_USU = ?"
            con.query(sqlAlbumes, [user.ID], (error, result) => {
                if (error) {
                    con.release();
                    throw error;
                }
                con.release();
    
                res.render('tienda', { user: user, title: 'MYTHICAL MINGLE', sobres: result });
            });
        });
    }
    else {
        res.redirect('/inicioSesion');
    }

    

});

router.get('/imagen:id', function (req, res, next) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlAlbumes = "SELECT IMAGEN FROM sobre WHERE ID = ?";
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
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
            const querySqlAlbumes = 'SELECT * FROM album_personal WHERE ID_USU = ?';
            con.query(querySqlAlbumes, [user.ID], (error, albumesResult) => {
                if (error) {
                  con.release();
                  throw error;
                }
                req.session.albumes = albumesResult;
                var albumes = [];
                for (var i = 0; i < albumesResult.length; i++) {
                    albumes.push(albumesResult[i].ID_ALBUM);
                }
                var ids = albumes.join(', ');
                console.log(albumes);

                if (ids !== "") {
                    const albumesQuery = "SELECT * FROM album WHERE id IN(" + ids + ");";
        
                    con.query(albumesQuery, (error, result) => {
                        if (error) {
                            con.release();
                            throw error;
                        }
                        con.release();
                        res.render('estanteriaVirtual', { user: user, title: 'Estantería Virtual', albumes: result });
                    });
                
                }
                else {
                    res.render('estanteriaVirtual', { user: user, title: 'Estantería Virtual', albumes: "" });
                }
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
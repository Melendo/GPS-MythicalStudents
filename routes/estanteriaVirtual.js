var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');


router.get('/', function (req, res, next) {

    var user = req.session.user;

    if (typeof user !== 'undefined') {
        var albumes = [];
        for (var i = 0; i < req.session.albumes.length; i++) {
            albumes.push(req.session.albumes[i].ID_ALBUM);
        }
        var ids = albumes.join(', ');

        if (ids !== "") {
            db.getConnection(function (error, con) {
                const albumesQuery = "SELECT * FROM album WHERE id IN(" + ids + ");";
                var a = albumesQuery;
    
                con.query(albumesQuery, (error, result) => {
                    if (error) {
                        con.release();
                        throw error;
                    }
                    con.release();
                    res.render('estanteriaVirtual', { title: 'Estanteria Virtual', albumes: result, monedas: user.MONEDAS });
                });
            });
        }
        else {
            res.render('estanteriaVirtual', { title: 'Estanteria Virtual', albumes: "", monedas: user.MONEDAS });
        }
       
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
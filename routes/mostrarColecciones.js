var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = require('../connection/connection.js');


router.get('/', function (req, res, next) {
    var user = req.session.user;

    var albumes = [];
    for (var i = 0; i < req.session.albumes.length; i++) {
        albumes.push(req.session.albumes[i].ID_ALBUM);
    }
    var ids = albumes.join(', ');

    db.getConnection(function (error, con) {
        const albumesQuery = "SELECT * FROM album WHERE id IN(" + ids + ");";
        var a = albumesQuery;

        con.query(albumesQuery, (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();
            res.render('mostrarColecciones', { user: user, title: 'Mostrar Colecciones', albumes: result, monedas: req.session.user.MONEDAS });
        });
    });
});





module.exports = router;
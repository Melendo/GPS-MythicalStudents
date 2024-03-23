var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = require('../connection/connection.js');


router.get('/', function (req, res, next) {

    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlAlbumes = "SELECT sobre.* FROM sobre, album_personal WHERE sobre.ALBUM = album_personal.ID_ALBUM AND album_personal.ID_USU = ?"
        con.query(sqlAlbumes, [req.session.user.ID], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();

            res.render('tienda', { title: 'Tienda', sobres: result , monedas:req.session.user.MONEDAS});
        });
    });

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
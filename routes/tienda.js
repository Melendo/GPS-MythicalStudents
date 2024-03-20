var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');


router.get('/', function (req, res, next) {

    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlAlbumes = "SELECT sobre.* FROM sobre, album_personal WHERE sobre.ALBUM = album_personal.ID_ALBUM AND album_personal.ID_USU = ?"
        con.query(sqlAlbumes, ["1"], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();
            res.render('tienda', { title: 'Tienda', sobres : result });
        });
    });

});

module.exports = router;
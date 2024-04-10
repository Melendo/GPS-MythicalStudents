var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET animacion sobre page with parameters */
router.get('/:sobre', function(req, res) {
    const idSobre = req.params.sobre;
    res.render('animacionSobre', { idSobre: idSobre });
});


router.get('/nombre/:id', function (req, res) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlSobres = "SELECT NOMBRE FROM cromos WHERE ID = ?";
        con.query(sqlSobres, [req.params.id], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();
            res.send(result[0].NOMBRE);
        });
    });
});


router.get('/imagen/:id', function (req, res) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlSobres = "SELECT IMAGEN FROM cromos WHERE ID = ?";
        con.query(sqlSobres, [req.params.id], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();

            res.send(result[0].IMAGEN);
        });
    });

});


module.exports = router;
var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET abrirSobre page with parameters */
router.get('/:album/:id/:numerosAleatorios', function(req, res) {
    const idSobre = req.params.id;
    const album = req.params.album;
    const numerosAleatorios = req.params.numerosAleatorios.split(',').map(Number);
    res.render('abrirSobre', { idSobre: idSobre, album: album, numeros: JSON.stringify(numerosAleatorios) });
});

router.get('/imagen:id', function (req, res) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlSobres = "SELECT IMAGEN FROM sobre WHERE ID = ?";
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

router.get('/:album/:numero', function(req, res) {
    const numeroCromo = req.params.numero;
    const albumCromo = req.params.album;
    
    db.getConnection(function(error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlNombreCromo = "SELECT NOMBRE FROM cromos WHERE NUM_CROMO = ? AND ALBUM = ?";
        con.query(sqlNombreCromo, [numeroCromo, albumCromo], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();

            if (result.length > 0) {
                res.json({ nombre: result[0].NOMBRE });
            } else {
                res.json({ nombre: "Nombre no encontrado" });
            }
        });
    });
});

module.exports = router;

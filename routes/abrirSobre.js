var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET abrirSobre page with parameters */
router.get('/:album/:id/:numerosAleatorios', function(req, res) {
    const idSobre = req.params.id;
    const album = req.params.album;
    const numerosAleatorios = req.params.numerosAleatorios.split(',').map(Number);

    var user = req.session.user;

    if (typeof user !== 'undefined') {
     // Realiza la consulta para obtener el nombre del sobre
        db.getConnection(function(error, con) {
            if (error) {
                con.release();
                throw error;
            }
            const sqlSobre = "SELECT NOMBRE FROM sobre WHERE ID = ?";
            con.query(sqlSobre, [idSobre], (error, result) => {
                con.release();
                if (error) {
                    throw error;
                }
                
                // Si se encontró un nombre, lo pasamos a la plantilla, de lo contrario, pasamos un mensaje
                const nombreSobre = result.length > 0 ? result[0].NOMBRE : "Nombre no encontrado";
                
                // Renderiza la plantilla abrirSobre.ejs con los datos proporcionados
                res.render('abrirSobre', { idSobre: idSobre, album: album, numeros: JSON.stringify(numerosAleatorios), nombreSobre: nombreSobre });
            });
        });
    }
    else {
        res.redirect('/inicioSesion');
    }
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
        const sqlNombreCromo = "SELECT ID FROM cromos WHERE NUM_CROMO = ? AND ALBUM = ?";
        con.query(sqlNombreCromo, [numeroCromo, albumCromo], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();
            
            if (result.length > 0) {
                res.json({ id: result[0].ID });
            } else {
                res.json({ id: 0 });
            }
        });
    });
});

module.exports = router;

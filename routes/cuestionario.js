var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

router.get('/', function (req, res) {
    res.render('finalCuestionario');
});


// Función para actualizar el número total de monedas
function actualizarMonedas(idUsuario, nuevasMonedas, callback) {
    const sqlActualizarMonedas = "UPDATE usuario SET MONEDAS = MONEDAS + ? WHERE ID = ?";
    db.getConnection(function (error, con) {
        if (error) {
            throw error;
        }
        con.query(sqlActualizarMonedas, [nuevasMonedas, idUsuario], (error, result) => {
            con.release();
            if (error) {
                return callback(error);
            }
            callback();
        });
    });
}

// Manejador de la ruta
router.get('/reclamar:monedas', function (req, res) {
    const idUsuario = req.session.user.ID;
    const nuevasMonedas = req.params.monedas;

    actualizarMonedas(idUsuario, nuevasMonedas, (error) => {
        if (error) {
            res.status(500).json({ mensaje: 'Error al actualizar las monedas' });
        } else {
            res.status(200).json({ mensaje: 'Número de monedas actualizado correctamente' });
        }
    });
});


module.exports = router;
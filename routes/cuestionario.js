var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');


// Función para actualizar el número total de monedas
function actualizarMonedas(idUsuario, nuevasMonedas, callback) {
    const sqlActualizarMonedas = "UPDATE usuarios SET MONEDAS = MONEDAS + ? WHERE ID = ?";
    db.getConnection(function(error, con) {
        if (error) {
            con.release();
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
router.get('/:monedas', function(req, res) {
    const idUsuario = req.session.user.ID;
    const nuevasMonedas = req.params.monedas;

    actualizarMonedas(idUsuario, nuevasMonedas, (error) => {
        if (error) {
            con.release();
            throw error;
        } 
        else {
            res.json({ mensaje: "Número de monedas actualizado correctamente" });
        }
    });
});


module.exports = router;
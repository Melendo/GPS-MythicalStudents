var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');


router.post('/comprarCromo', (req, res) => {
    var idUsuario = req.session.user.ID;
    db.getConnection(function (error, con) {
        const querySqlComprobarMonedas = 'SELECT MONEDAS FROM usuario WHERE ID = ?';
        const querySqlCosteSobre = 'SELECT COSTE FROM sobre WHERE ID = ?'
        const querySqlRestarMonedas = 'UPDATE usuario SET MONEDAS = ? WHERE ID = ?'

        let { idSobre } = req.body;

        con.query(querySqlComprobarMonedas, [idUsuario], (error, monedasResult) => {
            if (error) {
                con.release();
                throw error;
            }

            var monedas = monedasResult[0].MONEDAS;

            con.query(querySqlCosteSobre, [idSobre], (error, costeResult) => {
                if (error) {
                    con.release();
                    throw error;
                }

                const coste = costeResult[0].COSTE;

                if (monedas < coste) {
                    res.json({ success: false, mensajeError: "Monedas insuficientes" });
                }
                else {
                    var resta = monedas - coste;
                    con.query(querySqlRestarMonedas, [resta, idUsuario], (error, result) => {
                        if (error) {
                            con.release();
                            throw error;
                        }

                        //generar cromos de sobre
                        //añadir cromos a album
                        res.json({ success: true, mensaje: "Compra realizada correctamente" });
                    });
                }
            });
        });
    });
});

module.exports = router;
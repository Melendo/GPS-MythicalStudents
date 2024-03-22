var express = require('express');
var router = express.Router();

const db = require('../connection/connection.js');


router.post('/:id', (req, res) => {
    var idUsuario = req.session.user.ID;
    var monUsuario = req.session.user.MONEDAS;
    var idSobre = req.params.id;

    db.getConnection(function (error, con) {
        const querySqlSobre = 'SELECT * FROM sobre WHERE ID = ?';
        const querySqlComprobarAlbum = 'SELECT * FROM album_personal WHERE ID_USU = ? AND ID_ALBUM = ?';
        const querySqlRestarMonedas = 'UPDATE usuario SET MONEDAS = ? WHERE ID = ?';
        const querySqlCromos = 'SELECT COUNT(*) FROM cromos WHERE ALBUM = ?';
        const querySqlCromosEnCromosPersonal = 'SELECT * FROM cromos_personal WHERE ID_CROMO = ?';
        const querySqlCromoRepetido = 'UPDATE cromos_personal SET CANTIDAD = CANTIDAD + 1 WHERE ID_USU = ? AND ID_CROMO = ?';
        const querySqlCromoNuevo = 'INSERT INTO cromos_personal (ID_USU, ID_CROMO, CANTIDAD) VALUES (?, ?, 1)';
        const querySqlNombreCromo = 'SELECT NOMBRE FROM cromos WHERE NUM_CROMO = ? AND ALBUM = ?';

        con.query(querySqlSobre, [idSobre], (error, sobresResult) => {
            if (error) {
                con.release();
                throw error;
            }

            con.query(querySqlComprobarAlbum, [idUsuario, sobresResult.ALBUM], (error, albumesResult) => {
                if (error) {
                    con.release();
                    throw error;
                }
    
                if (albumesResult.length <= 0) {
                    res.json({ success: false, mensajeError: "No tienes el album al que pertenece el sobre" });
                }
    
                else {
                    if (monUsuario < sobresResult.PRECIO) {
                        res.json({ success: false, mensajeError: "Monedas insuficientes", album: sobresResult.ALBUM, nombres: null });
                    }
                    else {
                        var resta = monUsuario - sobresResult.PRECIO;
                        con.query(querySqlRestarMonedas, [resta, idUsuario], (error, restaResult) => {
                            if (error) {
                                con.release();
                                throw error;
                            }

                            con.query(querySqlCromos, [sobresResult.ALBUM], (error, totalCromos) => {
                                var numerosAleatorios = generarNumerosAleatorios(totalCromos, sobresResult.NUM_CROMOS);
                                var nombresCromos = [];

                                numerosAleatorios.forEach(numero => {
                                    con.query(querySqlNombreCromo, [numero, sobresResult.ALBUM], (error, nombreResult) => {
                                        if (error) {
                                            con.release();
                                            throw error;
                                        }
    
                                        nombresCromos.push(nombreResult);
    
                                    });

                                    con.query(querySqlCromosEnCromosPersonal, [numero], (error, results) => {
                                        if (error) {
                                            con.release();
                                            throw error;
                                        }

                                        if (results.length > 0) {
                                            con.query(querySqlCromoRepetido, [idUsuario, numero], (error, results) => {
                                                if (error) {
                                                    con.release();
                                                    throw error;
                                                }
                                            });
                                        } 
                                        else {
                                            con.query(querySqlCromoNuevo, [idUsuario, numero], (error, results) => {
                                                if (error) {
                                                    con.release();
                                                    throw error;
                                                }
                                            });
                                        }
                                    });
                                });

                                res.json({ success: true, mensaje: "Compra realizada correctamente.", album: sobresResult.ALBUM, nombres: nombresCromos });
                            });                           
                        });
                    }
                }
            });
        });
    }); 
});

function generarNumerosAleatorios(max, num) {
    const numerosAleatorios = [];
    while (numerosAleatorios.length < num) {
        const numeroAleatorio = Math.floor(Math.random() * cantidadCromos) + 1;
        numerosAleatorios.push(numeroAleatorio);
    }
    return numerosAleatorios;
}

module.exports = router;
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
        const querySqlCromosEnCromosPersonal = 'SELECT * FROM cromos_personal WHERE ID_USU = ? AND ID_CROMO = ?';
        const querySqlCromoRepetido = 'UPDATE cromos_personal SET CANTIDAD = CANTIDAD + 1 WHERE ID_USU = ? AND ID_CROMO = ?';
        const querySqlCromoNuevo = 'INSERT INTO cromos_personal (ID_USU, ID_CROMO, CANTIDAD) VALUES (?, ?, 1)';

        con.query(querySqlSobre, [idSobre], (error, sobresResult) => {
            if (error) {
                con.release();
                throw error;
            }

            con.query(querySqlComprobarAlbum, [idUsuario, sobresResult[0].ALBUM], (error, albumesResult) => {
                if (error) {
                    con.release();
                    throw error;
                }
    
                if (albumesResult.length <= 0) {
                    res.json({ success: false, mensaje: "No tienes el album al que pertenece el sobre" });
                }
    
                else {
                    if (monUsuario < sobresResult[0].PRECIO) {
                        res.json({ success: false, mensaje: "Monedas insuficientes" });
                    }
                    else {
                        var resta = monUsuario - sobresResult[0].PRECIO;
                        con.query(querySqlRestarMonedas, [resta, idUsuario], (error, restaResult) => {
                            if (error) {
                                con.release();
                                throw error;
                            }

                            con.query(querySqlCromos, [sobresResult[0].ALBUM], (error, totalCromos) => {
                                if (error) {
                                    con.release();
                                    throw error;
                                }
                                cantidadCromos = totalCromos[0]['COUNT(*)'];
                                
                                // Generar números aleatorios y continuar una vez que estén listos
                                generarNumerosAleatorios(cantidadCromos, sobresResult[0].NUM_CROMOS, (numerosAleatorios) => {
                                    console.log("Array: " + numerosAleatorios);
                                    numerosAleatorios.forEach(numero => {
                                        console.log(numero);
                                        con.query(querySqlCromosEnCromosPersonal, [idUsuario, numero], (error, cromosResults) => {
                                            if (error) {
                                                con.release();
                                                throw error;
                                            }
                                
                                            if (cromosResults.length > 0) {
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

                                    res.json({ success: true, mensaje: "Compra realizada correctamente" });
                                });
                            });                           
                        });
                    }
                }
            });
        });
    }); 
});

function generarNumerosAleatorios(max, num, callback) {
    const numerosAleatorios = [];
    while (numerosAleatorios.length < num) {
        const numeroAleatorio = Math.floor(Math.random() * max) + 1;
        numerosAleatorios.push(numeroAleatorio);
    }
    callback(numerosAleatorios);
}

module.exports = router;
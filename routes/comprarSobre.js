var express = require('express');
var router = express.Router();


const db = require('../connection/connection.js');



// Función principal para manejar la ruta POST
router.post('/:id', (req, res) => {
    const idUsuario = req.session.user.ID;
    const monUsuario = req.session.user.MONEDAS;
    const idSobre = req.params.id;
    var nuevos = [];

    db.getConnection((error, con) => {
        if (error) {
            con.release();
            throw error;
        }


        obtenerSobre(con, idSobre, (sobresResult) => {
            comprobarAlbum(con, idUsuario, sobresResult, (albumesResult) => {
                if (albumesResult.length <= 0) {
                    res.json({ success: false, mensajeError: "No tienes el álbum al que pertenece el sobre" });
                } else {
                    if (monUsuario < sobresResult.PRECIO) {
                        res.json({ success: false, mensaje: "Monedas insuficientes" });
                    } else {
                        const resta = monUsuario - sobresResult.PRECIO;
                        restarMonedas(con, resta, idUsuario, () => {
                            req.session.user.MONEDAS = resta;
                            abrirSobre(con, sobresResult, (totalCromos) => {
                                generarNumerosAleatorios(totalCromos['COUNT(*)'], sobresResult.NUM_CROMOS, (numerosAleatorios) => {
                                    procesarCromos(con, idUsuario, numerosAleatorios, (nuevosCromos) => {
                                        nuevos = nuevosCromos;
                                        //con.release();
                                        res.json({ success: true, mensaje: "Compra realizada correctamente", album: sobresResult.ALBUM, numeros: numerosAleatorios, nuevosCromos: nuevos });
                                    });
                                });
                            });
                        });
                    }
                }
            });
        });
    });
});


// Función para obtener la información del sobre
function obtenerSobre(con, idSobre, callback) {
    const querySqlSobre = 'SELECT * FROM sobre WHERE ID = ?';
    con.query(querySqlSobre, [idSobre], (error, sobresResult) => {
        if (error) {
            con.release();
            throw error;
        }
        callback(sobresResult[0]);
    });
}


// Función para comprobar si el usuario tiene el álbum al que pertenece el sobre
function comprobarAlbum(con, idUsuario, sobresResult, callback) {
    const querySqlComprobarAlbum = 'SELECT * FROM album_personal WHERE ID_USU = ? AND ID_ALBUM = ?';
    con.query(querySqlComprobarAlbum, [idUsuario, sobresResult.ALBUM], (error, albumesResult) => {
        if (error) {
            con.release();
            throw error;
        }
        callback(albumesResult);
    });
}


// Función para restar las monedas del usuario
function restarMonedas(con, resta, idUsuario, callback) {
    const querySqlRestarMonedas = 'UPDATE usuario SET MONEDAS = ? WHERE ID = ?';
    con.query(querySqlRestarMonedas, [resta, idUsuario], (error, restaResult) => {
        if (error) {
            con.release();
            throw error;
        }
        callback();
    });
}


// Función para abrir el sobre y obtener el número total de cromos en el álbum
function abrirSobre(con, sobresResult, callback) {
    const querySqlCromos = 'SELECT COUNT(*) FROM cromos WHERE ALBUM = ?';
    con.query(querySqlCromos, [sobresResult.ALBUM], (error, totalCromos) => {
        if (error) {
            con.release();
            throw error;
        }
        callback(totalCromos[0]);
    });
}


// Función para procesar los cromos obtenidos del sobre
function procesarCromos(con, idUsuario, numerosAleatorios, callback) {
    const querySqlCromosEnCromosPersonal = 'SELECT * FROM cromos_personal WHERE ID_CROMO = ?';
    const querySqlCromoRepetido = 'UPDATE cromos_personal SET CANTIDAD = CANTIDAD + 1 WHERE ID_USU = ? AND ID_CROMO = ?';
    const querySqlCromoNuevo = 'INSERT INTO cromos_personal (ID_USU, ID_CROMO, CANTIDAD) VALUES (?, ?, 1)';
    var nuevos = [];

    // Función auxiliar para procesar un cromo
    function procesarCromo(numero, index) {
        return new Promise((resolve, reject) => {
            con.query(querySqlCromosEnCromosPersonal, [numero], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        con.query(querySqlCromoRepetido, [idUsuario, numero], (error) => {
                            if (error) {
                                con.release();
                                reject(error);
                            } else {
                                nuevos.push(0);
                                resolve();
                            }
                        });
                    } else {
                        con.query(querySqlCromoNuevo, [idUsuario, numero], (error) => {
                            if (error) {
                                con.release();
                                reject(error);
                            } else {
                                nuevos.push(1);
                                resolve();
                            }
                        });
                    }
                }
            });
        });
    }


    // Utilizando reduce para procesar las promesas secuencialmente
    numerosAleatorios.reduce((promiseChain, numero, index) => {
        return promiseChain.then(() => {
            return procesarCromo(numero, index);
        });
    }, Promise.resolve())
        .then(() => {
            //con.release();
            callback(nuevos);
        })
        .catch((error) => {
            con.release();
            throw error;
        });
}




// Función para generar números aleatorios
function generarNumerosAleatorios(max, num, callback) {
    const numerosAleatorios = [];
    while (numerosAleatorios.length < num) {
        const numeroAleatorio = Math.floor(Math.random() * (max - 1 + 1)) + 1;
        numerosAleatorios.push(numeroAleatorio);
    }
    callback(numerosAleatorios);
}


// ROUTER
module.exports = router;


// FUNCIONES
module.exports.obtenerSobre = obtenerSobre;
module.exports.comprobarAlbum = comprobarAlbum;
module.exports.restarMonedas = restarMonedas;
module.exports.abrirSobre = abrirSobre;
module.exports.procesarCromos = procesarCromos;
module.exports.generarNumerosAleatorios = generarNumerosAleatorios;


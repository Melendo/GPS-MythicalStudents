var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');
const { check, validationResult } = require('express-validator');

router.get('/', function (req, res) {
    res.render('registro');
});

router.post(
    '/',
    [
        // Validamos el formato del correo electrónico
        check(
            'email',
            'Por favor, ingrese un correo electrónico válido.'
        ).isEmail(),
        // Utilizamos una expresión regular para verificar la complejidad de la contraseña
        check(
            'contraseña',
            'La contraseña debe tener al menos una minúscula, una mayúscula, un número y ser de al menos 4 caracteres de longitud.'
        ).custom((value) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/;
            return passwordRegex.test(value);
        })
    ],
    async (req, res) => {
        

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ success: false, mensajeError: errors.array() });
            return;
        }

        db.getConnection(function (error, con) {
            if (error) throw error;
            console.log("Conected!")

            const insertQuery = "INSERT INTO usuario (NOMBRE, APELLIDO1, APELLIDO2, EMAIL, NOMBRE_USUARIO, CONTRASEÑA, MONEDAS) VALUES (?,?,?,?,?,?,100)";
            var successEmail = verificarEmail(con, req.body.email);
            var successUser = verificarNombreUsuario(con, req.body.nombreUsuario);

            if (!successEmail && !successUser) {
                con.release();
                res.json({
                    success: false,
                    mensajeError: [{ msg: 'El email y el Nombre de Usuario ya existen' }],
                });
            }
            else if (!successEmail) {
                con.release();
                res.json({
                    success: false,
                    mensajeError: [{ msg: 'El email ya existe' }],
                });
            }
            else if (!successUser) {
                con.release();
                res.json({
                    success: false,
                    mensajeError: [{ msg: 'El Nombre de Usuario ya existe' }],
                });
            } else {
                
                con.query(insertQuery, [nombre, apellido1, apellido2, email, nombreUsuario, pass],(error, results) =>{
                    if (error) {
                        con.release();
                        throw error;
                    }
            
                    res.json({
                        success: true,
                        redirect: '/inicioSesion'
                    });
                })
                
            }
        })
    });

function verificarEmail(con, email) {
    const queryEmail = 'SELECT * FROM usuario WHERE EMAIL = ?';
    con.query(queryEmail, [email], (error, results) => {
        if (error) {
            con.release();
            throw error;
        }
        return (results.length === 0)
    });
}

function verificarNombreUsuario(con, nombreUsuario) {
    const queryNombreUsuario = 'SELECT * FROM usuario WHERE NOMBRE_USUARIO = ?';
    con.query(queryNombreUsuario, [nombreUsuario], (error, results) => {
        if (error) {
            con.release();
            throw error;
        }
        return (results.length > 0)
    });
}

module.exports = router;
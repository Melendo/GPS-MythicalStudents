var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');
var bcryptjs = require('bcryptjs')
const { check, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function (req, res) {
    var user = req.session.user;

    if (typeof user !== 'undefined') {
        res.redirect('/');
    }
    else {
        res.render('inicioSesion');
    }
});

/* POST inicioSesion*/
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
            'contrasena',
            'La contraseña debe tener al menos una minúscula, una mayúscula, un número y ser de al menos 4 caracteres de longitud.'
        ).custom((value) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/;
            return passwordRegex.test(value);
        }),
    ],
    (req, res) => {
        const { email, contrasena } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ success: false, mensajeError: errors.array() });
            return;
        }

        db.getConnection((error, con) => {
            if (error) {
                con.release();
                throw error;
            }

            verificarUsuario(con, email, contrasena, (usuario) => {
                if (usuario) {
                    req.session.user = usuario;
                    res.json({ success: true, redirect: '/' });
                } else {
                    res.json({
                        success: false,
                        mensajeError: [{ msg: 'Usuario o contraseña incorrectos' }],
                    });
                }
            });
        });

    }
);

// Función para obtener la información del sobre
function verificarUsuario(con, email, contrasena, callback) {
    const querySqlVerificarUsuario = 'SELECT * FROM usuario WHERE EMAIL = ?';
    con.query(querySqlVerificarUsuario, [email], async (error, results) => {
        if (error) {
            con.release();
            throw error;
        }

        if (results.length > 0) {
            const usuario = results[0];
            const contrasenaValida = await bcryptjs.compare(contrasena, usuario.CONTRASEÑA);
            if (contrasenaValida) {
                callback(usuario);
            }
            else {
                callback(null);
            }
        }
        else {
            callback(null);
        }
    });
}

module.exports = router;
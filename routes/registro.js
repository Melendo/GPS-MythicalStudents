const express = require('express');
const router = express.Router();
const db = require('../connection/connection.js');
var bcryptjs = require('bcryptjs')
const { check, validationResult } = require('express-validator');
const multer = require("multer");
const multerFactory = multer({storage: multer.memoryStorage()});

router.get('/', function (req, res) {
    var user = req.session.user;

    if (typeof user !== 'undefined') {
        res.redirect('/');
    }
    else {
        res.render('registro');
    }
});

router.post('/', multerFactory.single('foto'),
    [
        // Validamos el formato del correo electrónico
        check(
            'email',
            'Por favor, ingrese un correo electrónico válido.'
        ).isEmail(),
        // Utilizamos una expresión regular para verificar la complejidad de la contraseña
        check(
            'contrasena1',
            'La contraseña debe tener al menos una minúscula, una mayúscula, un número y ser de al menos 4 caracteres de longitud.'
        ).custom((value) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/;
            console.log(value);
            return passwordRegex.test(value);
        }),
        check("contrasena2", "Las contraseñas no coinciden.").custom((value, { req }) => value === req.body.contrasena1),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success: false, mensajeError: errors.array() });
        }

        let foto = req.file ? req.file.buffer : null;
        let pass = await bcryptjs.hash(req.body.contrasena1, 8);

        db.getConnection(function (error, con) {
            if (error) throw error;

            const insertQuery = "INSERT INTO usuario (NOMBRE, APELLIDO1, APELLIDO2, EMAIL, NOMBRE_USUARIO, CONTRASEÑA, IMAGEN, MONEDAS) VALUES (?,?,?,?,?,?,?,100)";

            verificarEmail(con, req.body.email)
                .then(successEmail => {
                    if (!successEmail) {
                        throw { message: 'Ese email ya está registrado' };
                    }
                    return verificarNombreUsuario(con, req.body.nombreUsuario);
                })
                .then(successUser => {
                    if (!successUser) {
                        throw { message: 'El Nombre de Usuario ya existe' };
                    }
                    // Ambas verificaciones pasaron, proceder con la inserción
                    return new Promise((resolve, reject) => {
                        con.query(insertQuery, [req.body.nombre, req.body.apellido1, req.body.apellido2, req.body.email, req.body.nombreUsuario, pass, foto], (error, results) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        });
                    });
                })
                .then(results => {
                    con.release();
                    res.json({
                        success: true,
                        redirect: '/inicioSesion'
                    });
                })
                .catch(error => {
                    con.release();
                    res.json({
                        success: false,
                        mensajeError: [{ msg: error.message }]
                    });
                });
        });
    }
);

function verificarEmail(con, email) {
    return new Promise((resolve, reject) => {
        const queryEmail = 'SELECT * FROM usuario WHERE EMAIL = ?';
        con.query(queryEmail, [email], (error, results) => {
            if (error) {
                con.release();
                reject(error);
            } else {
                resolve(results.length === 0);
            }
        });
    });
}

function verificarNombreUsuario(con, nombreUsuario) {
    return new Promise((resolve, reject) => {
        const queryNombreUsuario = 'SELECT * FROM usuario WHERE NOMBRE_USUARIO = ?';
        con.query(queryNombreUsuario, [nombreUsuario], (error, results) => {
            if (error) {
                con.release();
                reject(error);
            } else {
                resolve(results.length === 0);
            }
        });
    });
}

module.exports = router;

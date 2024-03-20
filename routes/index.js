var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  db.getConnection(function (error, con) {
    const querySql = 'SELECT * FROM usuario WHERE ID = 1';

    var usuario = {
      id: 1,
      nombre: "usuario",
      apellido1: "coleccionista",
      apellido2: "base",
      mail: "usuariobase@mm.es",
      nombre_usuario: "UsuarioBase",
      contraseña: "12345",
      monedas: 100
    }
    /*con.query(querySql, [], (error, result) => {
      if (error) {
        con.release();
        throw error;
      }
      con.release();
      req.session.user = usuario;
      res.render('index', { user: req.session?.user, title: "Pagina Principal" });
    });

    */

    res.render('index', { user: usuario, title: "Pagina Principal" });

  });
});

module.exports = router;
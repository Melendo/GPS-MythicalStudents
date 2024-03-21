var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function(req, res) {
  //cuando se haga lo de los multiples usuarios:
  //var user = req.session.user (que habra sido definido previamente en iniciar sesion)
  //lo mismo con los albumes personales

  db.getConnection(function (error, con) {
    const querySqlUsuario = 'SELECT * FROM usuario WHERE ID = 1';
    const querySqlAlbumes = 'SELECT * FROM album_personal WHERE ID_USU = 1';

    con.query(querySqlUsuario, [], (error, usuarios) => {
      if (error) {
        con.release();
        throw error;
      }
      con.release();
      req.session.user = usuarios[0];

      con.query(querySqlAlbumes, [], (error, albumes) => {
        if (error) {
          con.release();
          throw error;
        }
        
        req.session.albumes = albumes;

        res.render('index', { user: req.session.user, albumes: req.session.albumes, title: "Pagina Principal" });
      });
    });


   // res.render('index', { user: global.user, title: "Pagina Principal" });

  });
});

module.exports = router;
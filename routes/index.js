var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function(req, res) {

  var user = req.session.user;
  
  if (typeof user !== 'undefined') {
    db.getConnection(function (error, con) {
      const querySqlAlbumes = 'SELECT * FROM album_personal WHERE ID_USU = ?';
      const querySqlMonedas = 'SELECT MONEDAS FROM usuario WHERE ID = ?';
  
      con.query(querySqlAlbumes, [user.ID], (error, albumes) => {
        if (error) {
          con.release();
          throw error;
        }
        req.session.albumes = albumes;
        
        con.query(querySqlMonedas, [user.ID], (error, monedas) => {
          if (error) {
            con.release();
            throw error;
          }
          con.release();
          req.session.user.MONEDAS = monedas[0].MONEDAS
          res.render('index', { user: user, title: "Pagina Principal", monedas: monedas[0].MONEDAS });
        });
      });
    });
  }
  else {
    res.redirect('/inicioSesion');
  }

  
});

module.exports = router;
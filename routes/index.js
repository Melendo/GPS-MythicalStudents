var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function(req, res) {

  var user = req.session.user;
  
  if (typeof user !== 'undefined') {
    db.getConnection(function (error, con) {
      const querySqlUsuario = 'SELECT * FROM usuario WHERE ID = 1';
  
      con.query(querySqlUsuario, [], (error, usuarios) => {
        if (error) {
          con.release();
          throw error;
        }
        con.release();
        req.session.user = usuarios[0];
  
        res.render('index', { user: req.session.user, title: "Pagina Principal", monedas:req.session.user.MONEDAS });
      });
    });
  }
  else {
    res.redirect('/inicioSesion');
  }

  
});

module.exports = router;
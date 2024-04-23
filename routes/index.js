var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function(req, res) {

  var user = req.session.user;
  
  if (typeof user !== 'undefined') {
    db.getConnection(function (error, con) {
      if (error) {
        con.release();
        throw error;
      }
      const querySqlMonedas = 'SELECT MONEDAS FROM usuario WHERE ID = ?';

      con.query(querySqlMonedas, [user.ID], (error, monedas) => {
        if (error) {
          con.release();
          throw error;
        }
        con.release();
        req.session.user.MONEDAS = monedas[0].MONEDAS
        res.render('index', { user: user, title: "Pagina Principal" });
      });
    });
  }
  else {
    res.redirect('/inicioSesion');
  }

  
});

module.exports = router;
var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function(req, res) {

  var user = req.session.user;
  
  if (typeof user !== 'undefined') {
    db.getConnection(function (error, con) {
      const querySqlAlbumes = 'SELECT * FROM album_personal WHERE ID_USU = ?';
  
      con.query(querySqlAlbumes, [user.ID], (error, albumes) => {
        if (error) {
          con.release();
          throw error;
        }
        con.release();
        req.session.albumes = albumes;
  
        res.render('index', { title: "Pagina Principal", monedas: user.MONEDAS });
      });
    });
  }
  else {
    res.redirect('/inicioSesion');
  }

  
});

module.exports = router;
var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function(req, res) {
  db.getConnection(function (error, con) {
    const querySql = 'SELECT * FROM usuario WHERE id = 1';

    con.query(querySql, [], (error, result) => {
      if (error) {
        con.release();
        throw error;
      }
      con.release();
      req.session.user = result[0];
      res.render('index', { user: req.session.user, title: "Pagina Principal" });
    });
  });
});

module.exports = router;
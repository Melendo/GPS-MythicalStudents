var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('inicioSesion');
});

module.exports = router;
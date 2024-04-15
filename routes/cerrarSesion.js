var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  req.session.destroy(function(error) {
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      return res.status(500).send('Error interno del servidor');
    } else {
      res.json({ success: true });
    }
  });
});

module.exports = router;
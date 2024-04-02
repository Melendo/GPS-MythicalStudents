var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET animacion sobre page with parameters */
router.get('/:sobre', function(req, res) {
    const idSobre = req.params.sobre;
    res.render('animacionSobre', { idSobre: idSobre });
});


module.exports = router;
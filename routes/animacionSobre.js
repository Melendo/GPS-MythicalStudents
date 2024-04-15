var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET animacion sobre page with parameters */
router.get('/:sobre', function(req, res) {
    const idSobre = req.params.sobre;
    var user = req.session.user;

    if (typeof user !== 'undefined') {
        res.render('animacionSobre', { idSobre: idSobre });
    }
    else {
        res.redirect('/inicioSesion');
    }
});


module.exports = router;
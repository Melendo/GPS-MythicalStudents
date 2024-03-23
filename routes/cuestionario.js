var express = require('express');
var router = express.Router();
const db = require('../connection/connection.js');

/* GET home page. */
router.get('/', function (req, res) {

    res.render("finalCuestionario");
});

router.get("/reclamar:monedas", function (req, res) {
    var recompensa = req.params.monedas + req.session.user.MONEDAS;
    db.getConnection(function (error, con) {
        const querySqlMonedas = 'UPDATE usuario SET MONEDAS = ? WHERE ID = ?';
        con.query(querySqlMonedas, [recompensa, req.session.USER.id], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();

            res.render('index', { user: req.session.user, albumes: req.session.albumes, title: "Pagina Principal", monedas: req.session.user.MONEDAS });
        });
    });
});


module.exports = router;
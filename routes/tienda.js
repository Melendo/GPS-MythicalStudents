var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = require('../connection/connection.js');


router.get('/', function (req, res, next) {

    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlAlbumes = "SELECT sobre.* FROM sobre, album_personal WHERE sobre.ALBUM = album_personal.ID_ALBUM AND album_personal.ID_USU = ?"
        con.query(sqlAlbumes, [req.session.user[0].ID], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();

            res.render('tienda', { title: 'Tienda', sobres: result });
            //res.locals.abrirDialogConfirmar = abrirDialogConfirmar;
        });
    });

});

router.get('/imagen:id', function (req, res, next) {
    db.getConnection(function (error, con) {
        if (error) {
            con.release();
            throw error;
        }
        const sqlAlbumes = "SELECT IMAGEN FROM sobre WHERE ID = ?";
        con.query(sqlAlbumes, [req.params.id], (error, result) => {
            if (error) {
                con.release();
                throw error;
            }
            con.release();
            
            // Envía la imagen como respuesta al cliente
            res.send(result[0].IMAGEN);
        });
    });

});


/*
function abrirDialogConfirmar(id) {
    // Cargar el contenido de dialogConfirmarCompra.ejs mediante AJAX
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Crear un div para mostrar el contenido
            var div = document.createElement('div');
            div.innerHTML = xhr.responseText;
            document.body.appendChild(div);

            // Opcional: Aplicar estilos o clases al div si es necesario
            div.classList.add('dialog-confirmar-compra');

            // Opcional: Agregar un botón para cerrar la ventana emergente
            var closeButton = document.createElement('button');
            closeButton.innerHTML = 'Cerrar';
            closeButton.onclick = function() {
                document.body.removeChild(div);
            };
            div.appendChild(closeButton);
        }
    };
    xhr.open('GET', '/views/dialogConfirmarCompra.html', true);
    xhr.send();
}
*/



function abrirDialogConfirmar() {
    // Abre una ventana simple
    window.open('/views/dialogConfirmarCompra.html', 'ConfirmarCompra', 'width=400,height=200');
}

module.exports = router;
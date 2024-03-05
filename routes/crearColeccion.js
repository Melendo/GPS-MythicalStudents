var express = require('express');
var router = express.Router();

const multer = require("multer");
const multerFactory = multer({storage: multer.memoryStorage()});

/* GET home page. */
router.get('/consultarNombre', function(req, res, next) {
    // if existe en la base de datos devolver true
    res.send(false);
});

router.post('/insertarColeccion', multerFactory.single('foto'), (req, res) => {
  
    let { nombre, descripcion, categorias } = req.body;
    // Verificar si req.file está definido antes de acceder a req.file.buffer
    let foto = req.file ? req.file.buffer : null;
  
    res.json({ insertado: true });
    
  });

module.exports = router;
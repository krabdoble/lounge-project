const express = require('express')
const router = express.Router()
const reservaspasadasController = require('../controllers/reservasPasadas')

//const {validarFirebase} = require('../middlewares/validatorFirebase.js');

router.get('/:usuarioId', reservaspasadasController.getreservasPasadas)



module.exports = router
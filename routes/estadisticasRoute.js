const express = require('express')
const router = express.Router()
const estadisticasController = require('../controllers/estadisticasReservas')

const {validarFirebase} = require('../middlewares/validatorFirebase.js');

router.get('/',[validarFirebase], estadisticasController.getestadisticasReservas)



module.exports = router
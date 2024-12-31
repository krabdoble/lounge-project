const express = require('express')


const router = express.Router()
const reservaController = require('../controllers/reserva')

const {validarFirebase} = require('../middlewares/validatorFirebase.js');



router.get('/',[validarFirebase], reservaController.getReserva)
router.post('/',[validarFirebase], reservaController.createReserva)
router.put('/:id',[validarFirebase], reservaController.updateReserva)
router.delete('/:id',[validarFirebase], reservaController.deleteReserva)


module.exports = router
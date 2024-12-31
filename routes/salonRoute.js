const express = require('express')


const router = express.Router()
const salonController = require('../controllers/salon')

const {validarFirebase} = require('../middlewares/validatorFirebase.js');



router.get('/',[validarFirebase], salonController.getSalones)
router.post('/',[validarFirebase], salonController.createSalon)
router.put('/:id',[validarFirebase], salonController.updateSalon)
router.delete('/:id',[validarFirebase], salonController.deleteSalon)


module.exports = router
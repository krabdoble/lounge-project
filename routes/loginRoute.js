const express = require("express")

const router = express.Router()

const authController = require("../controllers/login")

const {validarFirebase} = require('../middlewares/validatorFirebase.js');

router.post('/', authController.createUsuario)
router.get('/',[validarFirebase], authController.getAllUsuarios)
router.delete('/:id', authController.deleteUsuario)

module.exports = router
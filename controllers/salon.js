const Salon = require("../models/salonModel")
const { response } = require("express")


const getSalones = async (req, res = response) => {
    try {
        const salones = await Salon.findAll()
        res.json(salones)
    } catch (error) {
        console.log(error)
    }
}

const createSalon = async (req, res = response) => {

    try {
        const salon = new  Salon(req.body)
        await salon.save()
        res.json(salon)
    } catch(error) {
        console.log(error)
    }

}

const updateSalon = async (req, res = response) => {
    try {
        const { id } = req.params
        const salon = await Salon.findByPk(id)
        salon.nombre = req.body.nombre
        salon.capacidad = req.body.capacidad
        salon.direccion = req.body.direccion
        await salon.save()
        res.json(salon)
    } catch (error) {
        console.log(error)
    }
}

const deleteSalon = async (req, res = response) => {
    try {
        const { id } = req.params
        const salon = await Salon.findByPk(id)
        await salon.destroy()
        res.json({msg: "Salon eliminado"})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getSalones,
    createSalon,
    updateSalon, 
    deleteSalon
}
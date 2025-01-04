const moment = require('moment-timezone');
const Reserva = require('../models/reservaModel');
const Usuario = require('../models/usuarioModel');
const Salon = require('../models/salonModel');
const { Op } = require('sequelize');
const enviarCorreoConfirmacion = require("./coreoConfirmacion"); // Importa la función
const dotenv = require('dotenv');
dotenv.config();

const createReserva = async (req, res) => {
  const { usuarioId, salonId, fechaInicio, fechaFin } = req.body;
  const user = req.user; // Información del usuario autenticado

  try {
    
    // Asegúrate de convertir a UTC al guardar en la base de datos
    const inicio = moment.tz(fechaInicio, "America/New_York").utc().format();
    const fin = moment.tz(fechaFin, "America/New_York").utc().format();

    if (inicio >= fin) {
      return res.status(400).json({ error: 'The start date must be before the end date.' });
    }

    // Verificar conflictos de horario
    const conflicto = await Reserva.findOne({
      where: {
        salonId,
        [Op.or]: [
          { fechaInicio: { [Op.between]: [inicio, fin] } },
          { fechaFin: { [Op.between]: [inicio, fin] } },
          {
            [Op.and]: [
              { fechaInicio: { [Op.lte]: inicio } },
              { fechaFin: { [Op.gte]: fin } },
            ],
          },
        ],
      },
    });

    if (conflicto) {
      return res.status(400).json({ error: 'Schedule conflict with another reservation.' });
    }

    const salon = await Salon.findByPk(salonId);

    if (!salon) {
      return res.status(404).json({ error: "The associated Lounge does not exist." });
    }

    // Crear la reserva en la base de datos con las fechas en formato local
    const reserva = await Reserva.create({ usuarioId, salonId, fechaInicio: inicio, fechaFin: fin });

    // Enviar correo con la hora correcta
    const inicioLocal = moment.utc(reserva.fechaInicio).tz("America/New_York").format("YYYY-MM-DD HH:mm");
    const finLocal = moment.utc(reserva.fechaFin).tz("America/New_York").format("YYYY-MM-DD HH:mm");


    await enviarCorreoConfirmacion(user.email, {
      ...reserva.dataValues, // Incluye los datos de la reserva
      fechaInicio: inicioLocal, // Pasar las fechas formateadas
      fechaFin: finLocal,
      salonNombre: salon.nombre, // Agrega el nombre del salón
      usuarioNombre: user.displayName.split(" ")[0], // Agrega el nombre del usuario
    });

    res.status(201).json({
      ok: true,
      mensaje: "Reservation successfully created.",
      reserva,
    });
  } catch (error) {
    console.error("Error creating the reservation:", error.message);
    res.status(500).json({ error: 'The reservation was saved but the email could not be sent' });
  }
};


/*const Reserva = require('../models/reservaModel');
const Usuario = require('../models/usuarioModel');
const Salon = require('../models/salonModel');
const { Op } = require('sequelize');
const enviarCorreoConfirmacion = require("./coreoConfirmacion"); // Importa la función
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();


const createReserva = async (req, res) => {
  const { usuarioId, salonId, fechaInicio, fechaFin } = req.body;
  const user = req.user;

  try {
    // Convertir las fechas a UTC usando moment
    const inicio = moment(fechaInicio).utc().toISOString();
    const fin = moment(fechaFin).utc().toISOString();

    if (moment(inicio).isSameOrAfter(fin)) {
      return res.status(400).json({ error: 'The start date must be before the end date.' });
    }

    // Verificar conflictos de horario
    const conflicto = await Reserva.findOne({
      where: {
        salonId,
        [Op.or]: [
          { fechaInicio: { [Op.between]: [inicio, fin] } },
          { fechaFin: { [Op.between]: [inicio, fin] } },
          {
            [Op.and]: [
              { fechaInicio: { [Op.lte]: inicio } },
              { fechaFin: { [Op.gte]: fin } },
            ],
          },
        ],
      },
    });

    if (conflicto) {
      return res.status(400).json({ error: 'Schedule conflict with another reservation.' });
    }

    const salon = await Salon.findByPk(salonId);
    if (!salon) {
      return res.status(404).json({ error: "The associated Lounge does not exist." });
    }

    // Crear la reserva con fechas UTC
    const reserva = await Reserva.create({ usuarioId, salonId, fechaInicio: inicio, fechaFin: fin });

    // Formatear fechas en la zona horaria local para el correo
    const reservaFormatted = {
      ...reserva.dataValues,
      fechaInicio: moment.utc(reserva.fechaInicio).local().format('YYYY-MM-DD HH:mm'),
      fechaFin: moment.utc(reserva.fechaFin).local().format('YYYY-MM-DD HH:mm'),
      salonNombre: salon.nombre,
      usuarioNombre: user.displayName.split(" ")[0],
    };

    // Enviar correo de confirmación
    await enviarCorreoConfirmacion(user.email, reservaFormatted);

    res.status(201).json({
      ok: true,
      mensaje: "Reservation successfully created.",
      reserva,
    });
  } catch (error) {
    console.error("Error creating the reservation:", error.message);
    res.status(500).json({ error: 'The reservation was saved but the email could not be sent.' });
  }
};*/


/*// Crear reserva y enviar correo
const createReserva = async (req, res) => {
  const {usuarioId, salonId, fechaInicio, fechaFin } = req.body;
  const user = req.user; // Información del usuario autenticado
 

  

  try {
    /*const inicio = new Date(fechaInicio).toISOString(); // Convertir a UTC
    const fin = new Date(fechaFin).toISOString();///CAMBIAR SI NO FUNCCIONA

    const inicio = new Date(fechaInicio); // Convertir a UTC
    const fin = new Date(fechaFin);

    if (inicio >= fin) {
      return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin.' });
    }

    // Verificar conflictos de horario
    const conflicto = await Reserva.findOne({
      where: {
        salonId,
        [Op.or]: [
          { fechaInicio: { [Op.between]: [inicio, fin] } },
          { fechaFin: { [Op.between]: [inicio, fin] } },
          {
            [Op.and]: [
              { fechaInicio: { [Op.lte]: inicio } },
              { fechaFin: { [Op.gte]: fin } },
            ],
          },
        ],
      },
    });

    if (conflicto) {
      return res.status(400).json({ error: 'Conflicto de horarios con otra reserva.' });
    }

    const salon = await Salon.findByPk(salonId);

    if (!salon) {
      return res.status(404).json({ error: "El salón asociado no existe." });
    }

    

    // Crear la reserva
    const reserva = await Reserva.create({ usuarioId, salonId, fechaInicio: inicio, fechaFin: fin });

    

    // Envía el correo de confirmación con el nombre del salón
    await enviarCorreoConfirmacion(user.email, {
      ...reserva.dataValues, // Incluye los datos de la reserva
      salonNombre: salon.nombre, // Agrega el nombre del salón
      usuarioNombre: user.displayName.split(" ")[0], // Agrega el nombre del usuario
    });

    res.status(201).json({
      ok: true,
      mensaje: "Reservation successfully created.",
      reserva,
    });
  } catch (error) {
    console.error("Error creating the reservation:", error.message);
    res.status(500).json({ error: 'The reservation was saved but the email could not be sent' });
  }
};*/


const getReserva = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: Usuario, attributes: ['nombre', 'imagen'] },
        { model: Salon, attributes: ['nombre'] },
      ],
    });
    res.status(200).json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

const updateReserva = async (req, res) => {
  const { id } = req.params;
  const { fechaInicio, fechaFin/*, salonId */} = req.body;

  try {
    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    reserva.fechaInicio = fechaInicio || reserva.fechaInicio;
    reserva.fechaFin = fechaFin || reserva.fechaFin;
    

    await reserva.save();
    res.status(200).json({ message: 'Reserva actualizada', reserva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la reserva' });
  }
};

const deleteReserva = async (req, res) => {
  const { id } = req.params;

  try {
    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    await reserva.destroy();
    res.status(200).json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
};

module.exports = {
  createReserva,
  getReserva,
  updateReserva,
  deleteReserva,
};

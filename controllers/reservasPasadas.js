const moment = require('moment');
const Reserva= require('../models/reservaModel');
const  Salon  = require('../models/salonModel');

exports.getreservasPasadas = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const reservasPasadas = await Reserva.findAll({
      where: {
        usuarioId,
        fechaFin: { $lt: moment().toISOString() },
      },
      include: [Salon],
    });

    res.json(reservasPasadas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas pasadas' });
  }
};

/*
const { Op } = require('sequelize');
const moment = require('moment-timezone');
const Reserva = require('../models/reservaModel');
const Salon = require('../models/salonModel');

exports.getReservasPasadas = async (req, res) => {
  const usuarioId = req.user.id; // Obtener el usuario autenticado

  try {
    //const ahora = moment().tz('America/Argentina/Buenos_Aires').toISOString();

    const ahora = moment().tz('"America/New_York"').toISOString();

    const reservasPasadas = await Reserva.findAll({
      where: {
        usuarioId,
        fechaFin: { [Op.lt]: ahora },
      },
      include: [Salon],
    });

    res.json(reservasPasadas);
  } catch (error) {
    console.error('Error al obtener reservas pasadas:', error);
    res.status(500).json({ error: 'Error al obtener reservas pasadas' });
  }
};

*/
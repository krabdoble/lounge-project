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

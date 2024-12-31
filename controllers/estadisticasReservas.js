const { Op, Sequelize } = require('sequelize'); // Importa Sequelize
const Reserva = require('../models/reservaModel'); // Importa el modelo de Reserva

const getestadisticasReservas = async (req, res) => {
  try {
    // Estadísticas por día
    const reservasPorDia = await Reserva.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('fechaInicio')), 'dia'], // Extrae la fecha
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'], // Cuenta las reservas
      ],
      group: ['dia'], // Agrupa por día
      raw: true, // Devuelve datos planos
    });

    // Estadísticas por salón
    const reservasPorSalon = await Reserva.findAll({
      attributes: [
        'salonId', // ID del salón
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'], // Cuenta las reservas
      ],
      group: ['salonId'], // Agrupa por salón
      raw: true, // Devuelve datos planos
    });

    // Procesa datos para la respuesta
    const dias = reservasPorDia.map((r) => r.dia); // Extrae las fechas
    const reservasDiaTotales = reservasPorDia.map((r) => r.total); // Extrae los totales por día

    const salones = reservasPorSalon.map((r) => r.salonId); // Extrae los IDs de salón
    const reservasSalonTotales = reservasPorSalon.map((r) => r.total); // Extrae los totales por salón

    // Responde con los datos procesados
    res.json({
      dias,
      reservasPorDia: reservasDiaTotales,
      salones,
      reservasPorSalon: reservasSalonTotales,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error); // Log del error
    res.status(500).json({ error: 'Error al obtener estadísticas' }); // Respuesta en caso de error
  }
};

module.exports = {
  getestadisticasReservas,
};

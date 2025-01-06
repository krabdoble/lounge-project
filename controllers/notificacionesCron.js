require('dotenv').config();
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment');
const Reserva= require('../models/reservaModel');
const Usuario = require("../models/usuarioModel");
const Salon = require("../models/salonModel")
const { Op } = require('sequelize');


// Configurar el transportador de nodemailer

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Tarea cron para notificar a los usuarios un día antes de su reserva
cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando tarea cron para enviar notificaciones');

  const fechaNotificacionInicio = moment().add(1, 'day').startOf('day').toDate();
  const fechaNotificacionFin = moment().add(1, 'day').endOf('day').toDate();


  try {
    // Buscar reservas programadas para mañana
    const reservas = await Reserva.findAll({
      where: {
        fechaInicio: {
          [Op.gte]: fechaNotificacionInicio,
          [Op.lt]: fechaNotificacionFin,
        },
      },
      include: [
        { model: Usuario, attributes: ["nombre", "email"] },
        { model: Salon, attributes: ["nombre"] },
      ],
    });

    // Enviar notificaciones por correo
    for (const reserva of reservas) {
      const { Usuario: usuario, Salon: salon, fechaInicio } = reserva;

      if (!usuario || !usuario.email) {
        console.error(`Usuario asociado a la reserva con ID ${reserva.id} no tiene un email.`);
        continue;
      }

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: usuario.email,
        subject: 'Reminder of your reservation',
        text: `Hello ${usuario.nombre}, remember that you have a reservation in the Lounge ${salon.nombre} on ${moment(fechaInicio).format('YYYY-MM-DD HH:mm')}. We are waiting for you!`,
      });
      console.log(`email sent to ${usuario.email}`);
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
});

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
    user: 'process.env.EMAIL_USER', //tu-email@gmail.com, Cambia a tu correo
    pass: 'process.env.EMAIL_PASS', //tu-contraseña, Cambia a tu contraseña o usa variables de entorno
  },
});

// Tarea cron para notificar a los usuarios un día antes de su reserva
cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando tarea cron para enviar notificaciones');

  /*const fechaActual = moment().startOf('day');
  const fechaNotificacion = fechaActual.add(1, 'day').toISOString();*/
  const fechaNotificacion = moment().add(1, 'day').startOf('day').toISOString();

  try {
    // Buscar reservas programadas para mañana
    const reservas = await Reserva.findAll({
      where: {
        fechaInicio: {
         /* $gte: fechaNotificacion,
          $lt: moment(fechaNotificacion).add(1, 'day').toISOString(),*/
          [Op.gte]: fechaNotificacion.toDate(),
          [Op.lt]: fechaNotificacion.clone().add(1, 'day').toDate(),
        },
      },
      include: [Usuario, Salon],
      /*include: [
        { model: Usuario, attributes: ["nombre", "email"] },
        { model: Salon, attributes: ["nombre"] },
      ],*/
    });

    // Enviar notificaciones por correo
    for (const reserva of reservas) {
      const { Usuario: usuario, Salon: salon, fechaInicio } = reserva;
      await transporter.sendMail({
        from: 'process.env.EMAIL_USER',
        to: usuario.email,
        subject: 'Recordatorio de tu reserva',
        text: `Hola ${usuario.nombre}, recuerda que tienes una reserva en el salón ${salon.nombre} el ${moment(fechaInicio).format('YYYY-MM-DD HH:mm')}. ¡Te esperamos!`,
      });
      console.log(`Correo enviado a ${usuario.email}`);
    }
  } catch (error) {
    console.error('Error al enviar notificaciones:', error);
  }
});












/*
IMPORTAR ESO EN index.js
require('./notificacionesCron');

    lo que hay que instalar
    npm install node-cron nodemailer
*/
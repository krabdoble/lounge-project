const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // O usa el servicio SMTP correspondiente
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
});



const enviarCorreoConfirmacion = async (email, reserva) => {
  try {
    const fechaInicioFormatted = moment(reserva.fechaInicio).format('YYYY-MM-DD HH:mm');
    const fechaFinFormatted = moment(reserva.fechaFin).format('YYYY-MM-DD HH:mm');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking confirmation",
      html: `
        <h1>Booking confirmation</h1>
        <p>Hello ${reserva.usuarioNombre},</p>
        <p>Your reservation has been successfully created with the following details:</p>
        <ul>
          <li><strong>Lounge:</strong> ${reserva.salonNombre}</li>
          <li><strong>Start Date:</strong> ${fechaInicioFormatted }</li>
          <li><strong>End Date:</strong> ${fechaFinFormatted}</li>
        </ul>
        <p>¡Thank you for booking with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send confirmation email.");
  }
};

module.exports = enviarCorreoConfirmacion;

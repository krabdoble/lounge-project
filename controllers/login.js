const admin = require("firebase-admin");
const Usuarios = require("../models/usuarioModel");



const createUsuario = async (req, res) => {
  const { displayName, email, photoURL, firebaseToken } = req.body;

  // Validación de entrada
  if (!firebaseToken || !displayName || !email) {
    return res.status(400).json({ ok: false, message: "Faltan datos obligatorios." });
  }

  try {
    
    // Verificar el token de Firebase
    const decodedIoken= await admin.auth().verifyIdToken(firebaseToken).then((decodedToken) => {
    const uid = decodedToken.uid;
  }); // UID único proporcionado por Firebase

    // Buscar el usuario en la base de datos por correo electrónico
    let usuario = await Usuarios.findOne({ where: { email } });

    // Si no existe, lo crea
    let creado = false; // Bandera para indicar si el usuario fue creado
    if (!usuario) {
      usuario = await Usuarios.create({
        nombre: displayName,
        email,
        imagen: photoURL || null, // Manejar el caso donde `photoURL` sea nulo
       
      });
      creado = true;
    }

    // Respuesta con el estado del usuario
    return res.status(200).json({
      ok: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        imagen: usuario.imagen,
      },
      mensaje: creado ? "Usuario creado exitosamente." : "Usuario ya existente.",
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    // Identificar errores comunes
    if (error.code === "auth/argument-error") {
      return res.status(400).json({ ok: false, message: "Token de Firebase inválido." });
    }

    // Respuesta genérica para otros errores
    return res.status(500).json({ ok: false, message: "Error al registrar usuario." });
  }
};

const getAllUsuarios = async (req, res = response) => {
    try {
        const usuario = await Usuarios.findAll();
        res.json(usuario);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

const deleteUsuario = async (req, res = response) => {
    try {
        const deleted = await Usuarios.destroy({ where: { id: req.params.id } });
        deleted ? res.status(204).send() : res.status(404).json({ error: 'Usuario no encontrado' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

module.exports = { 
    createUsuario,
    getAllUsuarios,
    deleteUsuario
 };
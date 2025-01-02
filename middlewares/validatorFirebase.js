/*const admin = require("firebase-admin")

const validarFirebase = async (req, res, next) => {
  const firebaseToken = req.headers["authorization"]?.replace("Bearer ", "")

  try {
    if (!firebaseToken) {
      return res.status(401).json({ ok: false, error: "Token no enviado" })
    }
    await admin
      .auth()
      .verifyIdToken(firebaseToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid
        
      
        next()
      })
  } catch (error) {
    console.log(error)
    return res.status(401).json({ ok: false, error: "Token inválido" })
  }
}

module.exports = {validarFirebase}*/

const admin = require("firebase-admin");

const validarFirebase = async (req, res, next) => {
  const firebaseToken = req.headers["authorization"]?.replace("Bearer ", "");

  try {
    if (!firebaseToken) {
      return res.status(401).json({ ok: false, error: "Token no enviado" });
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken).then((decodedToken) => {
    const uid = decodedToken.uid;
    
    // Asigna la información del usuario a req.user
    req.user = {
      uid,
      email: decodedToken.email, // Otras propiedades del token que necesites
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
    };

    next(); 
  })// Continúa al siguiente middleware o controlador
  } catch (error) {
    console.error("Error al validar el token de Firebase:", error);
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
};

module.exports = { validarFirebase };


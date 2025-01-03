require('dotenv').config();

const express = require('express');
const cors = require('cors')
const app = express();
require('./controllers/notificacionesCron');



app.use(cors({
  origin: ["https://salon-project-c036b.web.app"],
  /*methods: 'get,POSTPUT,DELETE',*/
  credentials: true,
}));

app.use(express.json())



const PORT = process.env.PORT || 3000;
const loginroutes= require('./routes/loginRoute');
const salonroutes= require('./routes/salonRoute');
const reservaroutes= require('./routes/reservaRoute')
const estadisticasroute= require('./routes/estadisticasRoute')
const reservaspasadasroutes= require('./routes/reservasPasadasRoute')


app.use('/api/login',loginroutes)
app.use('/api/salon', salonroutes)
app.use('/api/reserva', reservaroutes)
app.use('/api/estadisticas/reservas', estadisticasroute)
app.use('/api/reservaspasadas', reservaspasadasroutes)


let admin = require("firebase-admin");

try {
  const firebaseCredentials = process.env.FIREBASE_CREDENTIALES;

  if (!firebaseCredentials) {
    throw new Error("La variable de entorno FIREBASE_CREDENTIALS no está definida.");
  }

  const serviceAccount = JSON.parse(firebaseCredentials);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('Firebase Admin inicializado correctamente.');
} catch (error) {
  console.error('Error al inicializar Firebase Admin:', error.message);
  console.log('Contenido de FIREBASE_CREDENTIALS:', process.env.FIREBASE_CREDENTIALES);
}

app.listen(PORT,() =>{
    console.log('listening on port '+PORT);
});
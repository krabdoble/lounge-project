const { dbConnection } = require("../config/dbConnection")
const { DataTypes } = require("sequelize");
const Usuario = require("./usuarioModel");
const Salon = require("./salonModel");

const Reserva = dbConnection.define("Reserva", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    usuarioId: { type: DataTypes.INTEGER, references: { model: Usuario, key: 'id' } },
    salonId: { type: DataTypes.INTEGER, references: { model: Salon, key: 'id' } },
    fechaInicio: { type: DataTypes.DATE, allowNull: false },
    fechaFin: { type: DataTypes.DATE, allowNull: false },
  
})


    Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId' });
    Reserva.belongsTo(Salon, { foreignKey: 'salonId' });
  

Reserva.sync({alter: true})
  .then(() => {
    console.log("Tabla Reserva creada")
  })
  .catch((error) => {
    console.log(error)
  })

 

module.exports = Reserva
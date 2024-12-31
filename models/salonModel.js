const { dbConnection } = require("../config/dbConnection")
const { DataTypes } = require("sequelize")

const Salon = dbConnection.define("Salon", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 })
 


Salon.sync({alter: true})
  .then(() => {
    console.log("Tabla Salon creada")
  })
  .catch((error) => {
    console.log(error)
  })
  

 

module.exports = Salon
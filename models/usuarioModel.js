const { dbConnection } = require("../config/dbConnection")
const { DataTypes } = require("sequelize")

  const Usuario = dbConnection.define("Usuario", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    imagen: { type: DataTypes.STRING },
  });
  
  
  Usuario.sync({alter: true})
    .then(() => {
      console.log("Tabla Usuarios creada")
    })
    .catch((error) => {
      console.log(error)
    })

module.exports = Usuario
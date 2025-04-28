const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cultivo = require("./Cultivo");

const Recomendaciones = sequelize.define(
  "recomendaciones",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idCultivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cultivo,
        key: "id",
      },
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Si tienes un modelo Usuario: references: { model: Usuario, key: "id" }
    },
    fechaGeneracion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("Grave", "Media", "Leve"),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "recomendaciones",
    timestamps: false,
  }
);

module.exports = Recomendaciones;
